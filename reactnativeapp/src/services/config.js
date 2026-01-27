import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE = "http://10.147.93.51:4000";

const config = {
  BASE_URL: BASE,

  // Convert relative photo URL → full URL
  urlConverter: (url) => `${BASE}/profilePhotos/${url}`,

  // Get auth token from storage
  getToken: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (err) {
      console.log("Error reading token:", err);
      return null;
    }
  },

  // Save token (optional helper)
  setToken: async (token) => {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (err) {
      console.log("Error saving token:", err);
    }
  },
};

export default config;
