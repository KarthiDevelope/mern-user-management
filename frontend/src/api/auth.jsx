import api from './axios';

export const authAPI = {
  signup: (data) => {
    return api.post('/auth/signup', data);
  },

  login: (data) => {
    return api.post('/auth/login', data);
  },

  getMe: () => {
    return api.get('/auth/me');
  },
};
