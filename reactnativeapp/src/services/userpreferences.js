import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import config from "./config";

export async function addUserPreferences(
    lookingFor,
    openTo,
    zodiac,
    familyPlan,
    education,
    communicationStyle,
    lovestyle,
    drinking,
    smoking,
    workout,
    dietary,
    sleepingHabit,
    religion,
    personalityType,
    pet,
    gender,
    token
) {
    try {
        const url = config.BASE_URL + "/user/userpreferences";

        const body = {
            preferred_gender_id: gender,
            looking_for_id: lookingFor,
            open_to_id: openTo,
            zodiac_id: zodiac,
            education_id: education,
            family_plan_id: familyPlan,
            communication_style_id: communicationStyle,
            love_style_id: lovestyle,
            drinking_id: drinking,
            smoking_id: smoking,
            workout_id: workout,
            dietary_id: dietary,
            sleeping_habit_id: sleepingHabit,
            religion_id: religion,
            personality_type_id: personalityType,
            pet_id: pet,
        };

        const headers = { token };

        const response = await axios.post(url, body, { headers });
        return response.data;

    } catch (error) {
        console.log("addUserPreferences error:", error);
        Toast.show({ type: "error", text1: "Error saving preferences" });
        return null;
    }
}


export async function getUserPreferences() {
    try {
        const url = config.BASE_URL + "/user/userpreferences";

        const token = await AsyncStorage.getItem("token");
        const headers = { token };

        const response = await axios.get(url, { headers });

        return response.data.data?.[0] || null;
    } catch (error) {
        console.log("getUserPreferences error:", error);
        Toast.show({ type: "error", text1: "Error loading preferences" });
        return null;
    }
}
