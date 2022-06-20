import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../Pages/Authentication/AuthenticationSlice";
import toastReducer from "../Components/UI/Toast/ToastSlice";
import postReducer from "../Components/PostSlice/PostSlice";
import myProfileReducer from "../Components/MyProfile/MyProfileSlice";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    toast: toastReducer,
    post: postReducer,
    myProfile: myProfileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["Authentication/SET_USER"],
        ignoredPaths: ["authentication.user", "payload"],
      },
    }),
});
export { store };
