// src/screens/Profile/CreateProfile.js

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../services/config";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { addUserProfile } from "../../services/userprofile";

// Custom Select Component
import MySelect from "../../components/MySelect";

export default function CreateProfile({ navigation }) {

    // Form Data
    const [profile, setProfile] = useState({
        gender: "",
        bio: "",
        religion: "",
        location: "",
        motherTongue: "",
        marital: "",
        dob: null,
        education: "",
        jobIndustry: "",
        tagLine: "",
    });

    // Lookups
    const [lists, setLists] = useState({
        gender: [],
        religion: [],
        motherTongue: [],
        education: [],
        jobIndustry: [],
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    // -------- FETCH LOOKUP DATA --------
    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem("token");
            const headers = { token };

            try {
                const [g, r, m, e, j] = await Promise.all([
                    axios.get(config.BASE_URL + "/api/gender", { headers }),
                    axios.get(config.BASE_URL + "/api/religion", { headers }),
                    axios.get(config.BASE_URL + "/api/mother-tongue", { headers }),
                    axios.get(config.BASE_URL + "/api/education", { headers }),
                    axios.get(config.BASE_URL + "/api/job-industry", { headers }),
                ]);

                setLists({
                    gender: g.data.data,
                    religion: r.data.data,
                    motherTongue: m.data.data,
                    education: e.data.data,
                    jobIndustry: j.data.data,
                });
            } catch (err) {
                console.log("Lookup fetch error:", err);
            }
        })();
    }, []);

    // ---------- FORM STATE UPDATE ----------
    const update = (key, value) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
    };

    // ---------- SUBMIT ----------
    const submitProfile = async () => {
        const {
            gender,
            bio,
            religion,
            location,
            motherTongue,
            marital,
            dob,
            education,
            tagLine,
            jobIndustry,
        } = profile;

        if (
            !gender ||
            !bio ||
            !religion ||
            !location ||
            !motherTongue ||
            !marital ||
            !dob ||
            !education ||
            !tagLine ||
            !jobIndustry
        ) {
            return Toast.show({ type: "error", text1: "Fill All Fields" });
        }

        const res = await addUserProfile(
            gender,
            bio,
            religion,
            location,
            motherTongue,
            marital,
            dob,
            education,
            tagLine,
            jobIndustry
        );

        if (!res) return;

        if (res.status !== "success") {
            Toast.show({
                type: "error",
                text1: res.error?.code || "Something went wrong",
            });
            return;
        }

        Toast.show({ type: "success", text1: "Profile Completed" });

        const token = await AsyncStorage.getItem("token");
        const headers = { token };

        const photos = await axios.get(config.BASE_URL + "/photos/userphotos", {
            headers,
        });

        if (photos.data.data.length === 6) {
            const prefs = await axios.get(config.BASE_URL + "/user/userpreferences", {
                headers,
            });

            return prefs.data.data.length === 1
                ? navigation.replace("Home")
                : navigation.replace("UserPreferencaes");
        }

        navigation.replace("AddPhotos");
    };

    // ---------- UI ----------
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Profile</Text>

            {/* GENDER */}
            <MySelect
                label="Gender"
                value={profile.gender}
                options={lists.gender}
                onChange={(v) => update("gender", v)}
            />

            {/* BIO */}
            <Label label="Bio">
                <TextInput
                    style={styles.input}
                    onChangeText={(t) => update("bio", t)}
                />
            </Label>

            {/* RELIGION */}
            <MySelect
                label="Religion"
                value={profile.religion}
                options={lists.religion}
                onChange={(v) => update("religion", v)}
            />

            {/* LOCATION */}
            <Label label="Where You Live">
                <TextInput
                    style={styles.input}
                    onChangeText={(t) => update("location", t)}
                />
            </Label>

            {/* MOTHER TONGUE */}
            <MySelect
                label="Mother Tongue"
                value={profile.motherTongue}
                options={lists.motherTongue}
                onChange={(v) => update("motherTongue", v)}
            />

            {/* MARITAL */}
            <Label label="Marital Status">
                <View style={styles.row}>
                    <Radio
                        label="Yes"
                        active={profile.marital === "1"}
                        onPress={() => update("marital", "1")}
                    />
                    <Radio
                        label="No"
                        active={profile.marital === "0"}
                        onPress={() => update("marital", "0")}
                    />
                </View>
            </Label>

            {/* DOB */}
            <Label label="Select DOB">
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateButton}
                >
                    <Text style={styles.dateText}>
                        {profile.dob
                            ? profile.dob.toDateString()
                            : "Select Date"}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={
                            profile.dob instanceof Date ? profile.dob : new Date()
                        }
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selected) => {
                            setShowDatePicker(false);
                            if (selected) update("dob", new Date(selected));
                        }}
                    />
                )}
            </Label>

            {/* EDUCATION */}
            <MySelect
                label="Education"
                value={profile.education}
                options={lists.education}
                onChange={(v) => update("education", v)}
            />

            {/* TAGLINE */}
            <Label label="Tagline">
                <TextInput
                    style={styles.input}
                    onChangeText={(t) => update("tagLine", t)}
                />
            </Label>

            {/* JOB INDUSTRY */}
            <MySelect
                label="Job Industry"
                value={profile.jobIndustry}
                options={lists.jobIndustry}
                onChange={(v) => update("jobIndustry", v)}
            />

            {/* SUBMIT */}
            <TouchableOpacity style={styles.button} onPress={submitProfile}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

            <Toast />
        </ScrollView>
    );
}

/* Small Helper Components */
function Label({ label, children }) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label}</Text>
            {children}
        </View>
    );
}

function Radio({ label, active, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.radio, active && styles.radioSelected]}
            onPress={onPress}
        >
            <Text style={styles.radioText}>{label}</Text>
        </TouchableOpacity>
    );
}

/* Styles */
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#000",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 20,
        color: "white",
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "white",
    },
    readonly: {
        paddingVertical: 10,
        color: "#bbb",
    },
    input: {
        backgroundColor: "#222",
        padding: 12,
        borderRadius: 8,
        color: "white",
    },
    row: {
        flexDirection: "row",
        gap: 20,
    },
    radio: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#555",
        borderRadius: 8,
        width: 80,
        alignItems: "center",
    },
    radioSelected: {
        backgroundColor: "#2196F3",
        borderColor: "#2196F3",
    },
    radioText: {
        color: "white",
        fontWeight: "600",
    },
    dateButton: {
        backgroundColor: "#222",
        padding: 12,
        borderRadius: 8,
    },
    dateText: {
        color: "white",
        fontSize: 15,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 16,
    },
});
