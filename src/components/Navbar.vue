
<template>
  <nav class="text-xl flex justify-between py-6 px-10 text-white">
    <h1 class="text-2xl font-bold">Perpustakaan</h1>

    <div class="flex gap-10">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="font-semibold hover:font-bold transition-all duration-300"
      >
        {{ link.name }}
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
const navLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Books", path: "/books" },
  { name: "Profile", path: "/profile" },
  { name: "login", path: "/login" },
];
</script>
