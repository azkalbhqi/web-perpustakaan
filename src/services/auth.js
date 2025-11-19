// src/services/auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginRequest = (email, password) =>
  axios.post(`${API_URL}/login`, { email, password });

export const registerRequest = (name, email, password, password_confirmation) =>
  axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    password_confirmation,
  });
