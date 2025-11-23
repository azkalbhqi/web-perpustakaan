<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";


const authStore = useAuthStore();

// data yang akan ditampilkan
const localToken = ref(null);
const localUser = ref(null);

onMounted(() => {
  localToken.value = localStorage.getItem("access_token");
  localUser.value = localStorage.getItem("user");
});

// tombol hapus
const clearAll = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");

  authStore.logout(); // reset state pinia

  localToken.value = null;
  localUser.value = null;

  alert("LocalStorage & authStore cleared!");
};
</script>

<template>
  <main class="p-6 text-white">
    <h1 class="text-3xl font-bold mb-4">🔍 Debug View</h1>

    <!-- LOCAL STORAGE -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
      <h2 class="text-xl font-semibold mb-2">LocalStorage</h2>
      <p><strong>access_token:</strong></p>
      <pre class="bg-gray-900 p-3 rounded text-green-400">
{{ localToken }}
      </pre>

      <p><strong>user:</strong></p>
      <pre class="bg-gray-900 p-3 rounded text-blue-400">
{{ localUser }}
      </pre>
    </div>

    <!-- PINIA STORE -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
      <h2 class="text-xl font-semibold mb-2">Pinia Store (authStore)</h2>

      <p><strong>authStore.token:</strong></p>
      <pre class="bg-gray-900 p-3 rounded text-green-300">
{{ authStore.token }}
      </pre>

      <p><strong>authStore.user:</strong></p>
      <pre class="bg-gray-900 p-3 rounded text-blue-300">
{{ authStore.user }}
      </pre>
    </div>

    <!-- BUTTONS -->
    <button
      class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
      @click="clearAll"
    >
      Clear Token & User
    </button>
  </main>
  
</template>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
