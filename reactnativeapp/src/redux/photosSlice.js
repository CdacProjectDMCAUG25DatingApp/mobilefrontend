import { createSlice } from "@reduxjs/toolkit";

const photosSlice = createSlice({
  name: "photos",
  initialState: {
    data: []
  },
  reducers: {
    setPhotos: (state, action) => {
      state.data = action.payload;
    },
    clearPhotos: (state) => {
      state.data = [];
    }
  }
});

export const { setPhotos, clearPhotos } = photosSlice.actions;
export default photosSlice.reducer;
