<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
      <thead>
        <tr class="bg-gray-100 text-gray-600">
          <th class="py-2 px-4 border-b">Date</th>
          <th class="py-2 px-4 border-b">User</th>
          <th class="py-2 px-4 border-b">KRA Pin</th>
          <th class="py-2 px-4 border-b">Role</th>
          <th class="py-2 px-4 border-b">Attachment</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b text-gray-500 text-sm">
            Created At: {{ formatDate(user.createdAt) }}<br />
            Updated At: {{ formatDate(user.updatedAt) }}
          </td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">
            <div><span class="font-medium">Full Name: </span>{{ user.firstName }} {{ user.lastName }}</div>
            <div><span class="font-medium">Email: </span>{{ user.email }}</div>
            <div><span class="font-medium">Phone Number: </span>{{ user.phoneNumber }}</div>
          </td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ user.kraPin }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">{{ user.role }}</td>
          <td class="py-2 px-4 border-b text-gray-500 text-sm">
            <a :href="user.attachment" target="_blank" class="text-blue-600 hover:underline">View Attachment</a>
          </td>
          <td class="py-2 px-4 border-b text-gray-500">
            <div class="flex items-center gap-3">
              <i @click="showEditModal(user)" v-if="role === 'admin'"
                class="fa fa-pencil text-blue-500 cursor-pointer"></i>
              <i @click="showDeleteModal(user.id)" v-if="role === 'admin'"
                class="fa fa-trash text-red-500 cursor-pointer"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Vuetify Dialog for Editing User -->
    <v-dialog v-model="isEditModalOpen" max-width="800px">
      <v-card class="py-2 px-4">
        <div class="flex justify-between items-center">
          <v-card-title>Edit User</v-card-title>
          <button @click="closeEditModal">Close</button>
        </div>
        <v-card-text>
          <UpdateUser :user="selectedUser" @close="closeEditModal" @updated="updateUser" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Vuetify Dialog for Deleting User -->
    <v-dialog v-model="isDeleteModalOpen" max-width="400px">
      <v-card class="py-2 px-4">
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          <DeleteUsers :userId="selectedUserId" @close="closeDeleteModal" @deleted="deleteUser" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { IUser } from "../../interfaces/user.interface";
import DeleteUsers from "./DeleteUsers.vue";
import UpdateUser from "./UpdateUserForm.vue";
import { getAuthUser } from "../../api/auth";


export default defineComponent({
  name: "UsersTable",
  components: { UpdateUser, DeleteUsers },
  props: {
    users: {
      type: Array as PropType<IUser[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isEditModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const selectedUser = ref<IUser | null>(null);
    const selectedUserId = ref<number | null>(null);

    const role = ref(getAuthUser().role);

    const showEditModal = (user: IUser) => {
      selectedUser.value = user;
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
      selectedUser.value = null; // Reset selected user
    };

    const showDeleteModal = (userId: number) => {
      selectedUserId.value = userId;
      isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
      selectedUserId.value = null; // Reset selected user ID
    };

    const updateUser = (updatedUser: IUser) => {
      console.log("Updated user data:", updatedUser);
      emit('user-updated', updatedUser);
      closeEditModal(); // Close the modal after updating
    };

    const deleteUser = (id: string) => {
      console.log("Delete user with ID:", id);
      emit('user-deleted', id);
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
      selectedUser,
      selectedUserId,
      role,
      showEditModal,
      closeEditModal,
      showDeleteModal,
      closeDeleteModal,
      updateUser,
      deleteUser,
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
