// src/store/index.js
import { createStore } from 'vuex';
import { account } from '@/config/appwrite';

export default createStore({
  state: {
    currentUser: null,
    userId: null, // Add a dedicated field for the user_id
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setUserId(state, id) {
      state.userId = id;
    },
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const user = await account.get();
        commit('setCurrentUser', user);
        // Don't set userId here since this only has the Appwrite session info
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
    userId: state => state.userId, // Use the dedicated field
  },
});