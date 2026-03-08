import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,

      setAuth: (userId, role, token) =>
        set({ user: userId, role, token, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, role: null, token: null, isAuthenticated: false }),
    }),
    { name: "auth" }
  )
);

export default useAuthStore;