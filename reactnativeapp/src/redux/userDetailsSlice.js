import { createSlice } from "@reduxjs/toolkit";

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    data: {}
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.data = action.payload;
    },
    clearUserDetails: (state) => {
      state.data = {};
    }
  }
});

export const { setUserDetails, clearUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
