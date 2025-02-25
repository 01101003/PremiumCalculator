modified:   my-vue-app/src/views/calculations-history.vue

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