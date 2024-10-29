/* eslint-disable @typescript-eslint/no-explicit-any */
// useHttpErrorHandler.ts
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

export function useHttpErrorHandler() {
  const router = useRouter(); // Get the router instance
  const store = useStore(); // Access the Vuex store
  const toast = useToast(); // Create a toast instance

  const processHttpError = async (error: any) => {
    if (!error.response) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again later.");
      return;
    }

    const status = error.response.status;

    switch (status) {
      case 401: // Unauthorized
        if (error.response.data.message === "Token expired") {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");

          try {
            await store.dispatch("auth/logout");
            toast.info("Your session has expired. Please log in again.");
            router.push("/");
          } catch (err) {
            console.error("Error during logout:", err);
          }
        } else {
          toast.error("Unauthorized access. Please log in.");
        }
        break;

      case 403: // Forbidden
        toast.error("You do not have permission to perform this action.");
        break;

      case 404: // Not Found
        toast.error("Requested resource not found.");
        break;

      case 500: // Internal Server Error
        toast.error(
          "An internal server error occurred. Please try again later."
        );
        break;

      default:
        toast.error(
          `An unexpected error occurred: ${
            error.response.data.message || "Unknown error"
          }`
        );
    }
  };

  return { processHttpError };
}
