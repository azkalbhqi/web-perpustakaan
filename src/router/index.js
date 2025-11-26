import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import BooksView from "@/views/BooksView.vue";
import ProfileView from "@/views/ProfileView.vue";
import DebugView from "@/views/DebugView.vue";
import BookView from "@/views/BookView.vue";
import BorrowedDetailView from "@/views/BorrowedDetailView.vue";
import HistoryView from "@/views/HistoryView.vue";
import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";
import AdminUsersView from "@/views/admin/AdminUsersView.vue";

import {
  requireAuth,
  requireAdmin,
  requireUser,
  requireGuest,
} from "@/middleware/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ========== GUEST ROUTES (Login/Register) ==========
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: requireGuest,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      beforeEnter: requireGuest,
    },

    // ========== USER ROUTES ==========
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: requireUser,
    },
    {
      path: "/books",
      name: "Books",
      component: BooksView,
      beforeEnter: requireUser,
    },
    {
      path: "/books/:id",
      name: "Book-detail",
      component: BookView,
      beforeEnter: requireUser,
    },
    {
      path: "/borrowed/:id",
      name: "BorrowedDetail",
      component: BorrowedDetailView,
      beforeEnter: requireUser,
    },
    {
      path: "/history",
      name: "History",
      component: HistoryView,
      beforeEnter: requireUser,
    },

    // ========== ADMIN ROUTES ==========
    {
      path: "/admin/dashboard",
      name: "AdminDashboard",
      component: AdminDashboardView,
      beforeEnter: requireAdmin,
    },
    {
      path: "/admin/users",
      name: "AdminUsers",
      component: AdminUsersView,
      beforeEnter: requireAdmin,
    },

    // ========== SHARED ROUTES (Both User & Admin) ==========
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      beforeEnter: requireAuth,
    },

    // ========== DEBUG ROUTE ==========
    {
      path: "/debug",
      name: "debug",
      component: DebugView,
    },

    // ========== 404 NOT FOUND ==========
    {
      path: "/:pathMatch(.*)*",
      redirect: "/login",
    },
  ],
});

export default router;
