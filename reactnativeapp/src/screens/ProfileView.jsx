// src/screens/ProfileView.jsx

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import config from "../services/config";
import { UserContext } from "../context/UserContext";

import PhotoInput from "../components/PhotoInput";
import MySelect from "../components/MySelect";
import ProfileViewBlock from "../components/ProfileViewBlock";

import {
  Menu,
  MenuOptions,
  MenuTrigger,
  MenuOption,
} from "react-native-popup-menu";

import Toast from "react-native-toast-message";

const ProfileView = ({ editable, profileData, onBack }) => {
  const { userDetails, photos, setPhotos } = useContext(UserContext);

  const finalData = profileData?.candidateData || userDetails;
  const finalPhotos = profileData?.photos || photos;

  const [genderList, setGenderList] = useState([]);
  const [profile, setProfile] = useState({});
  const [original, setOriginal] = useState({});
  const [dirty, setDirty] = useState({});

  // -------- REPORT MODAL STATE --------
  const [reportVisible, setReportVisible] = useState(false);
  const [reason, setReason] = useState(null);
  const [customReason, setCustomReason] = useState("");
  const [reportReasons, setReportReasons] = useState([]);

  // FETCH REPORT REASONS (NO HARDCODED OTHER)
  useEffect(() => {
    (async () => {
      try {
        const token = await config.getToken("token");
        const res = await axios.get(config.BASE_URL + "/api/report-reasons", {
          headers: { token },
        });

        // ONLY USE BACKEND VALUES
        setReportReasons(res.data.data);
      } catch (e) {
        console.log("Failed to load report reasons");
      }
    })();
  }, []);

  // BLOCK USER
  const handleBlock = async () => {
    try {
      const token = await config.getToken("token");
      await axios.post(
        config.BASE_URL + "/settings/block",
        { blocked_id: profileData?.token || finalData?.token, },  // THIS IS THE CORRECT JWT
        { headers: { token } }
      );

      Toast.show({ type: "success", text1: "User Blocked" });
    } catch (err) {
      console.log("Block failed:", err?.response?.data || err);
      Toast.show({ type: "error", text1: "Failed to block user" });
    }
  };


  // SUBMIT REPORT
  const submitReport = async () => {
    if (!reason) return;

    try {
      const token = await config.getToken("token");

      await axios.post(
        config.BASE_URL + "/settings/report",
        {
          reported_id: profileData?.token || finalData?.token,
          reason_id: reason,
          reason_custom: reason === 99 ? customReason : null,
        },
        { headers: { token } }
      );

      Toast.show({ type: "success", text1: "User Reported" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to report" });
    }

    setReportVisible(false);
    setReason(null);
    setCustomReason("");
  };

  // MENU STYLES
  const menuStyles = {
    optionsContainer: {
      backgroundColor: "#1c1c1c",
      borderRadius: 6,
      width: 140,
      paddingVertical: 6,
    },
    optionText: {
      color: "white",
      padding: 10,
      fontSize: 15,
    },
  };

  // LOAD GENDERS
  useEffect(() => {
    (async () => {
      try {
        const t = await config.getToken("token");
        const res = await axios.get(config.BASE_URL + "/api/gender", {
          headers: { token: t },
        });
        setGenderList(res.data.data);
      } catch { }
    })();
  }, []);

  // LOAD USER MERGED PROFILE
  useEffect(() => {
    if (!finalData) return;

    const merged = {
      ...finalData,
      image_prompt: finalPhotos?.[0]?.prompt || "",
    };

    setProfile(merged);
    setOriginal(merged);
    setDirty({});
  }, [finalData]);

  // HANDLE TEXT CHANGE
  const handleChange = (key, value) => {
    setProfile((p) => ({ ...p, [key]: value }));

    if (original[key] !== value) {
      setDirty((d) => ({ ...d, [key]: value }));
    } else {
      const copy = { ...dirty };
      delete copy[key];
      setDirty(copy);
    }
  };


  // UPDATE PROFILE
  const handleUpdate = async () => {
    if (!Object.keys(dirty).length) return;

    const token = await config.getToken("token");
    const headers = { token };

    const profileFields = [
      "bio",
      "height",
      "weight",
      "gender",
      "tagline",
      "dob",
      "marital_status",
      "location",
      "mother_tongue",
      "religion",
      "education",
      "job_industry_id",
    ];

    const prefMap = {
      looking_for: "looking_for_id",
      open_to: "open_to_id",
      zodiac: "zodiac_id",
      family_plan: "family_plan_id",
      preferred_gender: "preferred_gender_id",
      drinking: "drinking_id",
      smoking: "smoking_id",
      workout: "workout_id",
      dietary: "dietary_id",
      sleeping_habit: "sleeping_habit_id",
      love_style: "love_style_id",
      communication_style: "communication_style_id",
      personality_type: "personality_type_id",
      pet: "pet_id",
    };

    const p1 = {};
    const p2 = {};

    for (const [key, value] of Object.entries(dirty)) {
      if (profileFields.includes(key)) p1[key] = value;
      else if (prefMap[key]) p2[prefMap[key]] = value;
    }

    try {
      if (Object.keys(p1).length)
        await axios.patch(config.BASE_URL + "/user/profile", p1, { headers });

      if (Object.keys(p2).length)
        await axios.patch(config.BASE_URL + "/user/userdetails", p2, {
          headers,
        });

      if (dirty.image_prompt !== undefined) {
        await axios.patch(
          config.BASE_URL + "/user/photo/prompt",
          {
            photo_id: finalPhotos?.[0]?.photo_id,
            prompt: dirty.image_prompt,
          },
          { headers }
        );

        setPhotos((p) => {
          const updated = [...p];
          updated[0] = { ...updated[0], prompt: dirty.image_prompt };
          return updated;
        });
      }

      setOriginal(profile);
      setDirty({});
    } catch (err) {
      console.log("Updating error", err);
    }
  };

  // GROUPED PROFILE BLOCK SECTIONS
  const repeatedBlocks = [
    {
      dob: profile.dob,
      location: profile.location,
      mother_tongue: profile.mother_tongue,
      religion: profile.religion,
    },
    {
      education: profile.education,
      job_industry: profile.job_industry,
      looking_for: profile.looking_for,
      open_to: profile.open_to,
    },
    {
      drinking: profile.drinking,
      smoking: profile.smoking,
      workout: profile.workout,
      dietary: profile.dietary,
      sleeping_habit: profile.sleeping_habit,
    },
    {
      love_style: profile.love_style,
      communication_style: profile.communication_style,
      family_plan: profile.family_plan,
      personality_type: profile.personality_type,
      pet: profile.pet,
      zodiac: profile.zodiac,
      preferred_gender: profile.preferred_gender,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      {!editable && (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>

          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" size={26} color="white" />
            </MenuTrigger>

            <MenuOptions customStyles={menuStyles}>
              <MenuOption onSelect={() => setReportVisible(true)} text="Report" />
              <MenuOption onSelect={handleBlock} text="Block" />
            </MenuOptions>
          </Menu>
        </View>
      )}

      {/* CONTENT */}
      <ScrollView style={styles.pageContainer}>
        <View style={styles.mainCard}>
          <View style={{ alignItems: "center", width: "100%" }}>
            <PhotoInput imageUrl={config.urlConverter(finalPhotos?.[0]?.photo_url)}
              disabled={!editable} />
          </View>

          <Text style={styles.name}>{profile.user_name}</Text>
          <Text style={styles.tagline}>{profile.tagline}</Text>

          <Text style={styles.sectionLabel}>Bio</Text>
          <TextInput
            style={styles.textArea}
            editable={editable}
            value={profile.bio || ""}
            onChangeText={(v) => handleChange("bio", v)}
          />

          {/* Height / Weight / Gender */}
          <View style={styles.row}>
            {(profile.height || editable) && <View style={styles.col}>
              <Text style={styles.sectionLabel}>Height</Text>
              <TextInput
                style={styles.input}
                editable={editable}
                value={profile.height?.toString() || ""}
                onChangeText={(v) => handleChange("height", v)}
                keyboardType="numeric"
                inputMode="numeric"
              />
            </View>}

            {(profile.height || editable) && <View style={styles.col}>
              <Text style={styles.sectionLabel}>Weight</Text>
              <TextInput
                keyboardType="numeric"
                inputMode="numeric"
                style={styles.input}
                editable={editable}
                value={profile.weight?.toString() || ""}
                onChangeText={(v) => handleChange("weight", v)}
              />
            </View>}

            <View style={styles.col}>
              <MySelect
                label="Gender"
                value={profile.gender}
                options={genderList}
                noDropdown={!editable}
                onChange={(v) => handleChange("gender", v)}
              />
            </View>
          </View>

          {(editable || profile.image_prompt) && (
            <>
              <Text style={styles.sectionLabel}>Image Prompt</Text>
              <TextInput
                style={styles.textArea}
                editable={editable}
                value={profile.image_prompt || ""}
                onChangeText={(v) => handleChange("image_prompt", v)}
              />
            </>
          )}

          {editable && Object.keys(dirty).length > 0 && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
              <Text style={styles.saveBtnText}>Update Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {repeatedBlocks.map((section, i) => (
          <ProfileViewBlock
            key={i}
            dataObj={section}
            photos={finalPhotos}
            editable={editable}
            index={Math.min(i + 1, finalPhotos.length - 1)}
            reverse={i % 2 === 1}
          />
        ))}
      </ScrollView>

      {/* REPORT MODAL */}
      {reportVisible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Report User</Text>

            <MySelect
              label="Reason"
              value={reason}
              options={reportReasons.map((r) => ({ id: r.reason_id, name: r.name }))}
              onChange={(v) => setReason(v)}
            />

            {reason === 99 && (
              <TextInput
                placeholder="Enter custom reason..."
                placeholderTextColor="#777"
                value={customReason}
                onChangeText={setCustomReason}
                style={styles.modalInput}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setReportVisible(false)}
                style={styles.modalCancel}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={submitReport} style={styles.modalSubmit}>
                <Text style={styles.modalBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default ProfileView;

/* ------------------ STYLES ------------------ */
const styles = StyleSheet.create({
  actionBar: {
    marginTop: 30,          // ← leave space from top (20–40 as you asked)
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#000",
  },

  pageContainer: {
    paddingTop: 20,         // cleaner top spacing inside scroll
    paddingHorizontal: 16,
    backgroundColor: "#000",
  },

  mainCard: {
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 16,
    marginTop: 10,          // keeps card away from header
    marginBottom: 30,
  },

  name: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",    // better centered layout
  },

  tagline: {
    color: "#aaa",
    marginBottom: 12,
    textAlign: "center",
    fontStyle: "italic",
  },

  row: {
    flexDirection: "row",
    marginTop: 16,
  },

  col: {
    flex: 1,
    marginRight: 10,
  },

  input: {
    backgroundColor: "#1c1c1c",
    color: "white",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  sectionLabel: {
    color: "#bbb",
    marginTop: 14,
    marginBottom: 4,
  },
  textArea: {
    backgroundColor: "#1c1c1c",
    color: "white",
    borderRadius: 10,
    padding: 10,
    minHeight: 120,
  },
  input: {
    backgroundColor: "#1c1c1c",
    color: "white",
    borderRadius: 10,
    padding: 10,
  },
  saveBtn: {
    backgroundColor: "#0a84ff",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  saveBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: "#222",
    padding: 12,
    color: "white",
    borderRadius: 10,
    marginTop: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalCancel: {
    backgroundColor: "#555",
    padding: 12,
    width: "48%",
    borderRadius: 10,
    alignItems: "center",
  },
  modalSubmit: {
    backgroundColor: "#d9534f",
    padding: 12,
    width: "48%",
    borderRadius: 10,
    alignItems: "center",
  },
  modalBtnText: {
    color: "white",
    fontWeight: "600",
  },
});
