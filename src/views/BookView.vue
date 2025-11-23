<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useBooksStore } from "@/stores/booksStore";
import { storeToRefs } from "pinia";
import { useUserBookStore } from "@/stores/userBookStore";
import { useAuthStore } from "@/stores/authStore";  

const route = useRoute();
const auth = useAuthStore();
const booksStore = useBooksStore();
const userBookStore = useUserBookStore();

const { currentBook, loading } = storeToRefs(booksStore);

const borrowedList = ref([]);

// FIX: pengecekan pakai some()
const isBorrowed = (bookId) => {
  return borrowedList.value.some(item => item.book_id == bookId);
};

// FIX: real borrow
const borrowBook = async (bookId) => {
  await userBookStore.borrowBook(bookId, auth.token);
  await userBookStore.fetchMyBorrowed(auth.token);

  borrowedList.value = userBookStore.borrowed;

  alert("Book borrowed!");
};

onMounted(async () => {
  const id = route.params.id;

  await booksStore.fetchBookById(id);

  const token = auth.token;
  await userBookStore.fetchMyBorrowed(token);

  // FIX: pakai history, bukan borrowed
  borrowedList.value = userBookStore.borrowed;

  console.log("borrowedList:", borrowedList.value);
  console.log("currentBook:", currentBook.value);
  console.log("loading:", loading.value);
});
</script>


<template>
  <div class="px-10 py-10 min-h-screen bg-gray-900">

    <!-- Loading -->
    <div v-if="loading" class="text-white text-center text-xl py-10">
      Loading...
    </div>

    <!-- Buku Ditemukan -->
    <div
      v-else-if="currentBook"
      class="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto transition-all"
    >
      <!-- Title & Author -->
      <h1 class="text-4xl font-bold mb-3">{{ currentBook.title }}</h1>
      <p class="text-gray-600 text-lg mb-4">
        Author: <span class="font-medium">{{ currentBook.author }}</span>
      </p>

      <!-- Stock Badge -->
      <span
        class="inline-block px-4 py-1 rounded-full text-white text-sm mb-5"
        :class="currentBook.stock > 0 ? 'bg-green-600' : 'bg-red-600'"
      >
        Stock: {{ currentBook.stock }}
      </span>

      <!-- Borrow Button (conditional) -->
      <div class="mb-6">
        <button
          v-if="!isBorrowed(currentBook.id)"
          @click="borrowBook(currentBook.id)"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
        >
          Borrow
        </button>

        <button
          v-else
          class="bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow-md cursor-not-allowed"
          disabled
        >
          Borrowed
        </button>
      </div>

      
    </div>

    <!-- Buku Tidak Ditemukan -->
    <div v-else class="text-white text-center text-xl py-10">
      Buku tidak ditemukan.
    </div>

  </div>
</template>
