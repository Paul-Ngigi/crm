<template>
  <Form @submit="handleSubmit" class="space-y-4">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Email Field -->
      <div class="flex flex-col">
        <label for="email" class="mb-1 text-sm text-gray-600">Email</label>
        <input id="email" v-model="user.email" type="email" @blur="validateField('email')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email" />
        <span v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</span>
      </div>

      <!-- First Name Field -->
      <div class="flex flex-col">
        <label for="firstName" class="mb-1 text-sm text-gray-600">First Name</label>
        <input v-model="user.firstName" id="firstName" type="text"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your first name" @blur="validateField('firstName')" />
        <span v-if="firstNameError" class="text-red-500 text-xs mt-1">{{ firstNameError }}</span>
      </div>

      <!-- Last Name Field -->
      <div class="flex flex-col">
        <label for="lastName" class="mb-1 text-sm text-gray-600">Last Name</label>
        <input v-model="user.lastName" id="lastName" type="text"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your last name" @blur="validateField('lastName')" />
        <span v-if="lastNameError" class="text-red-500 text-xs mt-1">{{ lastNameError }}</span>
      </div>

      <!-- Phone Number Field -->
      <div class="flex flex-col">
        <label for="phoneNumber" class="mb-1 text-sm text-gray-600">Phone Number</label>
        <input v-model="user.phoneNumber" id="phoneNumber" type="text"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your phone number" @blur="validateField('phoneNumber')" />
        <span v-if="phoneNumberError" class="text-red-500 text-xs mt-1">{{ phoneNumberError }}</span>
      </div>

      <!-- Address Field -->
      <div class="flex flex-col">
        <label for="address" class="mb-1 text-sm text-gray-600">Address</label>
        <input v-model="user.address" id="address" type="text"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your address" @blur="validateField('address')" />
        <span v-if="addressError" class="text-red-500 text-xs mt-1">{{ addressError }}</span>
      </div>

      <!-- KRA PIN Field -->
      <div class="flex flex-col">
        <label for="kraPin" class="mb-1 text-sm text-gray-600">KRA PIN</label>
        <input v-model="user.kraPin" id="kraPin" type="text"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your KRA PIN" @blur="validateField('kraPin')" />
        <span v-if="kraPinError" class="text-red-500 text-xs mt-1">{{ kraPinError }}</span>
      </div>

      <!-- Roles Dropdown -->
      <div class="flex flex-col">
        <label for="role" class="mb-1 text-sm text-gray-600">Role</label>
        <select v-model="user.role" id="role"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option disabled value="">Select a role</option>
          <option v-for="role in roles" :key="role.value" :value="role.value">
            {{ role.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Submit Button -->
    <button type="submit" class="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600" :disabled="loading">
      <template v-if="loading">Loading...</template>
      <template v-else>Update</template>
    </button>
  </Form>
</template>

<script setup lang="ts">
import { Form } from "vee-validate";
import { defineProps, reactive, ref, watch } from "vue";
import { useHttpErrorHandler } from "../../api/error-handling";
import { updateUser } from "../../api/users";

// Define props
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const loading = ref(false);

const emit = defineEmits<{
  (e: 'updated'): void;
  (e: 'close'): void;
}>();


// Reactive user object, prepopulated with data from props
const user = reactive({ ...props.user });

// Error messages for fields
const emailError = ref("");
const firstNameError = ref("");
const lastNameError = ref("");
const phoneNumberError = ref("");
const addressError = ref("");
const kraPinError = ref("");

// Validation functions
const validateField = (fieldName: string) => {
  switch (fieldName) {
    case 'email':
      emailError.value = validateEmail(user.email);
      break;
    case 'firstName':
      firstNameError.value = validateRequired(user.firstName);
      break;
    case 'lastName':
      lastNameError.value = validateRequired(user.lastName);
      break;
    case 'phoneNumber':
      phoneNumberError.value = validatePhoneNumber(user.phoneNumber);
      break;
    case 'address':
      addressError.value = validateOptional(user.address);
      break;
    case 'kraPin':
      kraPinError.value = validateOptional(user.kraPin);
      break;
  }
};

const roles = [
  { name: "Admin", value: "admin" },
  { name: "Project Manager", value: "project_manager" },
  { name: "Engineer", value: "engineer" },
];

const handleSubmit = async () => {
  // Validate all fields
  validateField('email');
  validateField('firstName');
  validateField('lastName');
  validateField('phoneNumber');
  validateField('address');
  validateField('kraPin');

  // Check for any errors
  if (!emailError.value && !firstNameError.value && !lastNameError.value && !phoneNumberError.value) {
    loading.value = true; // Set loading to true when starting submission
    const { processHttpError } = useHttpErrorHandler();

    try {
      await updateUser(user.id, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        kraPin: user.kraPin,
      });
      emit('updated');
    } catch (error) {
      processHttpError(error);
    } finally {
      loading.value = false; // Reset loading state
    }
  }
};

// Validation helper functions
const validateEmail = (value: string) => {
  if (!value) return "Email is required";
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return regex.test(value) ? "" : "Email must be valid";
};

const validateRequired = (value: string) => {
  return value ? "" : "This field is required";
};

const validatePhoneNumber = (value: string) => {
  if (!value) return "Phone number is required";
  const regex = /^(?:\+254|0)?[7-9][0-9]{8}$/;
  return regex.test(value) ? "" : "Phone number must be valid";
};

const validateOptional = (value: string) => {
  return "";
};

// Watch user data if needed for dynamic updates
watch(user, (newUser) => {
  // Perform any necessary actions on user data change
}, { deep: true });
</script>
