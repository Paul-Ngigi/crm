<template>
  <div class="flex flex-col gap-4">
    <h1 class="font-bold text-lg">Leads</h1>

    <div class="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <!-- Search -->
      <Search @search="handleSearch" class="w-72" />

      <button @click="showAddModal" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Lead
      </button>
    </div>

    <v-dialog v-model="isAddModalOpen" max-width="800px">
      <v-card class="py-2 px-4">
        <div class="flex justify-between items-center">
          <v-card-title>Add Lead</v-card-title>
          <button @click="closeAddModal">Close</button>
        </div>
        <v-card-text>
          <AddLeadModal @close="closeAddModal" @updated="updateLead" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Table -->
    <LeadsTable :leads="leads" @lead-updated="fetchLeads" @lead-deleted="fetchLeads" />

    <!-- Pagination -->
    <Pagination :paginationData="pagination" @page-change="handlePageChange" @limit-change="handleLimitChange" />

    <!-- Add Lead Modal -->
    <AddLeadModal v-if="showAddLeadModal" @close="closeAddLeadModal" />
  </div>
</template>

<script setup lang="ts">
import { ILead } from "interfaces/lead.interface";
import { ref } from "vue";
import { useHttpErrorHandler } from "../../api/error-handling";
import { getLeads } from "../../api/leads";
import Pagination from '../../components/Partials/Pagination.vue';
import Search from '../../components/Partials/Search.vue';
import { PaginationData } from "../../interfaces/pagination.interface";
import AddLeadModal from './AddLeadForm.vue';
import LeadsTable from "./LeadsTable.vue";

const { processHttpError } = useHttpErrorHandler();

const isAddModalOpen = ref(false);

const leads = ref<ILead[]>([]);
const pagination = ref<PaginationData>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
});
const searchQuery = ref<string>("");
const selectedRole = ref<string>("");
const showAddLeadModal = ref(false);  // Control modal visibility

const showAddModal = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
  fetchLeads();
};

const updateLead = () => {
  fetchLeads()
};

const fetchLeads = async () => {
  try {
    const response = await getLeads({
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: searchQuery.value,
        role: selectedRole.value,
      },
    });
    const { data, pagination: paginationResponse } = response.data;
    leads.value = data;
    pagination.value = paginationResponse;
  } catch (error) {
    processHttpError(error);
  }
};

// Fetch leads on component mount
fetchLeads();



// Close Add Lead Modal
const closeAddLeadModal = () => {
  showAddLeadModal.value = false;
  fetchLeads();  // Fetch updated leads after closing modal
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
  pagination.value.page = 1;
  fetchLeads();
};

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  fetchLeads();
};

const handleLimitChange = (limit: number) => {
  pagination.value.limit = limit;
  pagination.value.page = 1;
  fetchLeads();
};

</script>
