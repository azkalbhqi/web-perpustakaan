// src/stores/userBookStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import { UserBookService } from "@/services/userBooks";

export const useUserBookStore = defineStore("userBookStore", () => {
  const auth = useAuthStore();

  const userBooks = ref([]);
  const history = ref([]);
  const overdue = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const borrowed = ref([]);

  // === BORROW A BOOK ===
  const borrowBook = async (bookId) => {
    try {
      const payload = {
        book_id: bookId,
      };

      const res = await UserBookService.borrowBook(auth.token, payload);

      // Refresh list setelah berhasil
      await fetchMyBorrowed();
      await fetchBorrowHistory();

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      console.error("Borrow failed:", err);

      return {
        success: false,
        message: err.response?.data?.message || "Failed to borrow book",
      };
    }
  };

  // === RETURN BOOK ===
  const returnBook = async (borrow_id) => {
    try {
      const payload = {
        borrowing_id: borrow_id,
      };
      const res = await UserBookService.returnBook(auth.token, payload);
      await fetchUserBooks();
      await fetchBorrowHistory();
      await fetchOverdue();
      return { success: true };
    } catch (err) {
      console.error("Return failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to return book",
      };
    }
  };

  // === BORROW HISTORY ===
  const fetchBorrowHistory = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await UserBookService.myHistory(auth.token);
      history.value = res.data;
      console.log(res.data);
    } catch (err) {
      error.value = "Failed to load borrow history";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchMyBorrowed = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await UserBookService.myBorrowed(auth.token);
      borrowed.value = res.data;
    } catch (err) {
      error.value = "Failed to load my borrowed books";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchOverdue = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await UserBookService.myOverdue(auth.token);
      overdue.value = res.data.data;
    } catch (err) {
      error.value = "Failed to load overdue books";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    userBooks,
    history,
    borrowed,
    overdue,
    loading,
    error,

    fetchBorrowHistory,
    fetchMyBorrowed,
    fetchOverdue,
    borrowBook,
    returnBook,
  };
});
