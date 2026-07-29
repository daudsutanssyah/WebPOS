<script setup lang="ts">
import { Button, Column, DataTable, IconField, InputIcon, InputText, Select } from 'primevue';
import { useTransactionStore } from '@/stores/transaction.store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const transactionStore = useTransactionStore();
const { fetch, setLimit, setPage, nextPage, prevPage } = transactionStore
const { items, loading, limit, currentPage, totalPages, search } = storeToRefs(transactionStore)

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const onSearch = useDebounceFn(() => {
    setPage(1)
}, 400)

onMounted(() => {
    fetch()
})
</script>

<template>
    <div class="min-h-screen bg-surface-50 font-sans text-surface-900">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold text-surface-900 mb-1">
                    Transactions
                </h1>
                <p class="text-surface-500 text-sm">
                    The list here shows all transactions
                </p>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-surface-200 p-2">
            <div class="flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-4">
                <IconField iconPosition="left" class="w-full md:w-80">
                    <InputIcon class="pi pi-search text-surface-400" />
                    <InputText v-model="search" placeholder="Search by code..." @input="onSearch" />
                </IconField>
            </div>

            <DataTable :value="items" :loading="loading" dataKey="id" class="clean-table" :rowHover="true">
                <Column field="code" header="Code" class="min-w-[10rem]">
                    <template #body="{ data }">
                        <span class="font-semibold text-primary-600">
                            {{ data.code }}
                        </span>
                    </template>
                </Column>

                <Column field="customer" header="Customer">
                    <template #body="{ data }">
                        <span class="text-surface-900">
                            {{ data.customer?.name ?? 'Walk-in Customer' }}
                        </span>
                    </template>
                </Column>

                <Column field="total" header="Total">
                    <template #body="{ data }">
                        <span class="font-semibold text-surface-900">
                            {{ formatPrice(data.total) }}
                        </span>
                    </template>
                </Column>

                <Column field="created_at" header="Date">
                    <template #body="{ data }">
                        <span class="text-surface-600 text-sm">
                            {{ formatDate(data.created_at) }}
                        </span>
                    </template>
                </Column>

                <Column header="Actions" style="width: 5rem;">
                    <template #body="{ data }">
                        <RouterLink :to="{ name: 'transactions-detail', params: { id: data.id } }">
                            <Button icon="pi pi-eye" text rounded severity="primary"
                                class="w-9! h-9! border-surface-200! text-surface-200! hover:text-primary-600! hover:border-primary-500 hover:bg-primary-50! bg-white" />
                        </RouterLink>
                    </template>
                </Column>
            </DataTable>

            <div class="flex justify-between items-center px-4 py-4 border-t border-surface-100 gap-4">
                <div class="flex items-center gap-2">
                    <span class="text-sm text-surface-500">Rows per page:</span>
                    <Select :model-value="limit" :options="[5, 10, 20, 50]" @update:model-value="setLimit" />
                </div>

                <div class="flex items-center gap-4">
                    <span class="text-sm font-medium text-surface-600">
                        {{ currentPage }} of {{ totalPages }}
                    </span>

                    <div class="flex gap-1">
                        <Button icon="pi pi-chevron-left" text rounded severity="secondary"
                            :disabled="currentPage === 1"
                            class="w-9! h-9! border! border-surface-500! hover:bg-surface-50!" @click="prevPage()" />
                        <Button icon="pi pi-chevron-right" text rounded severity="secondary"
                            :disabled="currentPage === totalPages"
                            class="w-9! h-9! border! border-surface-500! hover:bg-surface-50!" @click="nextPage()" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>