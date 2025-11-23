import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const UserService = {
  async getProfile(token) {
    return axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateProfile(token, data) {
    return axios.put(`${API_URL}/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async deleteAccount(token) {
    return axios.delete(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async logout(token) {
    return axios.post(
      `${API_URL}/logout`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
};


