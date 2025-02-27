// src/store/index.js
import { createStore } from 'vuex';
import { account } from '@/config/appwrite';

export default createStore({
  state: {
    currentUser: null,
    userId: null, // Will store the integer user_id
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setUserId(state, id) {
      // Ensure userId is stored as an integer
      if (id !== null && id !== undefined) {
        // If id is a string, convert to integer
        if (typeof id === 'string') {
          const idInt = parseInt(id, 10);
          if (!isNaN(idInt)) {
            state.userId = idInt;
            return;
          }
        }
        // If id is already a number or couldn't be parsed, store as is
        state.userId = id;
      } else {
        state.userId = null;
      }
    },
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const user = await account.get();
        commit('setCurrentUser', user);
        return user;
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        commit('setCurrentUser', null);
        commit('setUserId', null);
        return null;
      }
    },
    async updateUserState({ commit }, userData) {
      commit('setCurrentUser', userData);
      
      // Also set the user_id from your custom users collection
      if (userData && userData.user_id) {
        // Ensure user_id is stored as an integer
        commit('setUserId', userData.user_id);
      }
    },
    async clearUserState({ commit }) {
      commit('setCurrentUser', null);
      commit('setUserId', null);
    }
  },
  getters: {
    currentUser: state => state.currentUser,
    isLoggedIn: state => !!state.currentUser,
    userId: state => state.userId,
  },
});