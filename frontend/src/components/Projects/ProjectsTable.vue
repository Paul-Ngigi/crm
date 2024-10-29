<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { getAuthUser } from "../../api/auth";
import { IProject } from "../../interfaces/project.interface";
import DeleteProject from "./DeleteProject.vue";
import UpdateProjectForm from "./UpdateProjectForm.vue";

export default defineComponent({
  name: "ProjectsTable",
  components: { UpdateProjectForm, DeleteProject },
  props: {
    projects: {
      type: Array as PropType<IProject[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isEditModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const selectedProject = ref<IProject | null>(null);
    const selectedProjectId = ref<number | null>(null);

    // Get user role from auth API
    const role = ref(getAuthUser().role);

    const showEditModal = (project: IProject) => {
      selectedProject.value = project;
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
      selectedProject.value = null; // Reset selected project
    };

    const showDeleteModal = (projectId: number) => {
      selectedProjectId.value = projectId;
      isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
      selectedProjectId.value = null; // Reset selected project ID
    };

    const updateProject = (updatedProject: IProject) => {
      emit('project-updated', updatedProject);
      closeEditModal(); // Close the modal after updating
    };

    const deleteProject = (id: string) => {
      console.log("Delete project with ID:", id);
      emit('project-deleted', id);
      closeDeleteModal(); // Close the modal after deletion
    };

    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return {
      isEditModalOpen,
      isDeleteModalOpen,
      selectedProject,
      selectedProjectId,
      role,
      showEditModal,
      closeEditModal,
      showDeleteModal,
      closeDeleteModal,
      updateProject,
      deleteProject,
      formatDate,
    };
  },
});
</script>



<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
      <thead>
        <tr class="bg-gray-100 text-gray-600">
          <th class="py-2 px-4 border-b">Date</th>
          <th class="py-2 px-4 border-b">Name</th>
          <th class="py-2 px-4 border-b">Description</th>
          <th class="py-2 px-4 border-b">Engineer</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b text-gray-500 text-sm">
            Created At: {{ formatDate(project.createdAt) }}<br />
            Updated At: {{ formatDate(project.updatedAt) }}
          </td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ project.name }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ project.description }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">
            <div>
              <span class="font-medium">Full Name: </span>{{ project.assignedTo.firstName }} {{
                project.assignedTo.lastName }}
            </div>
            <div><span class="font-medium">Email: </span>{{ project.assignedTo.email }}</div>
            <div><span class="font-medium">Phone Number: </span>{{ project.assignedTo.phoneNumber }}</div>
          </td>
          <td class="py-2 px-4 border-b text-gray-500">
            <div class="flex items-center gap-3">
              <i @click="showEditModal(project)" v-if="role === 'admin' || role === 'project_manager'"
                class="fa fa-pencil text-blue-500 cursor-pointer" aria-label="Edit Project"></i>
              <i @click="showDeleteModal(project.id)" v-if="role === 'admin'"
                class="fa fa-trash text-red-500 cursor-pointer" aria-label="Delete Project"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Vuetify Dialog for Editing Project -->
    <v-dialog v-model="isEditModalOpen" max-width="800px">
      <v-card class="py-2 px-4">
        <div class="flex justify-between items-center">
          <v-card-title>Edit Project</v-card-title>
          <button @click="closeEditModal">Close</button>
        </div>
        <v-card-text>
          <UpdateProjectForm :project="selectedProject" @close="closeEditModal" @updated="updateProject" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Vuetify Dialog for Deleting Project -->
    <v-dialog v-model="isDeleteModalOpen" max-width="400px">
      <v-card class="py-2 px-4">
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          <DeleteProject :projectId="selectedProjectId" @close="closeDeleteModal" @deleted="deleteProject" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
