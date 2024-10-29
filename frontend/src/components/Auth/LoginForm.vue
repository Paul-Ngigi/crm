<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { IUser } from "interfaces/user.interface";
import { Field, Form } from "vee-validate";
import { ref } from 'vue'; // Import ref to create reactive state
import { RouterLink, useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { loginUser, UserData } from '../../api/auth';
import { useHttpErrorHandler } from "../../api/error-handling";


const { processHttpError } = useHttpErrorHandler();

const toast = useToast(); // Create a toast instance
const router = useRouter(); // Get the router instance

// Reactive variable to manage loading state
const isLoading = ref(false);

const onSubmit = async (values: UserData) => {
  isLoading.value = true;
  try {
    const response = await loginUser(values);
    const user: IUser = response.data?.data;

    const token = user.token;
    const authUser: any = user;

    delete authUser.token;

    toast.success(`Welcome ${user.firstName}`);
    sessionStorage.setItem('user', JSON.stringify(authUser))
    sessionStorage.setItem('token', JSON.stringify(token))
    router.push('/');
  } catch (error: any) {
    processHttpError(error);
  } finally {
    isLoading.value = false;
  }
};

const validateEmail = (value: string) => {
  if (!value) {
    return "Email is required";
  }
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(value)) {
    return "Enter a valid email";
  }
  return true;
};

const validatePassword = (value: string) => {
  if (!value) {
    return "Password is required";
  }
  if (value.length < 6) {
    return "Password must be at least 6 characters";
  }
  return true;
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
      <Form @submit="onSubmit" class="space-y-4">
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

        <!-- Submit Button and Register Link -->
        <div class="flex flex-col items-center mt-6 space-y-2 md:space-y-0 md:flex-row md:justify-between">
          <button type="submit" :disabled="isLoading"
            class="w-full md:w-auto px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <template v-if="isLoading">Loading...</template>
            <template v-else>Login</template>
          </button>
          <div class="text-sm text-gray-600 mt-2">
            Don’t have an account?
            <RouterLink to="/auth/register" class="text-blue-500 hover:underline">Register</RouterLink>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>
