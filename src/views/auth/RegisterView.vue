<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const auth = useAuthStore();

// form state
const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const errorMessage = ref(null);

// submit register
const submitRegister = async (e) => {
  e.preventDefault(); // cegah reload
  errorMessage.value = null;

  try {
    await auth.register(
      name.value,
      email.value,
      password.value,
      password_confirmation.value
    );

    alert("Register berhasil!");

    router.push("/login"); // redirect ke login
  } catch (err) {
  // Jika API mengembalikan { error: "..."}
  if (err.error) {
    errorMessage.value = err.error;
    alert(err.error);
    return;
  }

  // fallback
  alert(err.message || "Register gagal");
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
        Silakan isi data di bawah untuk mendaftar akun
      </p>

      <form @submit="submitRegister" class="flex flex-col gap-4 mt-8">
        <!-- Nama Lengkap -->
        <div>
          <input
            v-model="name"
            type="text"
            placeholder="Nama Lengkap"
            class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            required
          />
        </div>

        <!-- Konfirmasi Password -->
        <div>
          <input
            v-model="password_confirmation"
            type="password"
            placeholder="Konfirmasi Password"
            class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            required
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
          <RouterLink to="/login" class="text-blue-300 hover:underline">
            Login sekarang
          </RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>
