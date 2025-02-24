// src/store/index.js
import { createStore } from 'vuex';
import { account } from '@/config/appwrite';

export default createStore({
  state: {
    currentUser: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
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
        return null;
      }
    },
    async updateUserState({ commit }, user) {
      commit('setCurrentUser', user);
    },
    async clearUserState({ commit }) {
      commit('setCurrentUser', null);
    }
  },
  getters: {
    currentUser: state => state.currentUser,
    isLoggedIn: state => !!state.currentUser,
    userId: state => {
      if (!state.currentUser) return null;
      return state.currentUser.user_id || state.currentUser.$id || 
        (state.currentUser.userData && state.currentUser.userData.user_id);
    }
  },
});