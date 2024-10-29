<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
      <h2 class="text-2xl font-semibold text-center mb-6">Register</h2>
      <Form @submit="onSubmit" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
            <Field name="email" type="email" :rules="validateEmail" v-slot="{ field, errors }">
              <input v-bind="field" id="email" type="email"
                class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email" required />
              <span v-if="errors.length" class="text-red-500 text-sm mt-1">{{ errors[0] }}</span>
            </Field>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
            <Field name="authToken" type="password" :rules="validatePassword" v-slot="{ field, errors }">
              <input v-bind="field" id="password" type="password"
                class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password" required />
              <span v-if="errors.length" class="text-red-500 text-sm mt-1">{{ errors[0] }}</span>
            </Field>
          </div>

          <!-- First Name Field -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-600">First Name</label>
            <Field name="firstName" :rules="validateRequired" v-slot="{ field, errors }">
              <input v-bind="field" id="firstName" type="text"
                class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name" required />
              <span v-if="errors.length" class="text-red-500 text-sm mt-1">{{ errors[0] }}</span>
            </Field>
          </div>

          <!-- Last Name Field -->
          <Field name="lastName" type="text" :rules="validateRequired" v-slot="{ field, errors }">
            <div class="flex flex-col">
              <label for="lastName" class="mb-1 text-sm text-gray-600">Last Name</label>
              <input id="lastName" v-bind="field" class="input" placeholder="Enter your last name" />
              <span v-if="errors.length" class="text-red-500 text-xs mt-1">{{ errors[0] }}</span>
            </div>
          </Field>

          <!-- Phone Number Field -->
          <Field name="phoneNumber" type="text" :rules="validatePhoneNumber" v-slot="{ field, errors }">
            <div class="flex flex-col">
              <label for="phoneNumber" class="mb-1 text-sm text-gray-600">Phone Number</label>
              <input id="phoneNumber" v-bind="field" class="input" placeholder="Enter your phone number" />
              <span v-if="errors.length" class="text-red-500 text-xs mt-1">{{ errors[0] }}</span>
            </div>
          </Field>

          <!-- Address Field -->
          <Field name="address" type="text" :rules="validateRequired" v-slot="{ field, errors }">
            <div class="flex flex-col">
              <label for="address" class="mb-1 text-sm text-gray-600">Address</label>
              <input id="address" v-bind="field" class="input" placeholder="Enter your address" />
              <span v-if="errors.length" class="text-red-500 text-xs mt-1">{{ errors[0] }}</span>
            </div>
          </Field>

          <!-- KRA PIN Field -->
          <Field name="kraPin" type="text" :rules="validateKraPin" v-slot="{ field, errors }">
            <div class="flex flex-col">
              <label for="kraPin" class="mb-1 text-sm text-gray-600">KRA PIN</label>
              <input id="kraPin" v-bind="field" class="input" placeholder="Enter your KRA PIN" />
              <span v-if="errors.length" class="text-red-500 text-xs mt-1">{{ errors[0] }}</span>
            </div>
          </Field>

          <!-- Attachment Field -->
          <Field name="attachment" v-slot="{ field, errors }">
            <div class="flex flex-col">
              <label for="attachment" class="mb-1 text-sm text-gray-600">Attachment</label>
              <input id="attachment" v-bind="field" type="file" class="input" @change="onFileChange" />
              <span v-if="errors.length" class="text-red-500 text-xs mt-1">{{ errors[0] }}</span>
            </div>
          </Field>

          <!-- Roles Dropdown -->
          <div>
            <Field name="role" :rules="validateRequired" v-slot="{ field, errors }">
              <label for="role" class="block text-sm font-medium text-gray-600">Role</label>
              <select v-bind="field" id="role"
                class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                <option disabled value="">Select a role</option>
                <option v-for="role in roles" :key="role.name" :value="role.value">
                  {{ role.name }}
                </option>
              </select>
              <span v-if="errors.length" class="text-red-500 text-sm mt-1">{{ errors[0] }}</span>
            </Field>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600"
          :disabled="isLoading">
          <template v-if="isLoading">Loading...</template>
          <template v-else>Register</template>
        </button>
      </Form>
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Already have an account? <RouterLink to="/auth/login" class="text-blue-500 hover:underline">Login</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field, Form } from "vee-validate";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { registerUser, uploadAttachment } from "../../api/auth";
import { useHttpErrorHandler } from "../../api/error-handling";

// Error handling utility
const { processHttpError } = useHttpErrorHandler();

const toast = useToast(); // Create a toast instance
const router = useRouter(); // Get the router instance


const isLoading = ref(false);


// Role options for the dropdown
const roles = [
  { name: "Admin", value: "admin" },
  { name: "Project Manager", value: "project_manager" },
  { name: "Engineer", value: "engineer" },
];

const fileResponse = ref<{ fileName: string } | null>(null);

// Upload file function with improved type safety
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await uploadAttachment(formData);
    fileResponse.value = response.data.data.filename; // Store the file response
    return response.data;
  } catch (error) {
    processHttpError(error); // Handle HTTP errors
  }
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    const file = files[0];
    uploadFile(file);
  }
};

// Submit handler with additional type safety
const onSubmit = async (values: Record<string, any>) => {
  isLoading.value = true;
  try {
    const registerData = {
      ...values,
      attachment: fileResponse?.value?.fileName ?? null
    };

    await registerUser(registerData);
    toast.success('Success')
    router.push('/auth/login');
  } catch (error) {
    processHttpError(error)
  } finally {
    isLoading.value = false;
  }
};

// Validation functions
const validateEmail = (value: string) => {
  if (!value) return "Email is required";
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return regex.test(value) ? true : "Email must be valid";
};

const validatePassword = (value: string) => {
  if (!value) return "Password is required";
  return value.length >= 6 ? true : "Password must be at least 6 characters";
};

const validatePhoneNumber = (value: string) => {
  if (!value) return "Phone number is required";
  const regex = /^(?:\+254|0)?[7-9][0-9]{8}$/;
  return regex.test(value) ? true : "Phone number must be valid";
};

const validateKraPin = (value: string) => {
  if (!value) return "KRA PIN is required";
  const regex = /^[A-Z0-9]{10}$/; // Adjust according to actual KRA PIN format
  return regex.test(value) ? true : "KRA PIN must be valid";
};

const validateRequired = (value: string) => {
  return value ? true : "This field is required";
};
</script>

<style scoped>
.input {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>
