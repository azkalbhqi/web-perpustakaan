import { defineStore } from "pinia";
import {
  getBooksRequest,
  getBookDetailRequest,
  createBookRequest,
  updateBookRequest,
  deleteBookRequest,
} from "@/services/books";
import { useAuthStore } from "./authStore";

export const useBooksStore = defineStore("booksStore", {
  state: () => ({
    books: [],
    allBooks: [], 
    currentBook: null,
    count: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBooks(searchParams = {}) {
      this.loading = true;
      this.error = null;

      try {
        const res = await getBooksRequest(searchParams);
        this.allBooks = res.data.data; // Simpan semua
        this.books = res.data.data;
        this.count = res.data.count;
      } catch (err) {
        this.error = err.response?.data || "Failed to fetch books";
      } finally {
        this.loading = false;
      }
    },

    async fetchBookById(id) {
      this.loading = true;
      this.error = null;

      try {
        const res = await getBookDetailRequest(id);
        this.currentBook = res.data;
        return res.data;
      } catch (err) {
        this.error = "Failed to fetch book detail";
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async searchBooks(params) {
      this.loading = true;
      this.error = null;

      try {
        if (params.title && params.author && params.category) {
          const query = params.title.toLowerCase();
          this.books = this.allBooks.filter(
            (book) =>
              book.title.toLowerCase().includes(query) ||
              book.author.toLowerCase().includes(query) ||
              book.category.toLowerCase().includes(query)
          );
          this.count = this.books.length;

          if (this.books.length === 0) {
            throw new Error("No books found");
          }
        } else {
          // Search spesifik (title/author/category)
          const res = await getBooksRequest(params);
          this.books = res.data.data;
          this.count = res.data.count;
        }

        return { data: this.books, count: this.count };
      } catch (err) {
        this.error = err.response?.data?.message || "No books found";
        this.books = [];
        this.count = 0;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createBook(bookData) {
      const auth = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const res = await createBookRequest(auth.token, bookData);
        await this.fetchBooks();
        return { success: true, data: res.data };
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to create book";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateBook(id, bookData) {
      const auth = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const res = await updateBookRequest(auth.token, id, bookData);
        await this.fetchBooks();
        return { success: true, data: res.data };
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to update book";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteBook(id) {
      const auth = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        await deleteBookRequest(auth.token, id);
        await this.fetchBooks();
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to delete book";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
