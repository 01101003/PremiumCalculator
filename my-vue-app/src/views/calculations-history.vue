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
  
  <script>
  import { databases } from '@/config/appwrite';
  
  export default {
    name: 'CalculationsHistory',
    data() {
      return {
        calculations: [],
        isLoading: true,
      };
    },
    computed: {
      userId() {
        return this.$store.state.currentUser?.$id;
      },
    },
    async mounted() {
      if (this.userId) {
        await this.fetchCalculations();
      }
      this.isLoading = false;
    },
    methods: {
      async fetchCalculations() {
        try {
          const response = await databases.listDocuments(
            process.env.VITE_APPWRITE_DATABASE,
            process.env.VITE_APPWRITE_CALCULATIONS_COLLECTION,
            [
              databases.Query.equal('user_id', this.userId),
              databases.Query.orderDesc('timestamp'),
            ]
          );
  
          this.calculations = response.documents;
        } catch (error) {
          console.error('Failed to fetch calculations:', error);
          alert('Failed to fetch calculations. Please try again later.');
        }
      },
      formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
      },
    },
  };
  </script>
  
  <style>
  /* Custom font for the "Press Start 2P" font */
  .font-press-start {
    font-family: 'Press Start 2P', cursive;
  }
  </style>