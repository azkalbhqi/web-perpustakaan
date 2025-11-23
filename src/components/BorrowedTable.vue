<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useUserBookStore } from "@/stores/userBookStore";

const auth = useAuthStore();
const userBookStore = useUserBookStore();

const borrowed = ref([]);

// LOAD DATA
onMounted(async () => {
  await userBookStore.fetchMyBorrowed();
  borrowed.value = userBookStore.history || [];
});
</script>

<template>
  <div class="mt-12">
    <h2 class="text-2xl font-bold text-white mb-4">
      Riwayat Peminjaman
    </h2>

    <div class="bg-white shadow border border-gray-200 rounded-xl p-4">

      <p 
        v-if="borrowed.length === 0"
        class="text-center text-gray-500 py-6"
      >
        Belum ada riwayat peminjaman.
      </p>

      <table 
        v-else 
        class="w-full text-left"
      >
        <thead>
          <tr class="text-gray-600 border-b">
            <th class="py-2">Judul</th>
            <th class="py-2">Tanggal Pinjam</th>
            <th class="py-2">Tanggal Kembali</th>
            <th class="py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr 
            v-for="item in borrowed" 
            :key="item.id" 
            class="border-b last:border-0"
          >
            <td class="py-3">{{ item.book.title }}</td>
            <td class="py-3">{{ item.borrow_date }}</td>
            <td class="py-3">
              {{ item.return_date ?? "Belum dikembalikan" }}
            </td>
            <td class="py-3">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
