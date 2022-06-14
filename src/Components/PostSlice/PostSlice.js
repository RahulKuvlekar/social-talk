import {
  createAsyncThunk,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteField,
  query,
  orderBy,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../Config/init-firebase";
import { LOCALTALKS_POSTS } from "../../Constant/constant";

const initialState = {
  allPosts: [],
  myPosts: [],
  postLoading: false,
  featUpdate: false,
};

export const getAllPost = createAsyncThunk(
  "Post/getAllPost",
  async (data, thunkAPI) => {
    const postRef = collection(db, LOCALTALKS_POSTS);
    const queryRef = query(postRef, orderBy("userInfo.date", "desc"));
    const postSnap = await getDocs(queryRef);
    const postData = postSnap.docs.map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    }));

    return JSON.stringify(postData);
  }
);
export const makePost = createAsyncThunk(
  "Post/makePost",
  async (data, thunkAPI) => {
    const dataRef = doc(db, LOCALTALKS_POSTS, nanoid());
    await setDoc(dataRef, data, { merge: true });
    const { dispatch } = thunkAPI;
    dispatch(getAllPost());
  }
);
export const deletePost = createAsyncThunk(
  "Post/deletePost",
  async (data, thunkAPI) => {
    const { postId } = data;
    const { dispatch } = thunkAPI;

    const dataRef = doc(db, LOCALTALKS_POSTS, postId);
    await deleteDoc(dataRef, data, { merge: true });
    dispatch(getAllPost());
  }
);
export const editPost = createAsyncThunk(
  "Post/editPost",
  async (data, thunkAPI) => {
    const { postCaption, postDescription, postId } = data;
    const dataRef = doc(db, LOCALTALKS_POSTS, postId);
    await setDoc(dataRef, { postCaption, postDescription }, { merge: true });
    JSON.parse(undefined);
    return data;
  }
);
export const likePost = createAsyncThunk(
  "Post/likePost",
  async (data, thunkAPI) => {
    const { postId, uid } = data;
    const dataRef = doc(db, LOCALTALKS_POSTS, postId);
    await setDoc(dataRef, { likes: { [uid]: true } }, { merge: true });

    return { postId, uid };
  }
);
export const unLikePost = createAsyncThunk(
  "Post/unLikePost",
  async (data, thunkAPI) => {
    const { postId, uid } = data;
    const dataRef = doc(db, LOCALTALKS_POSTS, postId);
    await updateDoc(dataRef, { [`likes.${uid}`]: deleteField() });

    return { postId, uid };
  }
);
export const addToBookmark = createAsyncThunk(
  "Post/addToBookmark",
  async (data, thunkAPI) => {
    const { postId, uid } = data;
    const dataRef = doc(db, LOCALTALKS_POSTS, postId);
    await setDoc(dataRef, { bookmarks: { [uid]: true } }, { merge: true });

    return { postId, uid };
  }
);
export const removeFromBookmark = createAsyncThunk(
  "Post/removeFromBookmark",
  async (data, thunkAPI) => {
    const { postId, uid } = data;
    const dataRef = doc(db, LOCALTALKS_POSTS, postId);
    await updateDoc(dataRef, { [`bookmarks.${uid}`]: deleteField() });

    return { postId, uid };
  }
);

export const addComment = createAsyncThunk(
  "Post/addComment",
  async (data, thunkAPI) => {
    const { postId, comment } = data;
    const dataRef = doc(db, LOCALTALKS_POSTS, postId);
    await setDoc(
      dataRef,
      {
        comments: arrayUnion(comment),
      },
      { merge: true }
    );

    return { postId, comment };
  }
);

const PostSlice = createSlice({
  name: "post",
  initialState,
  reducer: {
    SET_POST_LOADER: (state) => {
      state.postLoading = true;
    },
    REMOVE_POST_LOADER: (state) => {
      state.postLoading = false;
    },
  },
  extraReducers: {
    [getAllPost.pending]: (state) => {
      state.postLoading = true;
    },
    [getAllPost.fulfilled]: (state, action) => {
      state.postLoading = false;
      state.allPosts = JSON.parse(action.payload);
    },
    [getAllPost.rejected]: (state, action) => {
      state.postLoading = false;
    },
    [likePost.fulfilled]: (state, action) => {
      const postIndex = state.allPosts.findIndex(
        (post) => post.id === action.payload?.postId
      );
      state.allPosts[postIndex].likes[action.payload?.uid] = true;
    },
    [unLikePost.fulfilled]: (state, action) => {
      const postIndex = state.allPosts.findIndex(
        (post) => post.id === action.payload?.postId
      );
      delete state.allPosts[postIndex].likes[action.payload?.uid];
    },
    [addToBookmark.fulfilled]: (state, action) => {
      const postIndex = state.allPosts.findIndex(
        (post) => post.id === action.payload?.postId
      );
      state.allPosts[postIndex].bookmarks[action.payload?.uid] = true;
    },
    [removeFromBookmark.fulfilled]: (state, action) => {
      const postIndex = state.allPosts.findIndex(
        (post) => post.id === action.payload?.postId
      );
      delete state.allPosts[postIndex].bookmarks[action.payload?.uid];
    },
    [makePost.pending]: (state) => {
      state.postLoading = true;
    },
    [makePost.fulfilled]: (state) => {
      state.postLoading = false;
    },
    [makePost.rejected]: (state) => {
      state.postLoading = false;
    },
    [deletePost.pending]: (state) => {},
    [deletePost.fulfilled]: (state) => {},
    [deletePost.rejected]: (state) => {},
    [editPost.fulfilled]: (state, action) => {
      const postIndex = state.allPosts.findIndex(
        (post) => post.id === action.payload?.postId
      );

      state.allPosts[postIndex].postDescription =
        action.payload.postDescription;

      state.allPosts[postIndex].postCaption = action.payload.postCaption;
    },
    [addComment.fulfilled]: (state, action) => {
      const postIndex = state.allPosts.findIndex(
        (post) => post.id === action.payload?.postId
      );

      state.allPosts[postIndex].comments.push(action.payload.comment);
    },
  },
});

export const { SET_POST_LOADER, REMOVE_POST_LOADER } = PostSlice.actions;

export default PostSlice.reducer;

export const getPostData = (state) => state.post;
