import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const UserBookService = {
 
  async borrowBook(token, data) {
    return axios.post(`${API_URL}/borrow`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },  

  async myBorrowed(token) {
    return axios.get(`${API_URL}/borrow/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async returnBook(token, data) {
    return axios.post(`${API_URL}/return`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async myHistory(token) {
    return axios.get(`${API_URL}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async myOverdue(token) {
    return axios.get(`${API_URL}/overdue/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },


};