import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

import { UserContext } from "../../context/UserContext";
import config from "../../services/config";
import { addUserPreferences } from "../../services/userpreferences";
import MySelect from "../../components/MySelect";

export default function UserPreferences({ navigation }) {
    const { user } = useContext(UserContext);

    const [gender, setGender] = useState("");
    const [lookingFor, setLookingFor] = useState("");
    const [openTo, setOpenTo] = useState("");
    const [zodiac, setZodiac] = useState("");
    const [familyPlan, setFamilyPlan] = useState("");
    const [education, setEducation] = useState("");
    const [communicationStyle, setCommunicationStyle] = useState("");
    const [lovestyle, setLoveStyle] = useState("");
    const [drinking, setDrinking] = useState("");
    const [smoking, setSmoking] = useState("");
    const [workout, setWorkout] = useState("");
    const [dietary, setDietary] = useState("");
    const [sleepingHabit, setSleepingHabit] = useState("");
    const [religion, setReligion] = useState("");
    const [personalityType, setPersonalityType] = useState("");
    const [pet, setPet] = useState("");

    // Lists
    const [lookingForList, setLookingForList] = useState([]);
    const [openToList, setOpenToList] = useState([]);
    const [zodiacList, setZodiacList] = useState([]);
    const [familyPlanList, setFamilyPlanList] = useState([]);
    const [educationList, setEducationList] = useState([]);
    const [communicationStyleList, setCommunicationStyleList] = useState([]);
    const [loveStyleList, setLoveStyleList] = useState([]);
    const [drinkingList, setDrinkingList] = useState([]);
    const [smokingList, setSmokingList] = useState([]);
    const [workoutList, setWorkoutList] = useState([]);
    const [dietaryList, setDietaryList] = useState([]);
    const [sleepingHabitList, setSleepingHabitList] = useState([]);
    const [religionList, setReligionList] = useState([]);
    const [personalityTypeList, setPersonalityTypeList] = useState([]);
    const [petList, setPetList] = useState([]);
    const [genderList, setGenderList] = useState([]);

    useEffect(() => {
        fetchAllLookups();
    }, []);

    const fetchAllLookups = async () => {
        const token = await AsyncStorage.getItem("token");
        const headers = { token };

        try {
            const [
                lookingForRes,
                openToRes,
                zodiacRes,
                familyPlanRes,
                educationRes,
                communicationStyleRes,
                loveStyleRes,
                drinkingRes,
                smokingRes,
                workoutRes,
                dietaryRes,
                sleepingHabitRes,
                religionRes,
                personalityTypeRes,
                petRes,
                genderRes,
            ] = await Promise.all([
                axios.get(config.BASE_URL + "/api/lookingfor", { headers }),
                axios.get(config.BASE_URL + "/api/opento", { headers }),
                axios.get(config.BASE_URL + "/api/zodiac", { headers }),
                axios.get(config.BASE_URL + "/api/familyplan", { headers }),
                axios.get(config.BASE_URL + "/api/education", { headers }),
                axios.get(config.BASE_URL + "/api/communicationstyle", { headers }),
                axios.get(config.BASE_URL + "/api/lovestyle", { headers }),
                axios.get(config.BASE_URL + "/api/drinking", { headers }),
                axios.get(config.BASE_URL + "/api/smoking", { headers }),
                axios.get(config.BASE_URL + "/api/workout", { headers }),
                axios.get(config.BASE_URL + "/api/dietary", { headers }),
                axios.get(config.BASE_URL + "/api/sleepingHabit", { headers }),
                axios.get(config.BASE_URL + "/api/religion", { headers }),
                axios.get(config.BASE_URL + "/api/personalityType", { headers }),
                axios.get(config.BASE_URL + "/api/pet", { headers }),
                axios.get(config.BASE_URL + "/api/gender", { headers }),
            ]);

            setLookingForList(lookingForRes.data.data);
            setOpenToList(openToRes.data.data);
            setZodiacList(zodiacRes.data.data);
            setFamilyPlanList(familyPlanRes.data.data);
            setEducationList(educationRes.data.data);
            setCommunicationStyleList(communicationStyleRes.data.data);
            setLoveStyleList(loveStyleRes.data.data);
            setDrinkingList(drinkingRes.data.data);
            setSmokingList(smokingRes.data.data);
            setWorkoutList(workoutRes.data.data);
            setDietaryList(dietaryRes.data.data);
            setSleepingHabitList(sleepingHabitRes.data.data);
            setReligionList(religionRes.data.data);
            setPersonalityTypeList(personalityTypeRes.data.data);
            setPetList(petRes.data.data);
            setGenderList(genderRes.data.data);
        } catch (err) {
            console.log("Lookup fetch error:", err);
        }
    };

    const submitPreferences = async () => {
        if (
            !gender ||
            !lookingFor ||
            !openTo ||
            !zodiac ||
            !familyPlan ||
            !education ||
            !communicationStyle ||
            !lovestyle ||
            !drinking ||
            !smoking ||
            !workout ||
            !dietary ||
            !sleepingHabit ||
            !religion ||
            !personalityType ||
            !pet
        ) {
            Toast.show({ type: "error", text1: "Please fill all fields" });
            return;
        }

        const res = await addUserPreferences(
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
            gender
        );

        if (!res) {
            Toast.show({ type: "error", text1: "Server Down" });
            return;
        }

        if (res.status === "success") {
            Toast.show({ type: "success", text1: "Preferences Saved" });
            navigation.replace("Home");
        } else {
            Toast.show({ type: "error", text1: res.error?.code || "Error" });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Preferences</Text>

            {/* ALL DROPDOWNS USING MYSELECT */}
            <MySelect label="Preferred Gender" value={gender} options={genderList} onChange={setGender} />

            <MySelect label="Looking For" value={lookingFor} options={lookingForList} onChange={setLookingFor} />

            <MySelect label="Open To" value={openTo} options={openToList} onChange={setOpenTo} />

            <MySelect label="Zodiac" value={zodiac} options={zodiacList} onChange={setZodiac} />

            <MySelect label="Family Plan" value={familyPlan} options={familyPlanList} onChange={setFamilyPlan} />

            <MySelect label="Education" value={education} options={educationList} onChange={setEducation} />

            <MySelect label="Communication Style" value={communicationStyle} options={communicationStyleList} onChange={setCommunicationStyle} />

            <MySelect label="Love Style" value={lovestyle} options={loveStyleList} onChange={setLoveStyle} />

            <MySelect label="Drinking" value={drinking} options={drinkingList} onChange={setDrinking} />

            <MySelect label="Smoking" value={smoking} options={smokingList} onChange={setSmoking} />

            <MySelect label="Workout" value={workout} options={workoutList} onChange={setWorkout} />

            <MySelect label="Dietary Habit" value={dietary} options={dietaryList} onChange={setDietary} />

            <MySelect label="Sleeping Habit" value={sleepingHabit} options={sleepingHabitList} onChange={setSleepingHabit} />

            <MySelect label="Religion" value={religion} options={religionList} onChange={setReligion} />

            <MySelect label="Personality Type" value={personalityType} options={personalityTypeList} onChange={setPersonalityType} />

            <MySelect label="Pet Preference" value={pet} options={petList} onChange={setPet} />

            <TouchableOpacity style={styles.button} onPress={submitPreferences}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

            <Toast />
        </ScrollView>
    );
}

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingBottom: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 22,
    },
    button: {
        backgroundColor: "#2196f3",
        paddingVertical: 18,
        borderRadius: 12,
        marginTop: 30,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 17,
        fontWeight: "700",
    },
});
