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
      console.log('setCurrentUser mutation called with:', user);
      state.currentUser = user;
    },
    setUserId(state, id) {
      console.log('setUserId mutation called with:', id, typeof id);
      
      // Ensure userId is stored as an integer
      if (id !== null && id !== undefined) {
        // If id is a string, convert to integer
        if (typeof id === 'string') {
          const idInt = parseInt(id, 10);
          if (!isNaN(idInt)) {
            console.log('Converting string id to integer:', idInt);
            state.userId = idInt;
            return;
          }
        }
        // If id is already a number or couldn't be parsed, store as is
        console.log('Setting userId directly:', id, typeof id);
        state.userId = id;
      } else {
        console.log('Setting userId to null');
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
        // Ensure user_id is stored as an integer
        commit('setUserId', userData.user_id);
      } else {
        console.warn('userData does not contain user_id:', userData);
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