<script setup>
import { onMounted, ref } from "vue";
import { useUserBookStore } from "@/stores/userBookStore";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const userBookStore = useUserBookStore();
const auth = useAuthStore();
const router = useRouter();

const history = ref([]);
const overdue = ref([]);

const loading = ref(true);

//checker
if (!auth.isLoggedIn) {
  router.push("/login");
}

console.log(history);

onMounted(async () => {
  loading.value = true;
  await userBookStore.fetchBorrowHistory();
  await userBookStore.fetchOverdue();

  history.value = userBookStore.history; // pastikan di store ada state history
  overdue.value = userBookStore.overdue; // pastikan di store ada state overdue
  loading.value = false;

  console.log(history);
  console.log(overdue);
});
</script>

<template>
  <div>
    <div class="p-10">
      <h1 class="text-3xl text-white font-bold mb-6">📚 Overdue Books</h1>

      <!-- Jika tidak ada overdue -->
      <div
        v-if="!overdue || overdue?.length === 0"
        class="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6 rounded-xl shadow-lg border border-gray-600"
      >
        <p class="text-center text-lg">Tidak ada buku yang overdue 🎉</p>
      </div>

      <!-- List Overdue -->
      <div v-else class="space-y-5">
        <div
          v-for="item in overdue"
          :key="item.id"
          class="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition duration-200"
        >
          <div class="flex items-start justify-between">
            <h2 class="text-xl font-bold text-gray-800">
              {{ item.book.title }}
            </h2>

            <span
              class="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700"
            >
              {{ item.status }}
            </span>
          </div>

          <div>
            <p class="mt-1 text-gray-600">Pengarang: {{ item.book.author }}</p>
            <p class="text-gray-600">Kategori: {{ item.book.category }}</p>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-3 rounded-lg border text-sm">
              <p class="text-gray-500">Tanggal Pinjam</p>
              <p class="font-semibold text-gray-800">{{ item.borrow_date }}</p>
            </div>

            <div class="bg-red-50 p-3 rounded-lg border text-sm">
              <p class="text-red-500 font-medium">Due Date</p>
              <p class="text-red-700 font-semibold">{{ item.due_date }}</p>
            </div>
          </div>

          <div class="mt-4">
            <span class="text-sm text-red-600 font-medium">
              Buku sudah melewati batas waktu pengembalian.
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-14 px-8">
      <h2 class="text-3xl font-bold text-white mb-6">
        Riwayat Aktivitas Peminjaman
      </h2>

      <!-- LOADING -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"
        ></div>
      </div>

      <!-- EMPTY -->
      <p v-else-if="!history" class="text-center text-gray-300 py-10">
        Belum ada riwayat aktivitas peminjaman.
      </p>

      <!-- TABLE -->
      <div v-else class="bg-white shadow border border-gray-200 rounded-xl p-4">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-600 border-b">
              <th class="py-2">Judul</th>
              <th class="py-2">Aksi</th>
              <th class="py-2">Tanggal</th>
              <th class="py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in history"
              :key="item.id"
              class="border-b last:border-0 hover:bg-gray-100 transition"
            >
              <td class="py-3 font-medium">
                {{ item.borrowing.book.title }}
              </td>

              <td class="py-3 capitalize">
                {{ item.action }}
              </td>

              <td class="py-3">
                {{ item.action_date }}
              </td>

              <td class="py-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm',
                    item.borrowing.status === 'dikembalikan'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700',
                  ]"
                >
                  {{ item.borrowing.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
table th {
  font-weight: 600;
}
</style>
