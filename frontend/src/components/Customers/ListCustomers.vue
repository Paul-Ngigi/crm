<template>
  <div class="flex flex-col gap-4">
    <h1 class="font-bold text-lg">Customers</h1>

    <div class="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <!-- Search -->
      <Search @search="handleSearch" class="w-72" />

      <button @click="addCustomer" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Customer
      </button>
    </div>

    <!-- Table -->
    <CustomersTable :customers="customers" @customers-updated="fetchCustomers" @customers-deleted="fetchCustomers" />

    <!-- Pagination -->
    <Pagination :paginationData="pagination" @page-change="handlePageChange" @limit-change="handleLimitChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getCustomers } from "../../api/customers";
import { useHttpErrorHandler } from "../../api/error-handling";
import Pagination from '../../components/Partials/Pagination.vue';
import Search from '../../components/Partials/Search.vue';
import { ICustomer } from "../../interfaces/customer.interface";
import { PaginationData } from "../../interfaces/pagination.interface";
import CustomersTable from "./CustomersTable.vue";

const { processHttpError } = useHttpErrorHandler();

const customers = ref<ICustomer[]>([]);
const pagination = ref<PaginationData>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
});
const searchQuery = ref<string>("");

const fetchCustomers = async () => {
  try {
    const response = await getCustomers({
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: searchQuery.value,
      },
    });
    const { data, pagination: paginationResponse } = response.data;
    customers.value = data;
    pagination.value = paginationResponse;
  } catch (error) {
    processHttpError(error);
  }
};

// Fetch customers on component mount
fetchCustomers();

const addCustomer = () => { }

const handleSearch = (query: string) => {
  searchQuery.value = query;
  pagination.value.page = 1;
  fetchCustomers();
};

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  fetchCustomers();
};

const handleLimitChange = (limit: number) => {
  pagination.value.limit = limit;
  pagination.value.page = 1;
  fetchCustomers();
};


</script>
