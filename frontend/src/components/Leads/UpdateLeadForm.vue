<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <Form @submit="handleSubmit" class="space-y-4">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Email Field -->
      <div class="flex flex-col">
        <label for="email" class="mb-1 text-sm text-gray-600">Email</label>
        <input id="email" v-model="lead.email" type="email" @blur="validateField('email')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email" />
        <span v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</span>
      </div>

      <!-- Name Field -->
      <div class="flex flex-col">
        <label for="name" class="mb-1 text-sm text-gray-600">Name</label>
        <input id="name" v-model="lead.name" type="text" @blur="validateField('name')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter name" />
        <span v-if="nameError" class="text-red-500 text-xs mt-1">{{ nameError }}</span>
      </div>

      <!-- Phone Number Field -->
      <div class="flex flex-col">
        <label for="phoneNumber" class="mb-1 text-sm text-gray-600">Phone Number</label>
        <input id="phoneNumber" v-model="lead.phoneNumber" type="text" @blur="validateField('phoneNumber')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter phone number" />
        <span v-if="phoneNumberError" class="text-red-500 text-xs mt-1">{{ phoneNumberError }}</span>
      </div>

      <!-- Status Dropdown -->
      <div class="flex flex-col">
        <label for="status" class="mb-1 text-sm text-gray-600">Status</label>
        <select id="status" v-model="lead.status" @blur="validateField('status')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option disabled value="">Select status</option>
          <option v-for="status in leadStatuses" :key="status.value" :value="status.value">{{ status.name }}</option>
        </select>
        <span v-if="statusError" class="text-red-500 text-xs mt-1">{{ statusError }}</span>
      </div>

      <!-- Address Field (optional) -->
      <div class="flex flex-col">
        <label for="address" class="mb-1 text-sm text-gray-600">Address</label>
        <input id="address" v-model="lead.address" type="text" @blur="validateField('address')"
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter address" />
        <span v-if="addressError" class="text-red-500 text-xs mt-1">{{ addressError }}</span>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex items-center gap-4 mt-6">
      <button :disabled="loading" type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"> {{ loading ? 'Loading...' : 'Update' }}</button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ILead } from "interfaces/lead.interface";
import { Form } from "vee-validate";
import { defineEmits, defineProps, reactive, ref, watch } from "vue";
import { useHttpErrorHandler } from "../../api/error-handling";
import { updateLead } from "../../api/leads";

// Define props for lead
const props = defineProps<{
  lead: ILead;
}>();

const emit = defineEmits<{
  (e: 'updated'): void;
  (e: 'close'): void;
}>();

const loading = ref(false);

// Reactive lead object, initialized with props values if provided
const lead = reactive({
  id: props.lead?.id,
  email: props.lead?.email || "",
  name: props.lead?.name || "",
  phoneNumber: props.lead?.phoneNumber || "",
  status: props.lead?.status || '',
  address: props.lead?.address || "",
});

const leadStatuses = [
  { name: "New", value: 'new' },
  { name: "Contacted", value: 'contacted' },
  { name: "Qualified", value: 'qualified' },
  { name: "Converted", value: 'converted' },
];

// Watch props.lead for updates to dynamically update the form fields if the lead prop changes
watch(
  () => props.lead,
  (newLead) => {
    lead.id = newLead?.id;
    lead.email = newLead?.email || "";
    lead.name = newLead?.name || "";
    lead.phoneNumber = newLead?.phoneNumber || "";
    lead.status = newLead?.status || "";
    lead.address = newLead?.address || "";
  },
  { immediate: true }
);

// Error messages for fields
const emailError = ref("");
const nameError = ref("");
const phoneNumberError = ref("");
const statusError = ref("");
const addressError = ref("");

// Validation functions
const validateField = (fieldName: string) => {
  switch (fieldName) {
    case 'email':
      emailError.value = validateEmail(lead.email);
      break;
    case 'name':
      nameError.value = validateRequired(lead.name);
      break;
    case 'phoneNumber':
      phoneNumberError.value = validatePhoneNumber(lead.phoneNumber);
      break;
    case 'status':
      statusError.value = validateRequired(lead.status);
      break;
    case 'address':
      addressError.value = validateOptional(lead.address);
      break;
  }
};

const handleSubmit = async () => {
  // Validate all fields
  validateField('email');
  validateField('name');
  validateField('phoneNumber');
  validateField('status');
  validateField('address');

  const { processHttpError } = useHttpErrorHandler();
  const loading = ref(false); // Define loading state

  // Check for any errors
  if (!emailError.value && !nameError.value && !phoneNumberError.value && !statusError.value) {
    loading.value = true; // Set loading to true when starting deletion
    try {
      await updateLead(lead.id, {
        email: lead.email,
        name: lead.name,
        phoneNumber: lead.phoneNumber,
        status: lead.status,
        address: lead.address,
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
</script>
