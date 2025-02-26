<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { appwriteService } from '@/config/appwrite';
import { Query } from 'appwrite'; // Import Query from appwrite

const store = useStore();
const calculations = ref([]);
const loading = ref(true);
const error = ref(null);
const isEmpty = computed(() => calculations.value.length === 0);

// Fetch calculations on mount
const fetchCalculations = async () => {
  const userId = store.getters.userId;
  if (!userId) {
    error.value = "You must be logged in to view calculation history";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    
    // Convert userId to integer to match the database schema
    const userIdInt = parseInt(userId, 10);
    
    // Make sure it's a valid integer
    if (isNaN(userIdInt)) {
      throw new Error('Invalid user ID format');
    }
    
    // Fix: Use the getUserCalculations method from appwriteService with integer userId
    // This method is defined in your appwrite.js file
    const response = await appwriteService.getUserCalculations(userIdInt);
    
    calculations.value = response.documents;
    loading.value = false;
  } catch (err) {
    console.error('Error fetching calculations:', err);
    error.value = `Failed to load calculations: ${err.message}`;
    loading.value = false;
  }
};

// Format the calculation type for display
const formatType = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Format date to more readable format
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

onMounted(fetchCalculations);
</script>

<template>
  <div class="calculation-history">
    <h2 class="title">Calculation History</h2>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading your calculations...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchCalculations" class="retry-button">Try Again</button>
    </div>
    
    <div v-else-if="isEmpty" class="empty-state">
      <p>No calculations found. Try solving some equations first!</p>
    </div>
    
    <div v-else class="history-container">
      <div v-for="calc in calculations" :key="calc.$id" class="history-item">
        <div class="calc-header">
          <span class="calc-type">{{ formatType(calc.type) }}</span>
          <span class="calc-date">{{ formatDate(calc.timestamp) }}</span>
        </div>
        <div class="calc-content">
          <div class="calc-input">{{ calc.input }}</div>
          <div class="calc-equals">=</div>
          <div class="calc-result">{{ calc.result }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculation-history {
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 1rem;
  background-color: #fff3f3;
  border-radius: 4px;
  border-left: 4px solid #e74c3c;
}

.error-message {
  color: #c0392b;
  margin-bottom: 1rem;
}

.retry-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #2980b9;
}

.empty-state {
  text-align: center;
  color: #7f8c8d;
  padding: 2rem;
}

.history-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.calc-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.calc-type {
  font-weight: bold;
  color: #3498db;
}

.calc-date {
  color: #95a5a6;
}

.calc-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.calc-input {
  flex: 1;
  font-family: 'Courier New', monospace;
  color: #2c3e50;
}

.calc-equals {
  margin: 0 0.5rem;
  color: #7f8c8d;
}

.calc-result {
  font-weight: bold;
  margin-left: auto;
  color: #27ae60;
  padding: 0.25rem 0.75rem;
  background: #f2f9f5;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

@media (max-width: 600px) {
  .calculation-history {
    padding: 1rem;
  }

  .calc-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .calc-equals {
    margin: 0.25rem 0;
  }

  .calc-result {
    margin-left: 0;
    width: 100%;
  }
}
</style>