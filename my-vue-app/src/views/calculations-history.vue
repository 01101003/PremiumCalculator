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
  
  // In calculations-history.vue - update the component
<script>
import { appwriteService } from '@/config/appwrite';

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
      // More robust way to get user ID that works with both auth models
      const user = this.$store.state.currentUser;
      if (!user) return null;
      
      // Try different properties since the user object structure might vary
      return user.user_id || user.$id || (user.userData && user.userData.user_id);
    },
    isLoggedIn() {
      return !!this.userId;
    }
  },
  watch: {
    // Add watcher to detect when user state changes
    userId(newVal) {
      if (newVal) {
        this.fetchCalculations();
      } else {
        // Clear calculations if user logs out
        this.calculations = [];
      }
    }
  },
  async mounted() {
    if (this.userId) {
      await this.fetchCalculations();
    }
    this.isLoading = false;
  },
  methods: {
    async fetchCalculations() {
      if (!this.userId) {
        this.calculations = [];
        return;
      }
      
      try {
        this.isLoading = true;
        const response = await appwriteService.getUserCalculations(this.userId);
        this.calculations = response.documents || [];
      } catch (error) {
        console.error('Failed to fetch calculations:', error);
        // More user-friendly error handling
        this.calculations = [];
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
  <style>
  /* Custom font for the "Press Start 2P" font */
  .font-press-start {
    font-family: 'Press Start 2P', cursive;
  }
  </style>