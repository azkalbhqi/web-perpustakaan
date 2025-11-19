import { defineStore } from "pinia";
import { getBooksRequest } from "@/services/books";

export const useBooksStore = defineStore("booksStore", {
  state: () => ({
    books: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBooks() {
      this.loading = true;
      this.error = null;

      try {
        const res = await getBooksRequest();
        this.books = res.data; // sesuai struktur API kamu
      } catch (err) {
        this.error = err.response?.data || "Failed to fetch books";
      } finally {
        this.loading = false;
      }
    },
  },
});
