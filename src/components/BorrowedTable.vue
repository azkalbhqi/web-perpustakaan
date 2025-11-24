<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserBookStore } from "@/stores/userBookStore";

const router = useRouter();
const userBookStore = useUserBookStore();

const borrowed = ref([]);

// LOAD DATA
onMounted(async () => {
  await userBookStore.fetchMyBorrowed();
  borrowed.value = userBookStore.borrowed || [];
});

// GO TO DETAIL PAGE
const openDetail = (id) => {
  router.push(`/borrowed/${id}`);
};
</script>

<template>
  <div class="mt-12">
    <h2 class="text-2xl font-bold text-white mb-4">Riwayat Peminjaman</h2>

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

            <th class="py-2">Tanggal Akhir Kembali</th>
            <th class="py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in borrowed"
            :key="item.id"
            class="border-b last:border-0 cursor-pointer hover:bg-gray-100 transition"
            @click="openDetail(item.id)"
          >
            <td class="py-3 font-medium text-blue-700">
              {{ item.book.title }}
            </td>

            <td class="py-3">{{ item.borrow_date }}</td>

            <td class="py-3">
              {{ item.due_date ?? "Belum dikembalikan" }}
            </td>

            <td class="py-3 capitalize">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
