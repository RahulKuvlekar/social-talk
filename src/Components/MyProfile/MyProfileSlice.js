import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import { updateProfile } from "firebase/auth";
import { deleteField, doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../Config/init-firebase";
import { LOCALTALKS_USERS } from "../../Constant/constant";

const initialState = {
  userProfile: null,
  profileLoader: false,
  smallLoader: false,
};

export const createProfile = createAsyncThunk(
  "Profile/createProfile",
  async (data, thunkAPI) => {
    const { displayName, email, photoURL, uid } = data;

    const body = {
      displayName,
      email,
      photoURL,
      bio: "",
      website: "",
      followers: {},
      following: {},
    };

    const myprofileRef = doc(db, LOCALTALKS_USERS, uid);
    await setDoc(myprofileRef, body, { merge: true });
  }
);

export const getProfile = createAsyncThunk(
  "Profile/getProfile",
  async (data, thunkAPI) => {
    const { profileId } = data;

    const profileRef = doc(db, LOCALTALKS_USERS, profileId);
    const profileData = await getDoc(profileRef);

    if (profileData.exists()) {
      return profileData.data();
    }
  }
);
export const followProfile = createAsyncThunk(
  "Profile/followProfile",
  async (data, thunkAPI) => {
    const { profileId, uid } = data;

    const followerRef = doc(db, LOCALTALKS_USERS, profileId);
    await setDoc(followerRef, { followers: { [uid]: true } }, { merge: true });

    const followingRef = doc(db, LOCALTALKS_USERS, uid);
    await setDoc(
      followingRef,
      { following: { [profileId]: true } },
      { merge: true }
    );

    return data;
  }
);
export const unfollowProfile = createAsyncThunk(
  "Profile/unfollowProfile",
  async (data, thunkAPI) => {
    const { profileId, uid } = data;

    const followerRef = doc(db, LOCALTALKS_USERS, profileId);
    await setDoc(
      followerRef,
      { followers: { [uid]: deleteField() } },
      { merge: true }
    );
    const followingRef = doc(db, LOCALTALKS_USERS, uid);
    await setDoc(
      followingRef,
      { following: { [profileId]: deleteField() } },
      { merge: true }
    );
    return data;
  }
);
export const updateProfileInfo = createAsyncThunk(
  "Profile/updateProfileInfo",
  async (data, thunkAPI) => {
    const { uid, bio, website } = data;
    const profileRef = doc(db, LOCALTALKS_USERS, uid);
    await setDoc(profileRef, { bio, website }, { merge: true });
  }
);
export const updateProfilePhoto = createAsyncThunk(
  "Profile/updateProfilePhoto",
  async (data, thunkAPI) => {
    const { user, avatar } = data;

    const storageRef = ref(storage, `ProfileImage/${avatar.name + nanoid()}`);
    await uploadBytes(storageRef, avatar);
    const avatarURL = await getDownloadURL(storageRef);
    const profileRef = doc(db, LOCALTALKS_USERS, user?.uid);
    await setDoc(profileRef, { photoURL: avatarURL }, { merge: true });

    await updateProfile(user, { photoURL: avatarURL });
  }
);

const MyProfile = createSlice({
  name: "MyProfile",
  initialState,
  reducer: {
    RESET_MYPROFILE: (state) => {
      state = initialState;
    },
  },
  extraReducers: {
    [createProfile.pending]: (state) => {},
    [createProfile.fulfilled]: (state) => {},
    [createProfile.rejected]: (state, action) => {},
    [getProfile.pending]: (state) => {
      state.profileLoader = true;
    },
    [getProfile.fulfilled]: (state, action) => {
      state.userProfile = action.payload;
      state.profileLoader = false;
    },
    [getProfile.rejected]: (state) => {
      state.profileLoader = false;
    },
    [followProfile.pending]: (state) => {
      state.smallLoader = true;
    },
    [followProfile.fulfilled]: (state, action) => {
      state.userProfile.followers[action.payload.uid] = true;
      state.smallLoader = false;
    },
    [followProfile.rejected]: (state) => {
      state.smallLoader = false;
    },
    [unfollowProfile.pending]: (state) => {
      state.smallLoader = true;
    },
    [unfollowProfile.fulfilled]: (state, action) => {
      delete state.userProfile.followers[action.payload.uid];
      state.smallLoader = false;
    },
    [unfollowProfile.rejected]: (state) => {
      state.smallLoader = false;
    },
    [updateProfileInfo.pending]: (state) => {
      state.profileLoader = true;
    },
    [updateProfileInfo.fulfilled]: (state) => {
      state.profileLoader = false;
    },
    [updateProfileInfo.rejected]: (state) => {
      state.profileLoader = false;
    },
    [updateProfilePhoto.pending]: (state) => {
      state.profileLoader = true;
    },
    [updateProfilePhoto.fulfilled]: (state) => {
      state.profileLoader = false;
    },
    [updateProfilePhoto.rejected]: (state) => {
      state.profileLoader = false;
    },
  },
});

export const { RESET_MYPROFILE } = MyProfile.actions;
export default MyProfile.reducer;
export const getProfileData = (state) => state.myProfile;
