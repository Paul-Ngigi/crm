<template>
  <div class="flex flex-col gap-4">
    <h1 class="font-bold text-lg">Projects</h1>

    <div class="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <!-- Search -->
      <Search @search="handleSearch" class="w-72" />

      <button v-if="role === 'admin'" @click="navigateToAddProject" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Project
      </button>
    </div>


    <v-dialog v-model="isAddModalOpen" max-width="800px">
      <v-card class="py-2 px-4">
        <div class="flex justify-between items-center">
          <v-card-title>Add Project</v-card-title>
          <button @click="closeAddModal">Close</button>
        </div>
        <v-card-text>
          <AddProjectForm @close="closeAddModal" @update="updateProject" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Table -->
    <ProjectsTable :projects="projects" @project-updated="fetchProjects" @project-deleted="fetchProjects" />

    <!-- Pagination -->
    <Pagination :paginationData="pagination" @page-change="handlePageChange" @limit-change="handleLimitChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useHttpErrorHandler } from "../../api/error-handling";
import { getProjects } from "../../api/projects";
import Pagination from '../../components/Partials/Pagination.vue';
import Search from '../../components/Partials/Search.vue';
import { PaginationData } from "../../interfaces/pagination.interface";
import { IProject } from "../../interfaces/project.interface";
import ProjectsTable from "./ProjectsTable.vue";
import AddProjectForm from "./AddProjectForm.vue";

const { processHttpError } = useHttpErrorHandler();

const isAddModalOpen = ref(false);
const showAddProjectModal = ref(false)

import { useRouter } from 'vue-router';
import { getAuthUser } from "../../api/auth";

const router = useRouter();

const role = getAuthUser().role;


const navigateToAddProject = () => {
  router.push('/add-project');
};

const projects = ref<IProject[]>([]);
const pagination = ref<PaginationData>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
});
const searchQuery = ref<string>("");
const selectedRole = ref<string>("");

const fetchProjects = async () => {
  try {
    const response = await getProjects({
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: searchQuery.value,
        role: selectedRole.value,
      },
    });
    const { data, pagination: paginationResponse } = response.data;
    projects.value = data;
    pagination.value = paginationResponse;
  } catch (error) {
    processHttpError(error);
  }
};

// Fetch projects on component mount
fetchProjects();

const showAddModal = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
  fetchProjects();
};

const updateProject = () => {
  fetchProjects()
};


const closeAddProjectModal = () => {
  showAddProjectModal.value = false;
  fetchProjects();  // Fetch updated leads after closing modal
};
const handleSearch = (query: string) => {
  searchQuery.value = query;
  pagination.value.page = 1;
  fetchProjects();
};

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  fetchProjects();
};

const handleLimitChange = (limit: number) => {
  pagination.value.limit = limit;
  pagination.value.page = 1;
  fetchProjects();
};


</script>
