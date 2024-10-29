import { createRouter, createWebHistory } from "vue-router";
import BaseLayout from "../views/BaseLayout.vue";
import { permissions } from "../utils/permissions";

const routes = [
  {
    path: "/",
    component: BaseLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        redirect: "/projects",
      },
      {
        path: "/customers",
        name: "customers",
        component: () => import("../views/CustomersView.vue"),
        meta: { requiresArequiredPermissionsuth: true, requiredPermissions: ["viewCustomers"] },
      },
      {
        path: "/leads",
        name: "leads",
        component: () => import("../views/LeadsView.vue"),
        meta: { requiresAuth: true, requiredPermissions: ["viewLeads"] },
      },
      {
        path: "/projects",
        name: "projects",
        component: () => import("../views/ProjectsView.vue"),
        meta: { requiresAuth: true, requiredPermissions: ["viewProjects"] },
      },
      {
        path: "/add-project",
        name: "add_projects",
        component: () => import("../views/AddProjectView.vue"),
        meta: { requiresAuth: true, requiredPermissions: ["viewProjects"] },
      },
      {
        path: "/users",
        name: "users",
        component: () => import("../views/UsersView.vue"),
        meta: { requiresAuth: true, requiredPermissions: ["viewUsers"] },
      },
    ],
  },
  {
    path: "/auth/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/auth/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const tokenExists = !!sessionStorage.getItem("token");
  const userExists = !!sessionStorage.getItem("token");

  const isAuthenticated = tokenExists && userExists;

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {

    next({ name: "login" }); // Redirect to login
  }

  else {
    next(); // Proceed to the route
  }
});

export default router;
