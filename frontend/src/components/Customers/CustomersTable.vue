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
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b text-gray-500 text-sm">
            Created At: {{ formatDate(customer.createdAt) }}<br />
            Updated At: {{ formatDate(customer.updatedAt) }}
          </td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ customer?.name ?? 'N/A' }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ customer?.companyName ?? 'N/A' }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ customer.email }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ customer.phoneNumber }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ customer.address ?? 'N/A' }}</td>
          <td class="py-2 px-4 border-b text-gray-500">
            <div class="flex items-center gap-3">
              <i @click="showEditModal(customer)" v-if="role === 'admin'" class="fa fa-pencil text-blue-500 cursor-pointer"></i>
              <i @click="showDeleteModal(customer.id)" v-if="role === 'admin'" class="fa fa-trash text-red-500 cursor-pointer"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Vuetify Dialog for Editing Customer -->
    <v-dialog v-model="isEditModalOpen" max-width="800px">
      <v-card class="py-2 px-4">
        <div class="flex justify-between items-center">
          <v-card-title>Edit Project</v-card-title>
          <button @click="closeEditModal">Close</button>
        </div>
        <v-card-text>
          <updateCustomer customer="selectedCustomer" @close="closeEditModal" @update="updateCustomer" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Vuetify Dialog for Deleting Customer -->
    <v-dialog v-model="isDeleteModalOpen" max-width="400px">
      <v-card class="py-2 px-4">
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          <DeleteCustomer :customerId="selectedCustomerId" @close="closeDeleteModal" @deleted="deleteCustomer" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { ICustomer } from "interfaces/customer.interface";
import { defineComponent, PropType, ref } from "vue";
import { getAuthUser } from "../../api/auth";
import DeleteCustomer from "./DeleteCustomer.vue";
import UpdateCustomerFormCopy from "./UpdateCustomerForm copy.vue";


export default defineComponent({
  name: "CustomersTable",
  // eslint-disable-next-line vue/no-unused-components
  components: { UpdateCustomerFormCopy, DeleteCustomer },
  props: {
    customers: {
      type: Array as PropType<ICustomer[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isEditModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const selectedCustomer = ref<ICustomer | null>(null);
    const selectedCustomerId = ref<number | null>(null);

    const role = ref(getAuthUser().role);

    const showEditModal = (customer: ICustomer) => {
      selectedCustomer.value = customer;
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
      selectedCustomer.value = null; // Reset selected customer
    };

    const showDeleteModal = (customerId: number) => {
      selectedCustomerId.value = customerId;
      isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
      selectedCustomerId.value = null; // Reset selected customer ID
    };

    const updateCustomer = (updatedCustomer: ICustomer) => {
      emit('customers-updated', updatedCustomer);
      closeEditModal(); // Close the modal after updating
    };

    const deleteCustomer = (id: string) => {
      console.log("Delete customer with ID:", id);
      emit('customers-deleted', id);
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
      selectedCustomer,
      selectedCustomerId,
      showEditModal,
      closeEditModal,
      showDeleteModal,
      closeDeleteModal,
      updateCustomer,
      deleteCustomer,
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
