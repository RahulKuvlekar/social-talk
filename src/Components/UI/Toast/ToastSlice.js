import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  toastlist: [],
};

const ToastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    ADD_TOAST: {
      reducer(state, action) {
        state.toastlist.push(action.payload);
      },
      prepare(type, message) {
        return {
          payload: {
            id: nanoid(),
            type,
            title: type.slice(0, 1).toUpperCase() + type.slice(1).toLowerCase(),
            message,
          },
        };
      },
    },
    DELETE_TOAST: (state, action) => {
      state.toastlist = state.toastlist.filter((toast) => toast.id === action);
    },
  },
});

export const { ADD_TOAST, DELETE_TOAST } = ToastSlice.actions;
export default ToastSlice.reducer;
export const getToastList = (state) => state.toast;
