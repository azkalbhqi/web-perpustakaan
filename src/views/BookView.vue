<script setup>
import { onMounted, ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useBooksStore } from "@/stores/booksStore";
import { useUserBookStore } from "@/stores/userBookStore";
import { useRoute } from "vue-router";

const auth = useAuthStore();
const booksStore = useBooksStore();
const userBookStore = useUserBookStore();
const route = useRoute();

// STATE
const currentBook = ref(null);
const loading = ref(true); // <-- Tambahan

// COMPUTED
const isLoggedIn = computed(() => auth.isLoggedIn);

console.log(userBookStore.borrowed);

// FIX: pengecekan pakai some()
const isBorrowed = (bookId) => {
  return userBookStore.borrowed.some((item) => item.book_id == bookId);
};

// LOAD BOOK + USER BORROW
onMounted(async () => {
  loading.value = true;

  const id = Number(route.params.id);

  await Promise.all([booksStore.fetchBooks(), userBookStore.fetchMyBorrowed()]);

  currentBook.value = booksStore.books.find((b) => b.id === id);

  loading.value = false;
});

// BORROW ACTION
const borrowBook = async (id) => {
  try {
    loading.value = true;

    await userBookStore.borrowBook(id);
    await booksStore.fetchBooks();
    await userBookStore.fetchMyBorrowed();

    loading.value = false;
    alert("Borrow Success!");
  } catch (err) {
    loading.value = false;
    console.error(err);
    alert("Failed to borrow");
  }
};
</script>

<template>
  <div class="min-h-screen px-10 py-20 w-full">
    <!-- LOADING SCREEN -->
    <div v-if="loading" class="flex justify-center items-center h-[60vh]">
      <div
        class="animate-spin rounded-full h-14 w-14 border-4 border-white border-t-transparent"
      ></div>
    </div>

    <!-- CONTENT -->
    <div v-else-if="currentBook">
      <div class="flex justify-between">
        <h1 class="text-3xl text-white font-bold mb-4">
          {{ currentBook.title }}
        </h1>

        <div class="flex flex-col">
          <div class="mb-3">
            <p class="text-white">Author by</p>
            <p class="text-white font-semibold text-xl">
              {{ currentBook.author }}
            </p>
          </div>
          <p class="text-white mb-4">Stock: {{ currentBook.stock }}</p>
        </div>
      </div>

      <div class="mt-6">
        <!-- 1. Belum login -->
        <button
          v-if="!isLoggedIn"
          disabled
          class="bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow-md cursor-not-allowed w-full"
        >
          Please Login to Borrow
        </button>

        <!-- 2. Sudah dipinjam -->
        <button
          v-else-if="isBorrowed(currentBook.id)"
          disabled
          class="bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow-md cursor-not-allowed w-full"
        >
          Borrowed
        </button>

        <!-- 3. Stok habis -->
        <button
          v-else-if="currentBook.stock < 1"
          disabled
          class="bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md cursor-not-allowed w-full"
        >
          Out of Stock
        </button>

        <!-- 4. Bisa pinjam -->
        <button
          v-else
          @click="borrowBook(currentBook.id)"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all w-full"
        >
          Borrow
        </button>
      </div>
    </div>

    <!-- NOT FOUND -->
    <div v-else class="text-white text-center text-xl mt-20">
      Book not found.
    </div>
  </div>
</template>
