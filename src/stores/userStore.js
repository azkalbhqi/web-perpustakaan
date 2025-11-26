import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import { UserService } from "@/services/users";
import router from "@/router";

export const useUserStore = defineStore("user", () => {
  const auth = useAuthStore();
  const profile = ref(null);

  const loadProfile = async () => {
    try {
      const res = await UserService.getProfile(auth.token);
      profile.value = res.data.data;
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await UserService.updateProfile(auth.token, data);
      profile.value = res.data.data;
      return true;
    } catch (err) {
      console.error("Failed to update profile:", err);
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      await UserService.deleteAccount(auth.token);
      profile.value = null;
      return true;
    } catch (err) {
      console.error("Failed to delete account:", err);
      return false;
    }
  };

  return {
    profile,
    loadProfile,
    updateProfile,
    deleteAccount,
  };
});
