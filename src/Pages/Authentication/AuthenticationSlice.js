import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../Config/init-firebase";

const initialState = {
  user: null,
  isAuthenticated: false,
  userLoading: false,
  error: null,
};

export const signOutSocialTalks = createAsyncThunk(
  "Authentication/signOutSocialTalks",
  async () => {
    await signOut(auth);
  }
);

export const updateSocialTalkUser = createAsyncThunk(
  "Authentication/updateSocialTalkUser",
  async (data, thunkAPI) => {
    const {
      currentUser,
      updateData: { displayName, photoURL },
    } = data;

    await updateProfile(currentUser, { displayName, photoURL });
  }
);

export const createSocialTalkUser = createAsyncThunk(
  "Authentication/updateSocialTalkUser",
  async (data, thunkAPI) => {
    const { firstName, lastName, email, password } = data;

    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    if (newUser.user) {
      thunkAPI.dispatch(signOutSocialTalks());

      thunkAPI.dispatch(
        updateSocialTalkUser({
          currentUser: newUser.user,
          updateData: {
            displayName: `${firstName} ${lastName}`,
            photoURL: "",
          },
        })
      );
    }
  }
);
export const signInUserSocialTalks = createAsyncThunk(
  "Authentication/signInUserSocialTalks",
  async (data, thunkAPI) => {
    const { email, password } = data;
    await signInWithEmailAndPassword(auth, email, password);
  }
);

const authenticationSlice = createSlice({
  name: "Authentication",
  initialState,
  reducers: {
    SET_USER: (state, action) => {
      state.user = JSON.parse(action.payload);
      state.isAuthenticated = true;
    },
    CLEAR_ERROR: (state, action) => {
      state.error = null;
    },
    REMOVE_USER: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userLoading = false;
      state.error = null;
    },
  },
  extraReducers: {
    [signOutSocialTalks.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [updateSocialTalkUser.fulfilled]: (state, action) => {
      state.userLoading = true;
    },
    [updateSocialTalkUser.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [createSocialTalkUser.pending]: (state, action) => {
      state.userLoading = true;
    },
    [createSocialTalkUser.fulfilled]: (state, action) => {},
    [createSocialTalkUser.rejected]: (state, action) => {
      state.userLoading = false;
      state.error = action.error.message;
    },
    [signInUserSocialTalks.pending]: (state, action) => {
      state.userLoading = true;
    },
    [signInUserSocialTalks.fulfilled]: (state, action) => {
      state.userLoading = false;
    },
    [signInUserSocialTalks.rejected]: (state, action) => {
      state.userLoading = false;
      state.error = action.error.message;
    },
  },
});

export const { SET_USER, REMOVE_USER, CLEAR_ERROR } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;

export const getAuthData = (state) => state.authentication;
