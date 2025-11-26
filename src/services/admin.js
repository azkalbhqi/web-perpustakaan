import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const AdminService = {
  async getAllUsers(token) {
    return axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getUserById(token, id) {
    return axios.get(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createUser(token, data) {
    return axios.post(`${API_URL}/users`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateUser(token, id, data) {
    return axios.put(`${API_URL}/users/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async deleteUser(token, id) {
    return axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getUserBorrowings(token, userId) {
    return axios.get(`${API_URL}/users/${userId}/borrowings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAllBorrowings(token) {
    return axios.get(`${API_URL}/borrow`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAllOverdue(token) {
    return axios.get(`${API_URL}/overdue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
