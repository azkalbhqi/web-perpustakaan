import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import { AdminService } from "@/services/admin";
import { getBooksRequest } from "@/services/books";

export const useAdminStore = defineStore("adminStore", () => {
  const auth = useAuthStore();

  const users = ref([]);
  const count = ref(0);
  const totalBooks = ref(0);
  const totalBorrowed = ref(0);
  const totalOverdue = ref(0);
  const selectedUser = ref(null);
  const userBorrowings = ref([]);

  const loading = ref(false);
  const error = ref(null);

  // Fetch All Users
  const fetchAllUsers = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await AdminService.getAllUsers(auth.token);
      users.value = res.data.user;
      count.value = res.data.count;
    } catch (err) {
      error.value = "Failed to load users";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Get User by ID
  const getUserById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await AdminService.getUserById(auth.token, id);
      selectedUser.value = res.data;
      return res.data;
    } catch (err) {
      error.value = "Failed to load user";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create User
  const createUser = async (userData) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await AdminService.createUser(auth.token, userData);
      await fetchAllUsers(); // Refresh list
      return { success: true, data: res.data };
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to create user";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update User
  const updateUser = async (id, userData) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await AdminService.updateUser(auth.token, id, userData);
      await fetchAllUsers(); // Refresh list
      return { success: true, data: res.data };
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to update user";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      await AdminService.deleteUser(auth.token, id);
      await fetchAllUsers(); // Refresh list
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to delete user";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Get User Borrowings
  const fetchUserBorrowings = async (userId) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await AdminService.getUserBorrowings(auth.token, userId);
      userBorrowings.value = res.data.data; // Ambil array data
      return res.data;
    } catch (err) {
      error.value = "Failed to load user borrowings";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch All Borrowings
  const fetchAllBorrowings = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await AdminService.getAllBorrowings(auth.token);
      totalBorrowed.value = res.data.count;
    } catch (err) {
      error.value = "Failed to load borrowings";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchTotalBooks = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await getBooksRequest();
      totalBooks.value = res.data.count;
    } catch (err) {
      error.value = err.response?.data || "Failed to fetch books";
    } finally {
      loading.value = false;
    }
  };

  // Fetch All Overdue
  const fetchAllOverdue = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await AdminService.getAllOverdue(auth.token);
      totalOverdue.value = res.data.count;
    } catch (err) {
      error.value = "Failed to load overdue books";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    // HAPUS 'stats' karena tidak didefinisikan
    users,
    count,
    totalBooks, // <-- Ini yang dipakai
    totalBorrowed, // <-- Ini yang dipakai
    totalOverdue, // <-- Ini yang dipakai
    selectedUser,
    userBorrowings,
    loading,
    error,
    fetchAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    fetchUserBorrowings,
    fetchTotalBooks,
    fetchAllBorrowings,
    fetchAllOverdue,
  };
});
