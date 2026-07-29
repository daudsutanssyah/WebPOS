import { getCategories } from "@/api/product-categories.api";
import type { ProductCategory } from "@/types/product-category";
import { defineStore } from "pinia";

export const useProductCategoryStore = defineStore("productCategory", {
  state: () => ({
    items: [] as ProductCategory[],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
    page: 1,
    limit: 10,
    search: "",
    loading: false,
  }),

  getters: {
    currentPage: (state) => state.pagination.current_page || 1,
    totalPages: (state) => state.pagination.last_page || 1,
  },

  actions: {
    async fetch() {
      this.loading = true;

      try {
        const res = await getCategories({
          page: this.page,
          search: this.search,
          limit: this.limit,
        });

        this.items = Array.isArray(res.data.data.items) ? res.data.data.items : res.data.data.items.data;
        this.pagination = res.data.data.pagination;
      } catch (error) {
        console.error("Failedto fetch categories:", error);
      } finally {
        this.loading = false;
      }
    },

    setPage(page: number) {
      this.page = page;
      this.fetch();
    },

    setLimit(limit: number) {
      this.limit = limit;
      this.page = 1;
      this.fetch();
    },

    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.page = this.pagination.current_page + 1;
        this.fetch();
      }
    },

    prevPage() {
      if (this.pagination.current_page > 1) {
        this.page = this.pagination.current_page - 1;
        this.fetch();
      }
    },
  },
});
