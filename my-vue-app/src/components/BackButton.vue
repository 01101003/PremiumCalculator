<template>
  <button class="nav-button" @click="goBack">{{ buttonText }}</button>
</template>

<script>
export default {
  name: 'BackButton',
  props: {
    buttonText: {
      type: String,
      default: 'Back to Main'
    },
    destination: {
      type: String,
      default: '/'
    }
  },
  mounted() {
    // Emit an event to tell the parent component (App.vue) that the BackButton is active
    this.$root.$emit('back-button-mounted', this.buttonText);
  },
  beforeDestroy() {
    // Emit an event when the component is about to be destroyed
    this.$root.$emit('back-button-destroyed');
  },
  methods: {
    goBack() {
      this.$router.push(this.destination);
    }
  }
}
</script>

<style scoped>
.nav-button {
  padding: 15px 30px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.nav-button:hover {
  background-color: #ff5252;
  transform: scale(1.05);
}
</style>