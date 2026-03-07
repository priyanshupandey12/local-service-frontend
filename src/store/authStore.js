import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
    isLoading: true,

  setAuth: (userId, role) => set({ 
    user: userId, 
    role, 
    isAuthenticated: true,
      isLoading: false
  }),

 

  clearAuth: () => set({ 
    user: null, 
    role: null, 
    isAuthenticated: false ,
      isLoading: false
  }),
}));



export default useAuthStore;