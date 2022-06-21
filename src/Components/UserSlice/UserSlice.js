import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/init-firebase";
import { LOCALTALKS_USERS } from "../../Constant/constant";

const initialState = {
  userProfiles: [],
};

export const getAllUserProfiles = createAsyncThunk(
  "userProfiles/allProfiles",
  async (data, thunkAPI) => {
    const profileRef = collection(db, LOCALTALKS_USERS);
    const snapshotRef = await getDocs(profileRef);
    const userProfiles = snapshotRef.docs.map((snapshot) => ({
      uid: snapshot.id,
      ...snapshot.data(),
    }));

    return userProfiles;
  }
);

const UserSlice = createSlice({
  name: "userProfiles",
  initialState,
  extraReducers: {
    [getAllUserProfiles.pending]: () => {},
    [getAllUserProfiles.fulfilled]: (state, action) => {
      state.userProfiles = action.payload;
    },
    [getAllUserProfiles.rejected]: () => {},
  },
});

export default UserSlice.reducer;
export const getAllProfilesData = (state) => state.userProfiles;
