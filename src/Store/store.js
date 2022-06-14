import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../Pages/Authentication/AuthenticationSlice";
import toastReducer from "../Components/UI/Toast/ToastSlice";
import postReducer from "../Components/PostSlice/PostSlice";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    toast: toastReducer,
    post: postReducer,
  },
});
export { store };
