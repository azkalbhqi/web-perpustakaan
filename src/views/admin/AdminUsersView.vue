<script setup>
import { onMounted, computed, ref } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const adminStore = useAdminStore();
const auth = useAuthStore();
const router = useRouter();

// Check if user is admin
// if (!auth.isLoggedIn || auth.user?.role !== "admin") {
//   router.push("/login");
// }

// STATE
const searchId = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showBorrowingsModal = ref(false);
const selectedUserId = ref(null);

const formData = ref({
  name: "",
  email: "",
  password: "",
  role: "user",
});

// COMPUTED
const users = computed(() => adminStore.users);
const loading = computed(() => adminStore.loading);
const userBorrowings = computed(() => adminStore.userBorrowings);

// SEARCH USER BY ID
const searchUserById = async () => {
  if (!searchId.value) {
    alert("Masukkan ID user");
    return;
  }

  try {
    const user = await adminStore.getUserById(searchId.value);
    alert(`User ditemukan: ${user.name} (${user.email})`);
  } catch (err) {
    console.error("Error:", err);
    alert("User tidak ditemukan");
  }
};

// OPEN ADD MODAL
const openAddModal = () => {
  formData.value = {
    name: "",
    email: "",
    password: "",
    role: "user",
  };
  showAddModal.value = true;
};

// CREATE USER
const createUser = async () => {
  try {
    await adminStore.createUser(formData.value);
    showAddModal.value = false;
    alert("User berhasil ditambahkan");
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menambahkan user");
  }
};

// OPEN EDIT MODAL
const openEditModal = (user) => {
  formData.value = {
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
  };
  selectedUserId.value = user.id;
  showEditModal.value = true;
};

// UPDATE USER
const updateUser = async () => {
  try {
    const dataToUpdate = { ...formData.value };
    if (!dataToUpdate.password) {
      delete dataToUpdate.password; // Jangan kirim password jika kosong
    }

    await adminStore.updateUser(selectedUserId.value, dataToUpdate);
    showEditModal.value = false;
    alert("User berhasil diupdate");
  } catch (err) {
    alert(err.response?.data?.message || "Gagal mengupdate user");
  }
};

// DELETE USER
const deleteUser = async (id, name) => {
  if (!confirm(`Hapus user ${name}?`)) return;

  try {
    await adminStore.deleteUser(id);
    alert("User berhasil dihapus");
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menghapus user");
  }
};

// VIEW USER BORROWINGS
const viewBorrowings = async (userId, userName) => {
  try {
    await adminStore.fetchUserBorrowings(userId);
    showBorrowingsModal.value = true;
    selectedUserId.value = userId;
  } catch (err) {
    console.error("Error:", err);
    alert("Gagal memuat data peminjaman");
  }
};

onMounted(async () => {
  await adminStore.fetchAllUsers();
});
</script>

<template>
  <div class="min-h-screen w-full py-24 px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Daftar Users</h1>

      <button
        @click="openAddModal"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
      >
        + Tambah User
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-6 flex gap-3">
      <input
        v-model="searchId"
        type="number"
        placeholder="Cari user berdasarkan ID..."
        class="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button
        @click="searchUserById"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        Cari
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-14 w-14 border-4 border-white border-t-transparent"
      ></div>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white shadow border border-gray-200 rounded-xl p-6">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-600 border-b">
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Nama</th>
              <th class="py-3 px-4">Email</th>
              <th class="py-3 px-4">Role</th>
              <th class="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b last:border-0 hover:bg-gray-50 transition"
            >
              <td class="py-3 px-4 font-medium">{{ user.id }}</td>
              <td class="py-3 px-4">{{ user.name }}</td>
              <td class="py-3 px-4">{{ user.email }}</td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700',
                  ]"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex gap-2 justify-center">
                  <button
                    @click="openEditModal(user)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteUser(user.id, user.name)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    title="Hapus"
                  >
                    Delete
                  </button>
                  <button
                    @click="viewBorrowings(user.id, user.name)"
                    class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm transition"
                    title="Lihat Peminjaman"
                  >
                    Lihat Peminjaman
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p
          v-if="!users || users.length === 0"
          class="text-center text-gray-500 py-8"
        >
          Tidak ada data user.
        </p>
      </div>
    </div>

    <!-- ADD USER MODAL -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-2xl w-[480px] shadow-2xl">
        <h2 class="text-2xl font-bold mb-4">Tambah User Baru</h2>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium mb-1"
              >Nama</label
            >
            <input
              v-model="formData.name"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium mb-1"
              >Email</label
            >
            <input
              v-model="formData.email"
              type="email"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-1"
              >Password</label
            >
            <input
              v-model="formData.password"
              type="password"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium mb-1"
              >Role</label
            >
            <select
              v-model="formData.role"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
            @click="createUser"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>

    <!-- EDIT USER MODAL -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-2xl w-[480px] shadow-2xl">
        <h2 class="text-2xl font-bold mb-4">Edit User</h2>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium mb-1"
              >Nama</label
            >
            <input
              v-model="formData.name"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium mb-1"
              >Email</label
            >
            <input
              v-model="formData.email"
              type="email"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-1"
              >Password (kosongkan jika tidak diubah)</label
            >
            <input
              v-model="formData.password"
              type="password"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium mb-1"
              >Role</label
            >
            <select
              v-model="formData.role"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
            @click="updateUser"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- BORROWINGS MODAL -->
    <div
      v-if="showBorrowingsModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-6 rounded-2xl w-[600px] shadow-2xl max-h-[80vh] overflow-y-auto"
      >
        <h2 class="text-2xl font-bold mb-4">Buku yang Dipinjam</h2>

        <div
          v-if="!userBorrowings || userBorrowings.length === 0"
          class="text-center text-gray-500 py-8"
        >
          Tidak ada peminjaman
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="borrowing in userBorrowings"
            :key="borrowing.id"
            class="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <h3 class="font-bold">{{ borrowing.book?.title }}</h3>
            <p class="text-sm text-gray-600">
              Pinjam: {{ borrowing.borrow_date }}
            </p>
            <p class="text-sm text-gray-600">Due: {{ borrowing.due_date }}</p>
            <span
              :class="[
                'px-2 py-1 rounded text-xs inline-block mt-2',
                borrowing.status === 'dikembalikan'
                  ? 'bg-green-100 text-green-700'
                  : borrowing.status === 'terlambat'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700',
              ]"
            >
              {{ borrowing.status }}
            </span>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="showBorrowingsModal = false"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
