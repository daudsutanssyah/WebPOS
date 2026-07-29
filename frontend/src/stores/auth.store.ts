import { loginApi, logoutApi, meApi } from "@/api/auth.api";
import type { User } from "@/types/user";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    loading: false,
    isAuthenticated: !!localStorage.getItem("token"),
  }),

  actions: {
    async login(email: string, password: string) {
      this.loading = true;

      try {
        const res = await loginApi({ email, password });
         const token = res.data.data.token;
        localStorage.setItem("token", token);

        await this.fetchUser();

        this.isAuthenticated = true;
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        this.isAuthenticated = false;
        this.user = null;
        return;
      }

      try {
        const res = await meApi();
        this.user = res.data.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    async logout() {
      try {
        await logoutApi();
      } catch (e) {
      } finally {
        localStorage.removeItem("token");
        this.user = null;
        this.isAuthenticated = false;
      }
    },
  },
});
