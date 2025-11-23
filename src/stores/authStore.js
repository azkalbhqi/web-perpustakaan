import { defineStore } from "pinia";
import { loginRequest, registerRequest } from "@/services/auth";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: localStorage.getItem("access_token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      try {
        const res = await loginRequest(email, password);

        this.token = res.data.access_token;
        this.user = res.data.user;

        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        return { success: true };
      } catch (error) {
        const err = error.response?.data;
        throw {
          success: false,
          message: err?.message || "Login gagal",
        };
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

        return {
          success: true,
          data: res.data,
        };
      } catch (error) {
        const err = error.response?.data;

        throw {
          success: false,
          message: err?.message || err?.error || "Register gagal",
          errors: err?.errors || null,
        };
      }
    },

    logout() {
      this.token = null;
      this.user = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },
});
