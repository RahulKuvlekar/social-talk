import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../Pages/Authentication/AuthenticationSlice";
import toastReducer from "../Components/UI/Toast/ToastSlice";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    toast: toastReducer,
  },
});
export { store };
