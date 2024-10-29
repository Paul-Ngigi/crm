<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
      <thead>
        <tr class="bg-gray-100 text-gray-600">
          <th class="py-2 px-4 border-b">Date</th>
          <th class="py-2 px-4 border-b">Name</th>
          <th class="py-2 px-4 border-b">Company Name</th>
          <th class="py-2 px-4 border-b">Email</th>
          <th class="py-2 px-4 border-b">Phone Number</th>
          <th class="py-2 px-4 border-b">Address</th>
          <th class="py-2 px-4 border-b">Status</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lead in leads" :key="lead.id" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b text-gray-500 text-sm">
            Created At: {{ formatDate(lead.createdAt) }}<br />
            Updated At: {{ formatDate(lead.updatedAt) }}
          </td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ lead?.name ?? 'N/A' }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ lead?.companyName ?? 'N/A' }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ lead.email }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ lead.phoneNumber }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ lead.address ?? 'N/A' }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ lead.status ?? 'N/A' }}</td>
          <td class="py-2 px-4 border-b text-gray-500">
            <div class="flex items-center gap-3">
              <i @click="showEditModal(lead)" class="fa fa-pencil text-blue-500 cursor-pointer"></i>
              <i @click="showDeleteModal(lead.id)" class="fa fa-trash text-red-500 cursor-pointer"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Vuetify Dialog for Editing lead -->
    <v-dialog v-model="isEditModalOpen" max-width="800px">
      <v-card class="py-2 px-4">
        <div class="flex justify-between items-center">
          <v-card-title>Edit Lead</v-card-title>
          <button @click="closeEditModal">Close</button>
        </div>
        <v-card-text>
          <UpdateLeadForm :lead="selectedLead" @close="closeEditModal" @updated="updateLead" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Vuetify Dialog for Deleting lead -->
    <v-dialog v-model="isDeleteModalOpen" max-width="400px">
      <v-card class="py-2 px-4">
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          <DeleteLead :leadId="selectedLeadId" @close="closeDeleteModal" @deleted="deleteLead" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { ILead } from "../../interfaces/lead.interface";
import DeleteLead from "./DeleteLead.vue";
import UpdateLeadForm from "./UpdateLeadForm.vue";


export default defineComponent({
  name: "LeadsTable",
  // eslint-disable-next-line vue/no-unused-components
  components: { UpdateLeadForm, DeleteLead },
  props: {
    leads: {
      type: Array as PropType<ILead[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isEditModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const selectedLead = ref<ILead | null>(null);
    const selectedLeadId = ref<number>(0);

    const showEditModal = (lead: ILead) => {
      selectedLead.value = lead;
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
      selectedLead.value = null; // Reset selected lead
    };

    const showDeleteModal = (leadId: number) => {
      selectedLeadId.value = leadId;
      isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
      selectedLeadId.value = 0; // Reset selected lead ID
    };

    const updateLead = (updatedLead: ILead) => {
      emit('lead-updated', updatedLead);
      closeEditModal();
    };

    const deleteLead = (id: string) => {
      console.log("Delete Lead with ID:", id);
      emit('lead-deleted', id);
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
      selectedLead,
      selectedLeadId,
      showEditModal,
      closeEditModal,
      showDeleteModal,
      closeDeleteModal,
      updateLead,
      deleteLead,
      formatDate,
    };
  },
});
</script>

<style scoped>
.v-icon {
  cursor: pointer;
}
</style>
