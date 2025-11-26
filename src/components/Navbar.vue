<template>
  <nav
    class="text-xl flex justify-between items-center py-6 px-6 md:px-10 text-white bg-gray-900/90"
  >
    <h1 class="text-2xl font-bold">Perpustakaan</h1>

    <!-- Hamburger Button (Mobile) -->
    <button @click="isOpen = !isOpen" class="md:hidden focus:outline-none">
      <span v-if="!isOpen" class="text-3xl">&#9776;</span>
      <span v-else class="text-3xl">&times;</span>
    </button>

    <!-- Desktop Menu -->
    <div class="hidden md:flex gap-10">
      <RouterLink
        v-for="link in currentNavLinks"
        :key="link.path"
        :to="link.path"
        class="font-semibold hover:font-bold transition-all duration-300"
      >
        {{ link.name }}
      </RouterLink>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isOpen"
      class="absolute top-20 left-0 w-full bg-gray-800/70 md:hidden py-5 flex flex-col gap-5 text-center z-50"
    >
      <RouterLink
        v-for="link in currentNavLinks"
        :key="link.path"
        :to="link.path"
        class="font-semibold hover:font-bold transition-all duration-300 py-2"
        @click="isOpen = false"
      >
        {{ link.name }}
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();
const isOpen = ref(false);

const userNavLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Books", path: "/books" },
  { name: "History", path: "/history" },
  { name: "Profile", path: "/profile" },
  { name: "Login", path: "/login" },
];

const adminNavLinks = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Users", path: "/admin/users" },
  { name: "Profile", path: "/profile" },
];

const currentNavLinks = computed(() => {
  if (auth.isAdmin) {
    return adminNavLinks;
  }
  return userNavLinks;
});
</script>
