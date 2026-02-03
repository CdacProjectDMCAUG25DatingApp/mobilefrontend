import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import config from "./config";

// Convert JS date → yyyy-mm-dd (SQL)
const toSqlDate = (date) => {
    if (!date) return null;
    const rawDate = new Date(date);
    return rawDate.toLocaleDateString("en-CA");
};

export async function addUserProfile(
    gender,
    bio,
    religion,
    location,
    motherTongue,
    marital,
    dob,
    education,
    tagline,
    jobIndustry,
    token
) {
    try {
        const url = config.BASE_URL + "/user/profile";

        const body = {
            gender,
            bio,
            religion,
            location,
            motherTongue,
            marital,
            dob: toSqlDate(dob),
            education,
            tagline,
            jobIndustry,
        };
        const headers = { token };

        const response = await axios.post(url, body, { headers });

        return response.data;
    } catch (error) {
        console.log("addUserProfile error:", error);
        Toast.show({ type: "error", text1: "Error saving profile" });
        return null;
    }
}

export async function getUserDetails() {
    try {
        const url = config.BASE_URL + "/user/userdetails";

        const token = await AsyncStorage.getItem("token");

        const headers = { token };

        const response = await axios.get(url, { headers });

        return response.data.data[0];
    } catch (error) {
        console.log("getUserDetails error:", error);
        Toast.show({ type: "error", text1: "Error loading user details" });
        return null;
    }
}
