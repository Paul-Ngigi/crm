/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from "vuex";
import auth from "./auth";

const store = createStore<any>({
  modules: {
    auth,
  },
});

// Export the store
export default store;
