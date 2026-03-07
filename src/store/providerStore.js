import { create } from "zustand";

const useProviderStore = create((set) => ({
  providers: [],
  currentProvider: null,

  setProviders: (providers) => set({ providers }),

  setCurrentProvider: (provider) => set({ currentProvider: provider }),

  clearProviders: () => set({ providers: [], currentProvider: null }),
}));

export default useProviderStore;