<template>
  <Form @submit="handleSubmit" class="space-y-4">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Email Field -->
      <div class="flex flex-col">
        <label for="email" class="mb-1 text-sm text-gray-600">Email</label>
        <input id="email" v-model="user.email" type="email" @blur="validateField('email')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email" />
        <span v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</span>
      </div>

      <!-- First Name Field -->
      <div class="flex flex-col">
        <label for="firstName" class="mb-1 text-sm text-gray-600">First Name</label>
        <input id="firstName" v-model="user.firstName" type="text" @blur="validateField('firstName')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your first name" />
        <span v-if="firstNameError" class="text-red-500 text-xs mt-1">{{ firstNameError }}</span>
      </div>

      <!-- Last Name Field -->
      <div class="flex flex-col">
        <label for="lastName" class="mb-1 text-sm text-gray-600">Last Name</label>
        <input id="lastName" v-model="user.lastName" type="text" @blur="validateField('lastName')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your last name" />
        <span v-if="lastNameError" class="text-red-500 text-xs mt-1">{{ lastNameError }}</span>
      </div>

      <!-- Phone Number Field -->
      <div class="flex flex-col">
        <label for="phoneNumber" class="mb-1 text-sm text-gray-600">Phone Number</label>
        <input id="phoneNumber" v-model="user.phoneNumber" type="text" @blur="validateField('phoneNumber')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your phone number" />
        <span v-if="phoneNumberError" class="text-red-500 text-xs mt-1">{{ phoneNumberError }}</span>
      </div>

      <!-- Address Field -->
      <div class="flex flex-col">
        <label for="address" class="mb-1 text-sm text-gray-600">Address</label>
        <input id="address" v-model="user.address" type="text" @blur="validateField('address')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your address" />
        <span v-if="addressError" class="text-red-500 text-xs mt-1">{{ addressError }}</span>
      </div>

      <!-- KRA PIN Field -->
      <div class="flex flex-col">
        <label for="kraPin" class="mb-1 text-sm text-gray-600">KRA PIN</label>
        <input id="kraPin" v-model="user.kraPin" type="text" @blur="validateField('kraPin')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your KRA PIN" />
        <span v-if="kraPinError" class="text-red-500 text-xs mt-1">{{ kraPinError }}</span>
      </div>

      <!-- Role Dropdown -->
      <div class="flex flex-col">
        <label for="role" class="mb-1 text-sm text-gray-600">Role</label>
        <select id="role" v-model="user.role" @blur="validateField('role')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option disabled value="">Select your role</option>
          <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.name }}</option>
        </select>
        <span v-if="roleError" class="text-red-500 text-xs mt-1">{{ roleError }}</span>
      </div>

      <!-- Attachment Field -->
      <div class="flex flex-col">
        <label for="attachment" class="mb-1 text-sm text-gray-600">Attachment</label>
        <input id="attachment" type="file"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex items-center gap-4 mt-6">
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Update</button>
    </div>
  </Form>
</template>


<script setup lang="ts">
import { Form } from "vee-validate";
import { reactive, ref, watch } from "vue";
import { IUser } from "../../interfaces/user.interface";

const props = defineProps<{
  user: IUser;
}>();

const emit = defineEmits<{
  (e: 'update', user: IUser): void;
}>();

const user = reactive<IUser>({ ...props.user });

const roles = [
  { name: "Admin", value: "admin" },
  { name: "Project Manager", value: "project_manager" },
  { name: "Engineer", value: "engineer" },
];

// Watch for changes in the user prop
watch(() => props.user, (newUser) => {
  Object.assign(user, newUser);
});

// Error messages for fields
const emailError = ref("");
const firstNameError = ref("");
const lastNameError = ref("");
const phoneNumberError = ref("");
const addressError = ref("");
const kraPinError = ref("");
const roleError = ref("");

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
      addressError.value = validateRequired(user.address);
      break;
    case 'kraPin':
      kraPinError.value = validateKraPin(user.kraPin);
      break;
    case 'role':
      roleError.value = validateRequired(user.role);
      break;
  }
};

const handleSubmit = () => {
  // Validate all fields
  validateField('email');
  validateField('firstName');
  validateField('lastName');
  validateField('phoneNumber');
  validateField('address');
  validateField('kraPin');
  validateField('role');

  // Check if there are any errors
  if (!emailError.value && !firstNameError.value && !lastNameError.value && !phoneNumberError.value && !addressError.value && !kraPinError.value && !roleError.value) {
    emit("update", { ...user }); // Spread operator to emit a plain object
  }
};

// Validation functions
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
  const regex = /^\d{10}$/; // Adjust regex as necessary for your phone number format
  return regex.test(value) ? "" : "Phone number must be 10 digits";
};

const validateKraPin = (value: string) => {
  // KRA PIN validation logic
  return value ? "" : "KRA PIN is required";
};
</script>
