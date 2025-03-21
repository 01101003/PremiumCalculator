// src/store/index.js
import { createStore } from 'vuex';
import { account, appwriteService } from '@/config/appwrite';

export default createStore({
  state: {
    currentUser: null,
    userId: null, // Will store the integer user_id
  },
  mutations: {
    setCurrentUser(state, user) {
      console.log('setCurrentUser mutation called with:', user);
      state.currentUser = user;
    },
    setUserId(state, id) {
      console.log('setUserId mutation called with:', id, typeof id);
      
      try {
        // Use appwriteService to ensure consistent userId handling
        if (id !== null && id !== undefined) {
          state.userId = appwriteService.ensureIntegerId(id);
          console.log('userId set in store:', state.userId, typeof state.userId);
        } else {
          state.userId = null;
        }
      } catch (error) {
        console.error('Error setting userId in store:', error);
        state.userId = null;
      }
    },
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        console.log('Fetching current user from Appwrite');
        const user = await account.get();
        console.log('Current user from Appwrite:', user);
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
      console.log('updateUserState action called with:', userData);
      commit('setCurrentUser', userData);
      
      // Also set the user_id from your custom users collection
      if (userData && userData.user_id !== undefined && userData.user_id !== null) {
        console.log('Setting userId to:', userData.user_id, typeof userData.user_id);
        commit('setUserId', userData.user_id);
      } else {
        console.warn('userData does not contain user_id:', userData);
        commit('setUserId', null);
      }
    },
    async clearUserState({ commit }) {
      console.log('Clearing user state in store');
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