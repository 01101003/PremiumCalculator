<template>
  <div class="min-h-screen bg-beige-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-brown-800 mb-8 text-center font-press-start">
        Calculations History
      </h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center">
        <p class="text-gray-700">Loading your calculations...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="calculations.length === 0" class="text-center">
        <p class="text-gray-700">No calculations found. Start calculating to see your history here!</p>
      </div>

      <!-- Calculations List -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="calculation in calculations"
          :key="calculation.$id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-brown-800"
        >
          <!-- Calculation Type -->
          <h2 class="text-xl font-bold text-brown-800 mb-2 font-press-start">
            {{ calculation.type }}
          </h2>

          <!-- Input -->
          <p class="text-gray-700 mb-4 font-press-start">
            {{ calculation.input }}
          </p>

          <!-- Result -->
          <p class="text-gray-700 font-press-start">
            <strong>Result:</strong> {{ calculation.result }}
          </p>

          <!-- Timestamp -->
          <p class="text-gray-500 text-sm mt-4 font-press-start">
            {{ formatDate(calculation.timestamp) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { appwriteService } from '@/config/appwrite';

const store = useStore();
const calculations = ref([]);

// Fetch calculations on mount
const fetchCalculations = async () => {
  const userId = store.getters.userId;
  if (!userId) return;

  try {
    const response = await appwriteService.getUserCalculations(userId);
    calculations.value = response.documents;
  } catch (error) {
    console.error('Error fetching calculations:', error);
  }
};

onMounted(fetchCalculations);
</script>

<template>
  <div class="calculation-history">
    <h2>Calculation History</h2>
    <ul v-if="calculations.length">
      <li v-for="calc in calculations" :key="calc.$id">
        <strong>{{ calc.type }}:</strong> {{ calc.input }} = {{ calc.result }}
        <small>({{ new Date(calc.timestamp).toLocaleString() }})</small>
      </li>
    </ul>
    <p v-else>No calculations found.</p>
  </div>
</template>

<style scoped>
.calculation-history {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}
small {
  color: gray;
}
</style>


<style>
/* Custom font for the "Press Start 2P" font */
.font-press-start {
  font-family: 'Press Start 2P', cursive;
}
</style>