import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })(),

  token: localStorage.getItem("token") || null,

  login: (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    set({ user: userData, token });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
