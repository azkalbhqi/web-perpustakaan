
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getBooksRequest = () => {
  return axios.get(`${API_URL}/books`);
};
export const getBookDetailRequest = (id) => {
  return axios.get(`${API_URL}/books/${id} `);
};


