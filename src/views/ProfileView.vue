<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const auth = useAuthStore();
const router = useRouter();

const showEdit = ref(false);

const editForm = ref({
  name: "",
  email: "",
});

if (!auth.isLoggedIn) {
  router.push("/login");
}


  
// === OPEN EDIT PROFILE ===
const openEditProfile = () => {
  editForm.value.name = userStore.profile?.name || "";
  editForm.value.email = userStore.profile?.email || "";
  showEdit.value = true;
};

// === SAVE PROFILE ===
const saveProfile = async () => {
  const success = await userStore.updateProfile({
    name: editForm.value.name,
    email: editForm.value.email,
  });

  if (success) showEdit.value = false;
};

// === LOGOUT ===
const logout = async () => {
  if (confirm("Are you sure you want to logout?")) {
    await auth.logout();
  }
};

// === DELETE ACCOUNT ===
const deleteAccount = async () => {
  if (confirm("This action is permanent. Delete your account?")) {
    await userStore.deleteAccount();
  }
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
};



onMounted(() => {
  userStore.loadProfile();
});
</script>




<template>

  <div class="min-h-screen bg-linear-to-br flex items-center justify-center p-6">
    <div
      class="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
    >
      <!-- Title -->
      <h1 class="text-3xl font-bold text-white text-center mb-6">My Profile</h1>

      <!-- Content Layout -->
      <div class="flex gap-10 justify-around sm:flex-row flex-col items-center">
        <!-- Profile Card -->
        <div class="border w-full border-white/20 rounded-2xl p-6 shadow-xl text-white">
          <h2 class="text-2xl font-semibold mb-4">{{ userStore.profile?.name }}</h2>
          <div class="space-y-2 text-gray-200">
            <div>
              <p class="font-medium">{{ userStore.profile?.email }}</p>
            </div>

            <div class="flex justify-between">
                <div>
                <span class="text-gray-400 text-sm">Role</span>
                <p class="capitalize font-medium">{{ userStore.profile?.role }}</p>
              </div>

              <div>
                <span class="text-gray-400 text-sm">Joined</span>
                <p class="font-medium">{{ formatDate(userStore.profile?.created_at) }}</p>
              </div>
            </div>
            
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col w-full text-white">
          <button
            @click="openEditProfile"
            class="mt-5 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition px-4 py-3 rounded-xl shadow-md"
          >
            Edit Profile
          </button>

          <button
            @click="logout"
            class="mt-3 w-full bg-red-500/80 hover:bg-red-600 active:bg-red-700 transition px-4 py-3 rounded-xl shadow-md"
          >
            Logout
          </button>

          <button
            @click="deleteAccount"
            class="mt-3 w-full bg-black/40 hover:bg-black/50 border border-white/20 transition px-4 py-3 rounded-xl shadow-md"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Popup -->
    <div
      v-if="showEdit"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition"
    >
      <div
        class="bg-white/10 text-white border border-white/20 backdrop-blur-xl p-6 rounded-2xl w-[380px] shadow-2xl"
      >
        <h2 class="text-2xl font-bold text-center mb-5">Edit Profile</h2>

        <label class="block text-gray-300 mb-1">Name</label>
        <input
          v-model="editForm.name"
          type="text"
          class="w-full p-3 rounded-xl bg-white/20 border border-white/30 placeholder-gray-300
                 focus:ring-2 focus:ring-blue-400 outline-none mb-4"
        />

        <label class="block text-gray-300 mb-1">Email</label>
        <input
          v-model="editForm.email"
          type="email"
          class="w-full p-3 rounded-xl bg-white/20 border border-white/30 placeholder-gray-300
                 focus:ring-2 focus:ring-blue-400 outline-none mb-4"
        />

        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="showEdit = false"
            class="px-4 py-2 rounded-xl bg-gray-400/20 hover:bg-gray-400/30
                   border border-white/20 transition"
          >
            Cancel
          </button>

          <button
            @click="saveProfile"
            class="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
                   active:bg-green-800 transition shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


