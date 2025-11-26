<script setup>
import { onMounted, computed, ref } from "vue";
import { useBooksStore } from "@/stores/booksStore";
import { useAuthStore } from "@/stores/authStore";

const booksStore = useBooksStore();
const auth = useAuthStore();

// STATE
const searchQuery = ref(""); // <-- UBAH: Hanya 1 search query
const searchType = ref("all"); // <-- TAMBAH: Filter type
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedBook = ref(null);

const formData = ref({
  title: "",
  author: "",
  category: "",
  stock: 0,
});

// COMPUTED
const books = computed(() => booksStore.books);
const loading = computed(() => booksStore.loading);

// SEARCH BOOKS
const searchBooks = async () => {
  if (!searchQuery.value.trim()) {
    // Jika kosong, fetch semua
    await booksStore.fetchBooks();
    return;
  }

  try {
    const params = {};

    // Jika "all", cari di semua field
    if (searchType.value === "all") {
      // Backend harus support multiple params sekaligus
      params.title = searchQuery.value;
      params.author = searchQuery.value;
      params.category = searchQuery.value;
    } else {
      // Jika pilih spesifik (title/author/category)
      params[searchType.value] = searchQuery.value;
    }

    await booksStore.searchBooks(params);
  } catch (err) {
    alert("Buku tidak ditemukan");
  }
};

// RESET SEARCH
const resetSearch = () => {
  searchQuery.value = "";
  searchType.value = "all";
  booksStore.fetchBooks();
};

// OPEN ADD MODAL
const openAddModal = () => {
  formData.value = {
    title: "",
    author: "",
    category: "",
    stock: 0,
  };
  showAddModal.value = true;
};

// CREATE BOOK
const createBook = async () => {
  try {
    await booksStore.createBook(formData.value);
    showAddModal.value = false;
    alert("Buku berhasil ditambahkan");
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menambahkan buku");
  }
};

// OPEN EDIT MODAL
const openEditModal = (book) => {
  formData.value = {
    title: book.title,
    author: book.author,
    category: book.category,
    stock: book.stock,
  };
  selectedBook.value = book;
  showEditModal.value = true;
};

// UPDATE BOOK
const updateBook = async () => {
  try {
    await booksStore.updateBook(selectedBook.value.id, formData.value);
    showEditModal.value = false;
    alert("Buku berhasil diupdate");
  } catch (err) {
    alert(err.response?.data?.message || "Gagal mengupdate buku");
  }
};

// DELETE BOOK
const deleteBook = async (id, title) => {
  if (!confirm(`Hapus buku "${title}"?`)) return;

  try {
    await booksStore.deleteBook(id);
    alert("Buku berhasil dihapus");
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menghapus buku");
  }
};

onMounted(async () => {
  await booksStore.fetchBooks();
});
</script>

<template>
  <div class="min-h-screen w-full py-24 px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Kelola Buku</h1>

      <button
        @click="openAddModal"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
      >
        + Tambah Buku
      </button>
    </div>

    <!-- Search Bar (1 Input + Dropdown) -->
    <div class="mb-6 bg-white p-4 rounded-xl shadow">
      <div class="flex gap-3">
        <!-- Search Input -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari buku..."
          class="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          @keyup.enter="searchBooks"
        />

        <!-- Search Button -->
        <button
          @click="searchBooks"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Cari
        </button>

        <!-- Reset Button -->
        <button
          @click="resetSearch"
          class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-14 w-14 border-4 border-white border-t-transparent"
      ></div>
    </div>

    <!-- Books Table -->
    <div v-else class="bg-white shadow border border-gray-200 rounded-xl p-6">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-600 border-b">
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Judul</th>
              <th class="py-3 px-4">Author</th>
              <th class="py-3 px-4">Kategori</th>
              <th class="py-3 px-4">Stock</th>
              <th class="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="book in books"
              :key="book.id"
              class="border-b last:border-0 hover:bg-gray-50 transition"
            >
              <td class="py-3 px-4 font-medium">{{ book.id }}</td>
              <td class="py-3 px-4">{{ book.title }}</td>
              <td class="py-3 px-4">{{ book.author }}</td>
              <td class="py-3 px-4">{{ book.category }}</td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    book.stock > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700',
                  ]"
                >
                  {{ book.stock }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex gap-2 justify-center">
                  <button
                    @click="openEditModal(book)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteBook(book.id, book.title)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    title="Hapus"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p
          v-if="!books || books.length === 0"
          class="text-center text-gray-500 py-8"
        >
          Tidak ada data buku.
        </p>
      </div>
    </div>

    <!-- Modals tetap sama -->
    <!-- ADD BOOK MODAL -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-2xl w-[480px] shadow-2xl">
        <h2 class="text-2xl font-bold mb-4">Tambah Buku Baru</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Judul</label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Author</label>
            <input
              v-model="formData.author"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Kategori</label>
            <input
              v-model="formData.category"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Stock</label>
            <input
              v-model.number="formData.stock"
              type="number"
              min="0"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showAddModal = false"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
          >
            Batal
          </button>
          <button
            @click="createBook"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>

    <!-- EDIT BOOK MODAL -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-2xl w-[480px] shadow-2xl">
        <h2 class="text-2xl font-bold mb-4">Edit Buku</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Judul</label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Author</label>
            <input
              v-model="formData.author"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Kategori</label>
            <input
              v-model="formData.category"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Stock</label>
            <input
              v-model.number="formData.stock"
              type="number"
              min="0"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
          >
            Batal
          </button>
          <button
            @click="updateBook"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
