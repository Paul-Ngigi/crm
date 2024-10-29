<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" app>
      <v-list>
        <v-list-item v-for="item in filteredItems" :key="item.title" @click="navigateTo(item.route)" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logOut()" link>
          <v-list-item-icon>
            <v-icon>logour</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Basic Application</v-toolbar-title>
      
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import store from '../stores';
import { getAuthUser } from '../api/auth';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(true);
const mini = ref(false);

// Get the authenticated user and their role
const authUser = getAuthUser();
const userRole = ref(authUser?.role || ''); // Make it reactive and default to an empty string if not found

const items = [
  { title: 'Customers', icon: 'fas fa-users', route: '/customers', roles: ['admin'] },
  { title: 'Leads', icon: 'fas fa-user-plus', route: '/leads', roles: ['admin'] },
  { title: 'Projects', icon: 'fas fa-folder', route: '/projects', roles: ['admin', 'project_manager', 'engineer'] },
  { title: 'Users', icon: 'fas fa-user', route: '/users', roles: ['admin', 'project_manager'] },
];

// Computed property to filter items based on user role
const filteredItems = computed(() => {
  return items.filter(item => item.roles.includes(userRole.value));
});

const router = useRouter();

const navigateTo = (route: string) => {
  router.push(route);
};

// Handle logout
const logOut = () => {
  store.dispatch('auth/logout')
    .then(() => {
      router.push('/auth/login'); // Redirect to the login page after logout
    })
    .catch(error => {
      console.error('Logout failed:', error); // Handle any errors here
    });
};
</script>
