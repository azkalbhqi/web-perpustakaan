<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useBooksStore } from "@/stores/booksStore";
import { useUserBookStore } from "@/stores/userBookStore";
import BorrowedTable from "@/components/BorrowedTable.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const auth = useAuthStore();
const booksStore = useBooksStore();
const userBookStore = useUserBookStore();

// STATE
const totalBooks = ref(0);
const history = ref([]);
const overdue = ref([]);
const borrowed = ref([]);

//checker
if (!auth.isLoggedIn) {
  router.push("/login");
}

// LOAD DATA
onMounted(async () => {
  const token = auth.token;

  // Load total buku
  await booksStore.fetchBooks();
  totalBooks.value = booksStore.count;

  // Load borrowed books
  await userBookStore.fetchMyBorrowed(token);
  borrowed.value = userBookStore.borrowed;

  // Hitung overdue
  await userBookStore.fetchOverdue(token);
  overdue.value = userBookStore.overdue;
});
</script>

<template>
  <div class="min-h-screen w-full py-24 px-8 items-center">

    <!-- Greeting -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white">
        Halo, {{ auth.user?.name }} 👋
      </h1>
      <p class="text-white">Selamat datang di Dashboard Perpustakaan</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">

      <!-- History Count -->
      <div class="p-6 bg-white shadow rounded-xl border border-gray-200">
        <p class="text-gray-500">Total Riwayat Peminjaman</p>
        <h2 class="text-4xl font-bold text-blue-600">{{ borrowed?.length || 0 }}</h2>
      </div>

      <!-- Overdue Count -->
      <div class="p-6 bg-white shadow rounded-xl border border-gray-200">
        <p class="text-gray-500">Buku Terlambat Dikembalikan</p>
        <h2 class="text-4xl font-bold text-red-600">{{ overdue?.length }}</h2>
      </div>

    </div>

    <!-- History Section -->
    <BorrowedTable />

    <!-- Overdue Alert -->
    <div v-if="overdue.length > 0" class="mt-8">
      <div class="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <h3 class="text-red-700 font-bold">⚠️ Perhatian!</h3>
        <p class="text-red-700">
          Kamu memiliki <span class="font-bold">{{ overdue?.length }}</span> buku yang terlambat dikembalikan.
        </p>
      </div>
    </div>

  </div>
</template>
