<script setup>
import { onMounted, ref } from "vue";
import { useUserBookStore } from "@/stores/userBookStore";
import { useRouter } from "vue-router";

const userBookStore = useUserBookStore();
const router = useRouter();

const history = ref([]);
const loading = ref(true);

//checker
if (!auth.isLoggedIn) {
  router.push("/login");
}

console.log(history);

onMounted(async () => {
  loading.value = true;
  await userBookStore.fetchBorrowHistory();
  history.value = userBookStore.history; // pastikan di store ada state history
  loading.value = false;
});

</script>

<template>
    <div>
        <div class="p-10">
    <h1 class="text-3xl text-white font-bold mb-4">Overdue Books</h1>

    <!-- Jika belum ada data -->
    <div v-if="!overdue || overdue.length === 0" class="text-gray-500">
        <div class="p-4 rounded-lg border shadow-sm bg-white">
            <p>Tidak ada buku yang overdue.</p>
        </div>
      
    </div>

    <!-- List Overdue -->
    <div v-else class="space-y-4">
      <div
        v-for="(item, index) in overdue"
        :key="index"
        class="p-4 rounded-lg border shadow-sm bg-white"
      >
        <h2 class="text-lg font-semibold">{{ item.book.title }}</h2>
        <p class="text-sm text-gray-600">Pengarang: {{ item.book.author }}</p>
        <p class="text-sm text-red-600 font-bold">
          Due date: {{ item.dueDate }}
        </p>
      </div>
    </div>
  </div>

    <div class="mt-14 px-8">
        <h2 class="text-3xl font-bold text-white mb-6">
        Riwayat Aktivitas Peminjaman
        </h2>

        <!-- LOADING -->
        <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>

        <!-- EMPTY -->
        <p
        v-else-if="!history"
        class="text-center text-gray-300 py-10"
        >
        Belum ada riwayat aktivitas peminjaman.
        </p>

        <!-- TABLE -->
        <div
        v-else
        class="bg-white shadow border border-gray-200 rounded-xl p-4"
        >
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
                        : 'bg-yellow-100 text-yellow-700'
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
