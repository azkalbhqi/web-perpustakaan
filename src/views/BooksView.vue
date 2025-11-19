<script setup>
import { onMounted } from "vue";
import { useBooksStore } from "@/stores/booksStore";
import { storeToRefs } from "pinia";

import BookCard from "@/components/BookCard.vue";

const bookStore = useBooksStore();

// pastikan reactive!
const { books, loading } = storeToRefs(bookStore);

onMounted(async () => {
  await bookStore.fetchBooks(); // tunggu async
});
</script>

<template>
  <div class="px-10 py-8 min-h-screen">
    <h1 class="text-3xl text-white font-bold mb-6">Daftar Buku</h1>

    <div v-if="loading" class="text-center text-lg text-white font-semibold">
      Loading...
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
      />
    </div>
  </div>
</template>
