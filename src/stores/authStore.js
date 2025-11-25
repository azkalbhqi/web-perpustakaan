import { defineStore } from "pinia";
import { loginRequest, registerRequest } from "@/services/auth";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null,
    user: null,
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

    async logout() {
      try {
        await UserService.logout(auth.token);
    
        auth.logout();
    
        router.push({ name: "Login" }).then(() => {
          window.location.reload(); // refresh halaman
        });
    
        return true;
      } catch (err) {
        console.error("Failed to logout:", err);
        return false;
      }
    }
  },
});
