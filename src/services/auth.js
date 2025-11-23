import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginRequest = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const registerRequest = (name, email, password, password_confirmation) => {
  return axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    password_confirmation,
  });
};