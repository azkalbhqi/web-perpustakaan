import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getBooksRequest = (params = {}) => {
  return axios.get(`${API_URL}/books`, { params });
};

export const getBookDetailRequest = (id) => {
  return axios.get(`${API_URL}/books/${id}`);
};

export const createBookRequest = (token, data) => {
  return axios.post(`${API_URL}/books`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateBookRequest = (token, id, data) => {
  return axios.put(`${API_URL}/books/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteBookRequest = (token, id) => {
  return axios.delete(`${API_URL}/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const searchBooksRequest = (params) => {
  return axios.get(`${API_URL}/books`, { params });
};
