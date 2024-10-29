<template>
  <Form @submit="handleSubmit" class="space-y-4">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Name Field -->
      <div class="flex flex-col">
        <label for="name" class="mb-1 text-sm text-gray-600">Name</label>
        <input id="name" v-model="project.name" type="text" @blur="validateField('name')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter project name" />
        <span v-if="nameError" class="text-red-500 text-xs mt-1">{{ nameError }}</span>
      </div>

      <!-- Description Field -->
      <div class="flex flex-col">
        <label for="description" class="mb-1 text-sm text-gray-600">Description</label>
        <input id="description" v-model="project.description" type="text" @blur="validateField('description')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter project description" />
        <span v-if="descriptionError" class="text-red-500 text-xs mt-1">{{ descriptionError }}</span>
      </div>

      <!-- Assignee Dropdown -->
      <div class="flex flex-col">
        <label for="assignee" class="mb-1 text-sm text-gray-600">Assignee</label>
        <select id="assignee" v-model="project.assignedTo" @blur="validateField('assignedTo')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option disabled value="">Select a user</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.firstName }} {{ user.lastName }} - {{ user.email }}
          </option>
        </select>
        <span v-if="assignedToError" class="text-red-500 text-xs mt-1">{{ assignedToError }}</span>
      </div>

    </div>

    <!-- Submit Button -->
    <div class="flex items-center gap-4 mt-6">
      <button :disabled="isLoading" type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none">
        {{ isLoading ? 'Loading...' : 'Update' }}
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { Form } from "vee-validate";
import { defineEmits, defineProps, onMounted, reactive, ref, watch } from "vue";
import { useHttpErrorHandler } from "../../api/error-handling";
import { updateProject } from "../../api/lead-interaction";
import { getUsers } from "../../api/users";
import { IProject } from "../../interfaces/project.interface";
import { IUser } from "../../interfaces/user.interface";

const props = defineProps<{
  project: IProject;
}>();


const emit = defineEmits<{
  (e: 'updated'): void;
  (e: 'close'): void;
}>();

const isLoading = ref(false);
const users = ref<IUser[]>([]);

// Reactive project object initialized with prop values
const project = reactive({
  id: props.project?.id || 0,
  name: props.project?.name || "",
  description: props.project?.description || "",
  assignedTo: props.project?.assignedTo || null,
});

watch(
  () => props.project,
  (newproject) => {
    project.id = newproject?.id || "";
    project.name = newproject?.name || "";
    project.description = newproject?.description || "";
    project.assignedTo = newproject?.assignedTo || "";
  },
  { immediate: true }
);

// Fetch users when the component is mounted
const fetchUsers = async () => {
  const { processHttpError } = useHttpErrorHandler();
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

// Validation messages
const nameError = ref("");
const descriptionError = ref("");
const assignedToError = ref("");

// Validation functions
const validateField = (fieldName: string) => {
  switch (fieldName) {
    case 'name':
      nameError.value = validateRequired(project.name);
      break;
    case 'description':
      descriptionError.value = validateRequired(project.description);
      break;
    case 'assignedTo':
      assignedToError.value = validateRequired(project.assignedTo);
      break;
  }
};

const validateRequired = (value: string | null) => {
  return value ? "" : "This field is required";
};

const handleSubmit = async () => {
  // Validate all fields
  validateField('name');
  validateField('description');
  validateField('assignedTo');

  if (!nameError.value && !descriptionError.value && !assignedToError.value) {
    isLoading.value = true; // Set loading to true when starting submission
    const { processHttpError } = useHttpErrorHandler();
    try {
      await updateProject(project.id, { "name": project.name, "description": project.description, "assignedTo": project.assignedTo });
      emit('updated');
    } catch (error) {
      processHttpError(error);
    } finally {
      isLoading.value = false; // Reset loading state
    }
  }
};
</script>
