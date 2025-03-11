<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { appwriteService } from '@/config/appwrite';

const store = useStore();
const calculations = ref([]);
const loading = ref(true);
const error = ref(null);
const isEmpty = computed(() => calculations.value.length === 0);
const debugInfo = ref({userId: null, userIdType: null, isLoggedIn: false});

// Fetch calculations on mount
const fetchCalculations = async () => {
  // Get current login state
  const isLoggedIn = store.getters.isLoggedIn;
  const userId = store.getters.userId;
  
  // Update debug info
  debugInfo.value = {
    userId: userId,
    userIdType: typeof userId,
    isLoggedIn: isLoggedIn
  };
  
  console.log('Fetch calculations - login state:', debugInfo.value);
  
  if (!isLoggedIn || userId === null) {
    error.value = "You must be logged in to view calculation history";
    loading.value = false;
    calculations.value = [];
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    
    console.log('Fetching calculations for userId:', userId, typeof userId);
    const response = await appwriteService.getUserCalculations(userId);
    
    calculations.value = response.documents;
    console.log(`Fetched ${calculations.value.length} calculations`);
    loading.value = false;
  } catch (err) {
    console.error('Error fetching calculations:', err);
    error.value = `Failed to load calculations: ${err.message}`;
    loading.value = false;
    calculations.value = [];
  }
};

// Enhanced watcher to monitor store changes
watch(
  () => [store.getters.isLoggedIn, store.getters.userId], 
  (newValues, oldValues) => {
    console.log('Login state changed from', oldValues, 'to', newValues);
    fetchCalculations();
  }, 
  { immediate: true, deep: true }
);

// Format the calculation type for display
const formatType = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Format date to more readable format
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

// Add a manual refresh button
const refreshData = () => {
  fetchCalculations();
};

onMounted(() => {
  console.log('Calculations history mounted, fetching data...');
  fetchCalculations();
});
</script>

<template>
  <div class="calculation-history">
    <div class="header-row">
      <h2 class="title">Calculation History</h2>
      <button @click="refreshData" class="refresh-button" :disabled="loading">
        ↻ Refresh
      </button>
    </div>
    
    <!-- Debug info visible during development -->
    <div class="debug-panel">
      <details>
        <summary>Debug Info</summary>
        <p>Logged in: {{ debugInfo.isLoggedIn }}</p>
        <p>User ID: {{ debugInfo.userId }}</p>
        <p>Type: {{ debugInfo.userIdType }}</p>
      </details>
    </div>
    
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

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.refresh-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.refresh-button:hover:not(:disabled) {
  background: #2980b9;
}

.refresh-button:disabled {
  background: #ccc;
  cursor: not-allowed;
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

.debug-panel {
  background: #eee;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.debug-panel details summary {
  cursor: pointer;
  font-weight: bold;
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