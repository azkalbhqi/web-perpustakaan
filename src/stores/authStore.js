import { defineStore } from "pinia";
import { loginRequest, registerRequest } from "@/services/auth";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await loginRequest(email, password);

        this.token = res.data.token;
        this.user = res.data.user;

        // simpan ke localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        return res.data;
      } catch (error) {
        throw error.response?.data || { message: "Login failed" };
      }
    },

    async register(name, email, password, password_confirmation) {
      try {
        const res = await registerRequest(
          name,
          email,
          password,
          password_confirmation
        );

        return res.data;
      } catch (error) {
        throw error.response?.data || { message: "Register failed" };
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
