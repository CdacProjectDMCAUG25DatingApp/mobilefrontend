import axios from "axios";
import config from "../services/config";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { setUserDetails } from "./userDetailsSlice";
import { setPhotos } from "./photosSlice";

// GET TOKEN 
const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

// LOAD FULL DETAILS
export const loadUserDetails = () => async (dispatch) => {
  const token = await getToken();
  const headers = { token };

  const res = await axios.get(`${config.BASE_URL}/user/userdetails`, {
    headers,
  });

  dispatch(setUserDetails(res.data.data || {}));
};

// UPDATE DETAILS (PROFILE + PREFERENCES)
export const updateUserDetails = (fields) => async (dispatch) => {
  const token = await getToken();
  const headers = { token };

  // Update fields
  await axios.put(`${config.BASE_URL}/user/userdetails`, fields, { headers });

  // Reload full updated user profile
  const res = await axios.get(`${config.BASE_URL}/user/userdetails`, {
    headers,
  });

  dispatch(setUserDetails(res.data.data || {}));
};

// LOAD PHOTOS
export const loadPhotos = () => async (dispatch) => {
  const token = await getToken();
  const headers = { token };

  const res = await axios.get(`${config.BASE_URL}/photos/userphotos`, {
    headers,
  });

  dispatch(setPhotos(res.data.data || []));
};
