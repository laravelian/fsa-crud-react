import { create } from "zustand";

export const useStateUser = create((set) => ({
  user: {},
  token: localStorage.getItem("ACCESS_TOKEN"),
  notification: '',
  setNotification: (message) => {
    set(() => ({ notification: message }));
    setTimeout(() => {
      set(() => ({ notification: '' }));
    }, 5000);
  },
  setUser: (user) => set(() => ({ user: user })),
  setToken: (token) => {
    set(() => ({ token: token }));
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  },
}));
