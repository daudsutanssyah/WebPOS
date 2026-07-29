<script setup>
import { RouterView } from "vue-router";
import AppSidebar from "./AppSidebar.vue";
</script>

<template>
  <div class="min-h-screen bg-surface-50 flex">
    <!-- Sidebar -->
    <AppSidebar />

    <div class="flex-1 ml-64 transition-all duration-300">
      <div class="p-8 w-full">
        <RouterView />
      </div>
    </div>
  </div>
</template>
