import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import userDetailsReducer from "./userDetailsSlice";
import photosReducer from "./photosSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    userDetails: userDetailsReducer,
    photos: photosReducer,
  }
});
