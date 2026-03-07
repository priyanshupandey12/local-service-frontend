import { create } from "zustand";

const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,

  setBookings: (bookings) => set({ bookings }),

  setCurrentBooking: (booking) => set({ currentBooking: booking }),

  clearBookings: () => set({ bookings: [], currentBooking: null }),
}));

export default useBookingStore;