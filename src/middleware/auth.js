import { useAuthStore } from "@/stores/authStore";

// Middleware untuk route yang memerlukan login
export const requireAuth = (to, from, next) => {
  const auth = useAuthStore();

  if (!auth.isLoggedIn) {
    next("/login");
  } else {
    next();
  }
};

// Middleware untuk route yang hanya bisa diakses admin
export const requireAdmin = (to, from, next) => {
  const auth = useAuthStore();

  if (!auth.isLoggedIn) {
    next("/login");
  } else if (!auth.isAdmin) {
    // User biasa mencoba akses admin page
    next("/");
  } else {
    next();
  }
};

// Middleware untuk route yang hanya bisa diakses user biasa
export const requireUser = (to, from, next) => {
  const auth = useAuthStore();

  if (!auth.isLoggedIn) {
    next("/login");
  } else if (auth.isAdmin) {
    // Admin mencoba akses user page
    next("/admin/dashboard");
  } else {
    next();
  }
};

// Middleware untuk route guest (login/register)
export const requireGuest = (to, from, next) => {
  const auth = useAuthStore();

  if (auth.isLoggedIn) {
    if (auth.isAdmin) {
      next("/admin/dashboard");
    } else {
      next("/");
    }
  } else {
    next();
  }
};
