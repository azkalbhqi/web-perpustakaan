<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';


const router = useRouter();
const auth = useAuthStore();

// form state
const email = ref("");
const password = ref("");

if (auth.isLoggedIn) {
  router.push("/profile");
}
// submit login
const submitLogin = async () => {
  try {
    await auth.login(email.value, password.value);
    alert("Login berhasil!");

    router.push("/dashboard"); // redirect
  } catch (err) {
    alert(err.message || "Login gagal");
    console.error(err);
  }
};
</script>

<template>
  <main class="min-h-screen flex items-center justify-center px-4">
    <div
      class="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-[1.02]"
    >
      <h1 class="text-3xl font-bold text-white text-center tracking-wide drop-shadow-md">
        Perpustakaan Digital
      </h1>
      <p class="text-gray-200 text-center mt-2 text-sm">
        Login untuk melanjutkan
      </p>

      <form @submit.prevent="submitLogin" class="flex flex-col gap-4 mt-8">

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200"
        />

        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg shadow-lg"
        >
          Login
        </button>

        <p class="text-center text-gray-200 text-sm mt-2">
          Belum punya akun?
          <RouterLink to="/register" class="text-blue-300 hover:underline">
            Daftar sekarang
          </RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>
