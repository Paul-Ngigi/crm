<template>
  <div class="flex flex-col gap-4">
    <h1 class="font-bold text-lg">Users</h1>

    <div class="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <!-- Search -->
      <Search @search="handleSearch" class="w-72" />

      <!-- Filter -->
      <div class="w-full max-w-xs">
        <label for="roleFilter" class="block text-sm font-medium text-gray-700 mb-1">
          Filter by Role
        </label>
        <select id="roleFilter" v-model="selectedRole" @change="handleRoleFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">All Roles</option>
          <option v-for="role in roles" :key="role.name" :value="role.value">{{ role.name }}</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <UsersTable :users="users" @user-updated="fetchUsers" @user-deleted="fetchUsers" />

    <!-- Pagination -->
    <Pagination :paginationData="pagination" @page-change="handlePageChange" @limit-change="handleLimitChange" />
  </div>
</template>

<script setup lang="ts">
import { IUser } from "interfaces/user.interface";
import { ref } from "vue";
import { useHttpErrorHandler } from '../../api/error-handling';
import { getUsers } from "../../api/users";
import Pagination from '../../components/Partials/Pagination.vue';
import Search from '../../components/Partials/Search.vue';
import UsersTable from '../../components/Users/UsersTable.vue';
import { PaginationData } from "../../interfaces/pagination.interface";

const { processHttpError } = useHttpErrorHandler();

const roles = ref([{ name: "Admin", value: "admin" }, { name: "Project Manager", value: "project_manager" }, { name: "Engineer", value: "engineer" },]);

const users = ref<IUser[]>([]);
const pagination = ref<PaginationData>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
});
const searchQuery = ref<string>("");
const selectedRole = ref<string>("");

const fetchUsers = async () => {
  try {
    const response = await getUsers({
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: searchQuery.value,
        role: selectedRole.value,
      },
    });
    const { data, pagination: paginationResponse } = response.data;
    users.value = data;
    pagination.value = paginationResponse;
  } catch (error) {
    processHttpError(error);
  }
};

// Fetch users on component mount
fetchUsers();

const handleSearch = (query: string) => {
  searchQuery.value = query;
  pagination.value.page = 1;
  fetchUsers();
};

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  fetchUsers();
};

const handleLimitChange = (limit: number) => {
  pagination.value.limit = limit;
  pagination.value.page = 1;
  fetchUsers();
};

const handleRoleFilter = () => {
  pagination.value.page = 1; // Reset to first page on role change
  fetchUsers();
};

</script>
