<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <Form @submit="handleSubmit" class="space-y-4">
    <!-- Name Field -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-600">Name</label>
      <Field name="name" :rules="validateRequired" v-slot="{ field, errors }">
        <input v-bind="field" id="name" type="text"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter project name" required />
        <span v-if="errors.length" class="text-red-500 text-sm mt-1">{{ errors[0] }}</span>
      </Field>
    </div>

    <!-- Description Field -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-600">Description</label>
      <Field name="description" :rules="validateRequired" v-slot="{ field, errors }">
        <input v-bind="field" id="description" type="text"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter project description" required />
        <span v-if="errors.length" class="text-red-500 text-sm mt-1">{{ errors[0] }}</span>
      </Field>
    </div>

    <!-- Assignee Dropdown -->
    <div>
      <label for="assignee" class="block text-sm font-medium text-gray-600">Assignee</label>
      <Field name="assignedTo" :rules="validateRequired" v-slot="{ field, errors }">
        <select v-bind="field" id="assignee"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required>
          <option disabled value="">Select a user</option>
          <option v-for="user in users" :key="user.id" :value="user">
            {{ user.firstName }} {{ user.lastName }} - {{ user.email }}
          </option>
        </select>
        <span v-if="errors.length" class="text-red-500 text-sm mt-1">{{ errors[0] }}</span>
      </Field>
    </div>

    <!-- Submit Button -->
    <div class="flex items-center gap-4 mt-6">
      <button type="submit" :disabled="isLoading"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
        <template v-if="isLoading">Loading...</template>
        <template v-else>Add</template>
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { IProject } from "../../interfaces/project.interface";
import { IUser } from "../../interfaces/user.interface";
import { Field, Form } from "vee-validate";
import { onMounted, reactive, ref } from "vue";
import { getUsers } from "../../api/users";
import { createProject } from "../../api/projects";
import { useToast } from "vue-toastification";
import { useHttpErrorHandler } from "../../api/error-handling";
import { useRouter } from "vue-router";

const { processHttpError } = useHttpErrorHandler();
const router = useRouter();
const toast = useToast();

const isLoading = ref(false);
const users = ref<IUser[]>([]);

// Reactive project object
const project = reactive<IProject>({
  name: "",
  description: "",
  assignedTo: null,
});

// Fetch users when the component is mounted
const fetchUsers = async () => {
  try {
    const response = await getUsers({
      params: {
        page: 1,
        limit: 100,
        role: 'engineer',
      },
    });
    users.value = response.data.data;
  } catch (error) {
    processHttpError(error);
  }
};

onMounted(() => {
  fetchUsers();
});

// Validation helper function
const validateRequired = (value: string | null) => {
  return value ? true : "This field is required";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSubmit = async (values: any) => {
  isLoading.value = true;
  try {
    await createProject(values);
    toast.success('Project created successfully!');
    router.push('/projects')
  } catch (error) {
    processHttpError(error);
  } finally {
    isLoading.value = false;
  }
};
</script>
