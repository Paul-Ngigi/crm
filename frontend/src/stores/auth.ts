/* eslint-disable @typescript-eslint/no-explicit-any */
import { Module } from 'vuex';
import { loginUser, registerUser } from '../api/auth';

interface AuthState {
  token: string;
  isAuthenticated: boolean;
}

const auth: Module<AuthState, any> = {
  namespaced: true,
  state: {
    token: sessionStorage.getItem('token') || '',
    isAuthenticated: !!sessionStorage.getItem('token'),
  },
  mutations: {
    SET_TOKEN(state: AuthState, token: string) {
      state.token = token;
      state.isAuthenticated = true;
      sessionStorage.setItem('token', token);
    },
    LOGOUT(state: AuthState) {
      state.token = '';
      state.isAuthenticated = false;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
  },
  actions: {
    async login({ commit }, credentials: { email: string; authToken: string }) {
      const response = await loginUser(credentials);
      commit('SET_TOKEN', response.data.token);
    },
    async register(_, data: { email: string; authToken: string }) {
      await registerUser(data);
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
  },
};

export default auth;
