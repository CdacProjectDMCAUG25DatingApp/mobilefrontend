import axios from "axios";
import config from "./config";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------------------------------------------------
// FETCH CANDIDATES
// ---------------------------------------------------
export const serviceGetCandidate = async () => {
  try {
    const token = await AsyncStorage.getItem("token"); // ✅ MUST AWAIT

    if (!token) {
      Toast.show({
        type: "error",
        text1: "Token Missing",
        text2: "Please login again."
      });
      return [];
    }

    const response = await axios.get(
      config.BASE_URL + "/interactions/getcandidates",
      {
        headers: { token } // ✅ sends real token value
      }
    );

    if (response.data.status === "success") {
      return response.data.data;
    }

    Toast.show({
      type: "error",
      text1: "Error",
      text2: response.data.error || "Something went wrong"
    });

    return [];
  } catch (err) {
    Toast.show({
      type: "error",
      text1: "Network Error",
      text2: err.message,
    });

    return [];
  }
};

// ---------------------------------------------------
// FETCH MORE CANDIDATES (WHEN STACK ENDS)
// ---------------------------------------------------
export const serviceGetCandidatesAgain = async () => {
  try {
    const token = await AsyncStorage.getItem("token"); // ✅ MUST AWAIT

    const response = await axios.get(
      config.BASE_URL + "/interactions/getcandidates_again",
      {
        headers: { token }
      }
    );

    if (response.data.status === "success") {
      return response.data.data;
    }

    Toast.show({
      type: "error",
      text1: "Error",
      text2: response.data.error || "Something went wrong"
    });

    return [];
  } catch (err) {
    Toast.show({
      type: "error",
      text1: "Network Error",
      text2: err.message,
    });

    return [];
  }
};
