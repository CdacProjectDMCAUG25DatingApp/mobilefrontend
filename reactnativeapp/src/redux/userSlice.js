import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: "",
    name: "",
    email: "",
    mobile: ""
  },
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    logout: () => ({
      token: "",
      name: "",
      email: "",
      mobile: ""
    })
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
