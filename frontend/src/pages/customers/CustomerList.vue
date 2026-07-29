<script setup lang="ts">
import {
  Button,
  Column,
  ConfirmDialog,
  DataTable,
  IconField,
  InputIcon,
  InputText,
  Select,
  useConfirm,
  useToast,
} from "primevue";
import { useCustomerStore } from "@/stores/customer.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { deleteCustomer } from "@/api/customers.api";

const customerStore = useCustomerStore();
const { fetch, setLimit, setPage, nextPage, prevPage } = customerStore;
const { items, loading, limit, currentPage, totalPages, search } =
  storeToRefs(customerStore);

const confirm = useConfirm();
const toast = useToast();

const onSearch = useDebounceFn(() => {
  setPage(1);
}, 400);

const confirmDelete = (id: number) => {
  confirm.require({
    message: "Are you sure you want to delete this customer?",
    header: "Confirm Delete",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: async () => {
      try {
        await deleteCustomer(id);
        toast.add({
          severity: "success",
          summary: "Deleted",
          detail: "Customer Removed",
          life: 3000,
        });
        fetch();
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete customer",
          life: 3000,
        });
      }
    },
  });
};

onMounted(() => {
  fetch();
});
</script>

<template>
  <div class="min-h-screen bg-surface-50 font-sans text-surface-900">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 mb-1">Customers</h1>
        <p class="text-surface-500 text-sm">
          The list here shows all customers
        </p>
      </div>

      <Button asChild v-slot="slotProps">
        <RouterLink :to="{ name: 'customers-create' }" :class="slotProps.class">
          Add Customer
        </RouterLink>
      </Button>
    </div>

    <div class="bg-white rounded-2xl border border-surface-200 p-2">
      <div
        class="flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-4"
      >
        <IconField iconPosition="left" class="w-full md:w-80">
          <InputIcon class="pi pi-search text-surface-400" />
          <InputText v-model="search" placeholder="Search" @input="onSearch" />
        </IconField>
      </div>

      <DataTable
        :value="items"
        :loading="loading"
        dataKey="id"
        class="clean-table"
        :rowHover="true"
      >
        <Column field="name" header="Name" class="min-w-[16rem]">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <i class="pi pi-user text-primary-600"></i>
              </div>
              <span class="font-semibold text-surface-900">
                {{ data.name }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="phone" header="Phone">
          <template #body="{ data }">
            <span class="text-surface-600">
              {{ data.phone }}
            </span>
          </template>
        </Column>

        <Column header="Actions" style="width: 5rem">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <RouterLink
                :to="{ name: 'customers-edit', params: { id: data.id } }"
              >
                <Button
                  icon="pi pi-pencil"
                  text
                  rounded
                  severity="primary"
                  class="w-9! h-9! border-surface-200! text-surface-200! hover:text-primary-600! hover:border-primary-500 hover:bg-primary-50! bg-white"
                />
              </RouterLink>

              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                class="w-9! h-9! border-surface-200! text-surface-200! hover:text-primary-600! hover:border-primary-500 hover:bg-primary-50! bg-white"
                @click="confirmDelete(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <div
        class="flex justify-between items-center px-4 py-4 border-t border-surface-100 gap-4"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm text-surface-500">Rows per page:</span>
          <Select
            :model-value="limit"
            :options="[5, 10, 20, 50]"
            @update:model-value="setLimit"
          />
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-surface-600">
            {{ currentPage }} of {{ totalPages }}
          </span>

          <div class="flex gap-1">
            <Button
              icon="pi pi-chevron-left"
              text
              rounded
              severity="secondary"
              :disabled="currentPage === 1"
              class="w-9! h-9! border! border-surface-500! hover:bg-surface-50!"
              @click="prevPage()"
            />
            <Button
              icon="pi pi-chevron-right"
              text
              rounded
              severity="secondary"
              :disabled="currentPage === totalPages"
              class="w-9! h-9! border! border-surface-500! hover:bg-surface-50!"
              @click="nextPage()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog />
</template>
