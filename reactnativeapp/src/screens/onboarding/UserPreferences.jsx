import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import config from "../../services/config";
import { addUserPreferences } from "../../services/userpreferences";
import MySelect from "../../components/MySelect";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/userDetailsSlice";
import { setUser } from "../../redux/userSlice";

export default function UserPreferences({ navigation, route }) {
    const token = route.params.token;
    const dispatch = useDispatch();

    // FORM VALUES
    const [form, setForm] = useState({
        gender: "",
        lookingFor: "",
        openTo: "",
        zodiac: "",
        familyPlan: "",
        education: "",
        communicationStyle: "",
        lovestyle: "",
        drinking: "",
        smoking: "",
        workout: "",
        dietary: "",
        sleepingHabit: "",
        religion: "",
        personalityType: "",
        pet: "",
    });

    const updateForm = useCallback((key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    // LOOKUPS
    const [lookups, setLookups] = useState({
        lookingForList: [],
        openToList: [],
        zodiacList: [],
        familyPlanList: [],
        educationList: [],
        communicationStyleList: [],
        loveStyleList: [],
        drinkingList: [],
        smokingList: [],
        workoutList: [],
        dietaryList: [],
        sleepingHabitList: [],
        religionList: [],
        personalityTypeList: [],
        petList: [],
        genderList: [],
    });

    useEffect(() => {
        fetchAllLookups();
    }, []);

    const fetchAllLookups = async () => {
        const headers = { token };

        try {
            const endpoints = [
                "lookingfor",
                "opento",
                "zodiac",
                "familyplan",
                "education",
                "communicationstyle",
                "lovestyle",
                "drinking",
                "smoking",
                "workout",
                "dietary",
                "sleepingHabit",
                "religion",
                "personalityType",
                "pet",
                "gender",
            ];

            const requests = endpoints.map((ep) =>
                axios.get(`${config.BASE_URL}/api/${ep}`, { headers })
            );

            const responses = await Promise.all(requests);

            const newLookups = {};
            endpoints.forEach((key, index) => {
                newLookups[`${key}List`] = responses[index].data.data;
            });

            setLookups(newLookups);
        } catch (err) {
            console.log("Lookup error:", err);
        }
    };

    const submitPreferences = useCallback(async () => {
        // VALIDATION
        for (const key in form) {
            if (!form[key]) {
                Toast.show({ type: "error", text1: "Please fill all fields" });
                return;
            }
        }

        const res = await addUserPreferences(
            form.lookingFor,
            form.openTo,
            form.zodiac,
            form.familyPlan,
            form.education,
            form.communicationStyle,
            form.lovestyle,
            form.drinking,
            form.smoking,
            form.workout,
            form.dietary,
            form.sleepingHabit,
            form.religion,
            form.personalityType,
            form.pet,
            form.gender,
            token
        );

        if (!res) {
            Toast.show({ type: "error", text1: "Server Down" });
            return;
        }

        if (res.status === "success") {
            const headers = { token };
            const userDetails = await axios.get(
                config.BASE_URL + "/user/userdetails",
                { headers }
            );
            await AsyncStorage.setItem("token", token);
            dispatch(setUser({ token }));
            dispatch(setUserDetails(userDetails.data));

            Toast.show({ type: "success", text1: "Preferences Saved" });

        } else {
            Toast.show({ type: "error", text1: res.error?.code || "Error" });
        }
    }, [form, token]);

    const memoLookups = useMemo(() => lookups, [lookups]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Preferences</Text>

            {/* ---------------- BASIC INFO ---------------- */}
            <Text style={styles.section}>Basic Information</Text>

            <MySelect 
                label="Preferred Gender" 
                value={form.gender} 
                options={memoLookups.genderList} 
                onChange={(v) => updateForm("gender", v)} 
            />

            <MySelect 
                label="Looking For" 
                value={form.lookingFor} 
                options={memoLookups.lookingforList} 
                onChange={(v) => updateForm("lookingFor", v)} 
            />

            <MySelect 
                label="Open To" 
                value={form.openTo} 
                options={memoLookups.opentoList} 
                onChange={(v) => updateForm("openTo", v)} 
            />

            <MySelect
                label="Zodiac"
                value={form.zodiac}
                options={memoLookups.zodiacList}
                onChange={(v) => updateForm("zodiac", v)}
            />

            {/* ---------------- LIFESTYLE ---------------- */}
            <Text style={styles.section}>Lifestyle</Text>

            <MySelect 
                label="Family Plan" 
                value={form.familyPlan} 
                options={memoLookups.familyplanList} 
                onChange={(v) => updateForm("familyPlan", v)} 
            />

            <MySelect 
                label="Education" 
                value={form.education} 
                options={memoLookups.educationList} 
                onChange={(v) => updateForm("education", v)} 
            />

            <MySelect 
                label="Workout" 
                value={form.workout} 
                options={memoLookups.workoutList} 
                onChange={(v) => updateForm("workout", v)} 
            />

            <MySelect 
                label="Dietary Habit" 
                value={form.dietary} 
                options={memoLookups.dietaryList} 
                onChange={(v) => updateForm("dietary", v)} 
            />

            <MySelect 
                label="Sleeping Habit" 
                value={form.sleepingHabit} 
                options={memoLookups.sleepingHabitList} 
                onChange={(v) => updateForm("sleepingHabit", v)} 
            />

            {/* ---------------- PERSONALITY ---------------- */}
            <Text style={styles.section}>Personality</Text>

            <MySelect 
                label="Communication Style" 
                value={form.communicationStyle} 
                options={memoLookups.communicationstyleList} 
                onChange={(v) => updateForm("communicationStyle", v)} 
            />

            <MySelect 
                label="Love Style" 
                value={form.lovestyle} 
                options={memoLookups.lovestyleList} 
                onChange={(v) => updateForm("lovestyle", v)} 
            />

            <MySelect 
                label="Personality Type" 
                value={form.personalityType} 
                options={memoLookups.personalityTypeList} 
                onChange={(v) => updateForm("personalityType", v)} 
            />

            <MySelect 
                label="Religion" 
                value={form.religion} 
                options={memoLookups.religionList} 
                onChange={(v) => updateForm("religion", v)} 
            />

            {/* ---------------- HABITS ---------------- */}
            <Text style={styles.section}>Habits</Text>

            <MySelect 
                label="Drinking" 
                value={form.drinking} 
                options={memoLookups.drinkingList} 
                onChange={(v) => updateForm("drinking", v)} 
            />

            <MySelect 
                label="Smoking" 
                value={form.smoking} 
                options={memoLookups.smokingList} 
                onChange={(v) => updateForm("smoking", v)} 
            />

            <MySelect 
                label="Pet Preference" 
                value={form.pet} 
                options={memoLookups.petList} 
                onChange={(v) => updateForm("pet", v)} 
            />

            {/* SUBMIT */}
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
    section: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 25,
        marginBottom: 10,
        color: "#444",
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
