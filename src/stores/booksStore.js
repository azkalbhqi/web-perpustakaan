import { defineStore } from "pinia";
import { getBooksRequest, getBookDetailRequest } from "@/services/books";

export const useBooksStore = defineStore("booksStore", {
  state: () => ({
    books: [],
    currentBook: null, // <— untuk detail
    count: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBooks() {
      this.loading = true;
      this.error = null;

      try {
        const res = await getBooksRequest();
        this.books = res.data.data;
        this.count = res.data.count;
      } catch (err) {
        this.error = err.response?.data || "Failed to fetch books";
      } finally {
        this.loading = false;
      }
    },

    //  FETCH DETAIL BUKU
    async fetchBookById(id) {
      this.loading = true;
      this.error = null;

      try {
        const res = await getBookDetailRequest(id);
        this.currentBook = res.data;
      } catch (err) {
        this.error = "Failed to fetch book detail";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
