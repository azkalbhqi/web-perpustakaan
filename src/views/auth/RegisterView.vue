<script>
import { RouterLink } from 'vue-router';


</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center px-4"
  >
    <div
      class="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-[1.02]"
    >
      <h1
        class="text-3xl font-bold text-white text-center tracking-wide drop-shadow-md"
      >
        Perpustakaan Digital
      </h1>

      <p class="text-gray-200 text-center mt-2 text-sm">
        Silakan isi data di bawah untuk mendaftar akun
      </p>

      <form class="flex flex-col gap-4 mt-8">
        <!-- Nama Lengkap -->
        <div>
          <input
            type="text"
            placeholder="Nama Lengkap"
            class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <!-- Email -->
        <div>
          <input
            type="email"
            placeholder="Email"
            class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <!-- Password -->
        <div>
          <input
            type="password"
            placeholder="Password"
            class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <!-- Konfirmasi Password -->
        <div>
          <input
            type="password"
            placeholder="Konfirmasi Password"
            class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <!-- Tombol Register -->
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg shadow-lg transition-all duration-300"
        >
          Register
        </button>

        <!-- Redirect to login -->
        <p class="text-center text-gray-200 text-sm mt-2">
          Sudah punya akun?
          <RouterLink to="/login" class="text-blue-300 hover:underline">Login sekarang</RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>
