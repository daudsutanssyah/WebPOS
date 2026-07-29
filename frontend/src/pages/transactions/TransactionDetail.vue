<script setup lang="ts">
import { getTransaction } from "@/api/transaction.api";
import type { Transaction } from "@/types/transaction";
import { Button, Column, DataTable, useToast } from "primevue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const toast = useToast();

const loading = ref(false);
const transaction = ref<Transaction | null>(null);

const transactionId = computed<number>(() => Number(route.params.id));

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  loading.value = true;

  try {
    const res = await getTransaction(transactionId.value);
    transaction.value = res.data.data;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load transaction",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-surface-50 font-sans text-surface-900">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 mb-1">
          Transaction Detail
        </h1>
        <p class="text-surface-500 text-sm">View transaction information</p>
      </div>

      <Button asChild v-slot="slotProps">
        <RouterLink :to="{ name: 'transactions' }" :class="slotProps.class">
          <i class="pi pi-arrow-left"></i>
          Back
        </RouterLink>
      </Button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
    </div>

    <div v-else-if="transaction" class="flex flex-col gap-6">
      <!-- Transaction Info -->
      <div class="bg-white rounded-2xl border border-surface-200 p-6">
        <h2 class="text-lg font-semibold text-surface-900 mb-4">
          Transaction Information
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p class="text-sm text-surface-500 mb-1">Transaction Code</p>
            <p class="font-semibold text-primary-600">{{ transaction.code }}</p>
          </div>
          <div>
            <p class="text-sm text-surface-500 mb-1">Customer</p>
            <p class="font-medium text-surface-900">
              {{ transaction.customer?.name ?? "Walk-in Customer" }}
            </p>
          </div>
          <div>
            <p class="text-sm text-surface-500 mb-1">Date</p>
            <p class="font-medium text-surface-900">
              {{ formatDate(transaction.created_at) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-surface-500 mb-1">Total</p>
            <p class="font-bold text-lg text-green-600">
              {{ formatPrice(transaction.total) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Transaction Items -->
      <div class="bg-white rounded-2xl border border-surface-200 p-6">
        <h2 class="text-lg font-semibold text-surface-900 mb-4">Items</h2>

        <DataTable :value="transaction.items" dataKey="id" class="clean-table">
          <Column field="product_name" header="Product">
            <template #body="{ data }">
              <span class="font-medium text-surface-900">{{
                data.product.name
              }}</span>
            </template>
          </Column>
          <Column field="price" header="Price">
            <template #body="{ data }">
              <span class="text-surface-600">{{
                formatPrice(data.price)
              }}</span>
            </template>
          </Column>
          <Column field="quantity" header="Qty" style="width: 5rem">
            <template #body="{ data }">
              <span class="text-surface-900">{{ data.quantity }}</span>
            </template>
          </Column>
          <Column field="subtotal" header="Subtotal">
            <template #body="{ data }">
              <span class="font-medium text-surface-900">{{
                formatPrice(data.subtotal)
              }}</span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Summary -->
      <div class="bg-white rounded-2xl border border-surface-200 p-6">
        <h2 class="text-lg font-semibold text-surface-900 mb-4">Summary</h2>

        <div class="max-w-xs ml-auto flex flex-col gap-3">
          <div class="flex justify-between">
            <span class="text-surface-500">Subtotal</span>
            <span class="font-medium text-surface-900">{{
              formatPrice(transaction.subtotal)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-500">Tax</span>
            <span class="font-medium text-surface-900">{{
              formatPrice(transaction.tax)
            }}</span>
          </div>
          <div class="flex justify-between pt-3 border-t border-surface-200">
            <span class="font-semibold text-surface-900">Total</span>
            <span class="font-bold text-lg text-green-600">{{
              formatPrice(transaction.total)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
