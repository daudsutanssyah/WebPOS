<script setup>
import router from "@/router";
import { useAuthStore } from "@/stores/auth.store";
import { Button, Dialog } from "primevue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const logoutDialog = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  logoutDialog.value = false;
  router.push({ name: "login" });
};

const route = useRoute();

const menuItems = ref([
  {
    label: "General",
    items: [
      { icon: "pi pi-th-large", to: "/", label: "Dashboard" },
      { icon: "pi pi-shopping-cart", to: "/pos", label: "POS" }
    ],
  },
  {
    label: "Management",
    items: [
      {
        icon: "pi pi-tag",
        to: "/product-categories",
        label: "Product Categories",
      },
      { icon: "pi pi-box", to: "/products", label: "Products" },
      { icon: "pi pi-users", to: "/customers", label: "Customers" },
      { icon: "pi pi-receipt", to: "/transactions", label: "Transactions" },
    ],
  },
]);
</script>

<template>
  <div
    class="fixed left-0 top-0 h-full w-64 bg-white border-r border-surface-200 flex flex-col z-50 transition-all duration-300"
  >
    <!-- logo -->
    <div class="h-20 flex items-center px-8 border-b border-surface-100">
      <div
        class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white mr-3"
      >
        <i class="pi pi-bolt text-lg"></i>
      </div>
      <span class="text-xl font-bold text-surface-900">WebPOS</span>
    </div>

    <!-- menu -->
    <div class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
      <div v-for="(section, i) in menuItems" :key="i">
        <div
          class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 px-3"
        >
          {{ section.label }}
        </div>

        <div class="flex flex-col gap-1">
          <router-link
            v-for="(item, j) in section.items"
            :to="item.to"
            :key="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200"
            :class="[
              route.path == item.to
                ? 'bg-surface-100 text-primary-600'
                : 'text-surface-900 hover:bg-surface-100',
            ]"
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span class="font-medium text-sm">{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- User Profile -->
    <div class="p-4 border-t border-surface-200">
      <button
        @click="logoutDialog = true"
        class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50"
      >
        <div
          class="w-9 h-9 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden"
        >
          <i class="pi pi-user text-lg text-surface-600"></i>
        </div>
        <div class="text-left">
          <div class="text-sm font-semibold text-surface-900">
            {{ user?.name }}
          </div>
          <div class="text-xs text-surface-500">
            {{ user?.email }}
          </div>
        </div>
        <div
          class="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 group-hover:bg-red-100 group-hover:text-red-600 transition-colors"
        >
          <i class="pi pi-sign-out text-lg"></i>
        </div>
      </button>
    </div>
  </div>

  <Dialog
    v-model:visible="logoutDialog"
    header="Confirm Logout"
    :modal="true"
    class="w-100"
  >
    <span class="text-surface-500 block mb-8">Are u sure to logout?</span>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="logoutDialog = false"
      />
      <Button
        type="button"
        label="Logout"
        severity="danger"
        @click="handleLogout"
      />
    </div>
  </Dialog>
</template>
