<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserBookStore } from "@/stores/userBookStore";

const route = useRoute();
const router = useRouter();
const userBookStore = useUserBookStore();

const detail = ref(null);
// console.log(detail.data);
// console.log(route.params.id);
 

onMounted(async () => {
  await userBookStore.fetchMyBorrowed();
  detail.value = userBookStore.borrowed.find(
    (item) => item.id === Number(route.params.id)
  );
});



// RETURN BOOK
const returnBook = async () => {
  try {
    await userBookStore.returnBook(route.params.id);

    alert("Buku berhasil dikembalikan!");
    router.push("/");
  } catch (err) {
    console.error(err);
    alert("Gagal mengembalikan buku");
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 mt-10">
    <h1 class="text-3xl text-white font-bold mb-4">Detail Peminjaman</h1>

    <div v-if="detail" class="bg-white/70 shadow-lg p-6 rounded-2xl border-white/40">
      <p class="text-black mb-2 text-4xl font-bold">
         {{ detail.book.title }}
      </p>

      
      <div class="flex my-4 justify-between items-center">
        <div>
                <div class="text-black mb-2">
                    <strong>Tanggal Pinjam:</strong>
                    <p>{{ detail.borrow_date }}</p>
                </div>

                <div class="text-black mb-2">
                    <strong>Tanggal Akhir Kembali:</strong>
                <p>{{ detail.due_date }}</p>
                
                </div>
            </div>
            
        </div>

        <div class="flex justify-between items-center">
            <!-- RETURN BUTTON -->
        <button
            v-if="!detail.return_date"
            @click="returnBook"
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow"
        >
            Kembalikan Buku
        </button>

        <button
            v-else
            disabled
            class="bg-gray-400 text-white px-6 py-3 rounded-xl"
        >
            Sudah Dikembalikan
        </button>
                <div class="px-4 py-2 bg-green-600/30 border-green-900 rounded-2xl">
                {{ detail.status }}
            </div>
            </div>
        
        
        </div>

    <div v-else class="text-center text-gray-500 py-10">
      Data tidak ditemukan.
    </div>
  </div>
</template>
