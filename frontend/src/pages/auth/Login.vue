<script setup lang="ts">
import router from "@/router";
import { useAuthStore } from "@/stores/auth.store";
import { Button, InputText, Message } from "primevue";
import { ref } from "vue";

const DEMO_EMAIL = "demo@webpos.com";
const DEMO_PASSWORD = "password";

const auth = useAuthStore();
const error = ref<string | null>(null);
const isLoggingInAsDemo = ref(false);
const form = ref({
  email: "",
  password: "",
});

async function login() {
  error.value = null;

  if (!form.value.email || !form.value.password) {
    error.value = "Email and password are required";
    return;
  }

  try {
    await auth.login(form.value.email, form.value.password);
    router.push({ name: "dashboard" });
  } catch (e) {
    error.value = "Invalid email or password";
  }
}

async function loginAsDemo() {
  error.value = null;
  isLoggingInAsDemo.value = true;
  form.value.email = DEMO_EMAIL;
  form.value.password = DEMO_PASSWORD;

  try {
    await auth.login(DEMO_EMAIL, DEMO_PASSWORD);
    router.push({ name: "dashboard" });
  } catch (e) {
    error.value = "Demo account is currently unavailable. Please try again later.";
  } finally {
    isLoggingInAsDemo.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-surface-50 px-4 py-10">
    <div class="w-full max-w-100">
      <div class="bg-white p-8 rounded-2xl shadow-xl border border-surface-100">
        <!-- header -->
        <div class="text-center mb-8">
          <div
            class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 mx-auto mb-4">
            <i class="pi pi-bolt text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-surface-900 mb-2">Welcome Back</h1>
          <p class="text-surface-500">Please sign in to your account</p>
        </div>

        <form @submit.prevent="login" class="flex flex-col gap-5">
          <Message v-if="error" severity="error" :closable="false">{{
            error
          }}</Message>

          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label for="email" class="font-medium text-surface-900">
              Email <span class="text-red-600">*</span>
            </label>

            <InputText id="email" v-model="form.email" type="text" placeholder="name@email.com" fluid
              class="bg-surface-50! focus:bg-white! border-surface-200" />
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-2">
            <label for="password" class="font-medium text-surface-900">
              Password <span class="text-red-600">*</span>
            </label>

            <InputText id="password" v-model="form.password" type="password" placeholder="********" fluid
              class="bg-surface-50! focus:bg-white! border-surface-200" />
          </div>

          <Button type="submit" label="Login" fluid class="mt-2" />
        </form>

        <!-- Demo Account Box -->
        <div class="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">🔑</span>
            <span class="font-semibold text-blue-800 text-sm">Demo Account</span>
          </div>
          <div class="flex flex-col gap-1 mb-3 text-sm text-blue-700">
            <div class="flex items-center gap-2">
              <span class="text-blue-400 w-16 shrink-0">Email</span>
              <code class="bg-white border border-blue-200 rounded px-2 py-0.5 text-blue-800 font-mono text-xs select-all">demo@webpos.com</code>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-blue-400 w-16 shrink-0">Password</span>
              <code class="bg-white border border-blue-200 rounded px-2 py-0.5 text-blue-800 font-mono text-xs select-all">password</code>
            </div>
          </div>
          <Button
            label="Login as Demo"
            fluid
            severity="secondary"
            size="small"
            :loading="isLoggingInAsDemo"
            @click="loginAsDemo"
            class="bg-white! border-blue-300! text-blue-700! hover:bg-blue-100!"
          />
        </div>

        <!-- Disclaimer -->
        <p class="text-center text-xs text-surface-400 mt-4 leading-relaxed">
          This is a demo application built for portfolio purposes.<br />
          Data may be reset at any time.
        </p>
      </div>
    </div>
  </div>
</template>
