// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    currentUser: null, // Stores the logged-in user's data
  },
  mutations: {
    // Updates the current user in the state
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
  },
  actions: {
    // Fetches the current user from Appwrite and updates the state
    async fetchCurrentUser({ commit }) {
      try {
        const user = await account.get(); // Fetch user from Appwrite
        commit('setCurrentUser', user); // Update the state
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    },
  },
  getters: {
    // Optional: A getter to easily access the current user
    currentUser(state) {
      return state.currentUser;
    },
  },
});