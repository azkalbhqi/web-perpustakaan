<script setup>
import { onMounted, computed } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const adminStore = useAdminStore();
const auth = useAuthStore();
const router = useRouter();

// Check if user is admin
if (!auth.isLoggedIn || auth.user?.role !== "admin") {
  router.push("/login");
}

onMounted(async () => {
  await Promise.all([
    adminStore.fetchAllUsers(),
    adminStore.fetchTotalBooks(),
    adminStore.fetchAllBorrowings(),
    adminStore.fetchAllOverdue(),
  ]);
});

const totalUsers = computed(() => adminStore.count);
const totalBooks = computed(() => adminStore.totalBooks);
const totalBorrowed = computed(() => adminStore.totalBorrowed);
const totalOverdue = computed(() => adminStore.totalOverdue);
const stats = computed(() => adminStore.stats);
const loading = computed(() => adminStore.loading);
</script>

<template>
  <div class="min-h-screen w-full py-24 px-8">
    <!-- Greeting -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white">Admin Dashboard 👋</h1>
      <p class="text-white">Selamat datang, {{ auth.user?.name }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-14 w-14 border-4 border-white border-t-transparent"
      ></div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Users -->
      <div
        class="p-6 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg rounded-xl border border-blue-400"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total Users</p>
            <h2 class="text-4xl font-bold text-white mt-2">
              {{ totalUsers || 0 }}
            </h2>
          </div>
          <div class="bg-white/20 p-4 rounded-full">
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Books -->
      <div
        class="p-6 bg-gradient-to-br from-green-500 to-green-600 shadow-lg rounded-xl border border-green-400"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Total Books</p>
            <h2 class="text-4xl font-bold text-white mt-2">
              {{ totalBooks || 0 }}
            </h2>
          </div>
          <div class="bg-white/20 p-4 rounded-full">
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Borrowed -->
      <div
        class="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg rounded-xl border border-yellow-400"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-100 text-sm font-medium">Total Borrowed</p>
            <h2 class="text-4xl font-bold text-white mt-2">
              {{ totalBorrowed || 0 }}
            </h2>
          </div>
          <div class="bg-white/20 p-4 rounded-full">
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Overdue -->
      <div
        class="p-6 bg-gradient-to-br from-red-500 to-red-600 shadow-lg rounded-xl border border-red-400"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-100 text-sm font-medium">Total Overdue</p>
            <h2 class="text-4xl font-bold text-white mt-2">
              {{ totalOverdue || 0 }}
            </h2>
          </div>
          <div class="bg-white/20 p-4 rounded-full">
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
