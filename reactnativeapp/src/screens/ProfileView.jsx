// src/screens/ProfileView.jsx

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

import { UserContext } from "../context/UserContext";
import PhotoInput from "../components/PhotoInput";
import MySelect from "../components/MySelect";
import ProfileViewBlock from "../components/ProfileViewBlock";
import config from "../services/config";
import axios from "axios";

const ProfileView = ({ editable, profileData, showMenu, onBack }) => {
  const [reportVisible, setReportVisible] = useState(false);
  const [reason, setReason] = useState(null);
  const [customReason, setCustomReason] = useState("");

  const { userDetails, photos, setPhotos } = useContext(UserContext);

  const finalData = profileData?.candidateData || userDetails;
  const finalPhotos = profileData?.photos || photos;

  if (!finalData || !finalPhotos?.length) return null;

  const [genderList, setGenderList] = useState([]);
  const [profile, setProfile] = useState({});
  const [original, setOriginal] = useState({});
  const [dirty, setDirty] = useState({});

  // Fetch Gender
  useEffect(() => {
    const init = async () => {
      const token = await config.getToken("token");
      const r = await axios.get(config.BASE_URL + "/api/gender", {
        headers: { token },
      });
      setGenderList(r.data.data);
    };
    init();
  }, []);

  // Load profile data
  useEffect(() => {
    if (!genderList.length) return;

    const merged = {
      ...finalData,
      image_prompt: finalPhotos[0]?.prompt || "",
    };

    if (typeof merged.gender === "string") {
      const found = genderList.find((g) => g.name === merged.gender);
      if (found) merged.gender = found.id;
    }

    setProfile(merged);
    setOriginal(merged);
    setDirty({});
  }, [finalData, genderList]);

  // Submit Report API
  const submitReport = async () => {
    if (!reason) return;

    const token = await config.getToken("token");
    await axios.post(
      config.BASE_URL + "/settings/report",
      {
        reported_id: finalData?.id,
        reason_id: reason,
        reason_custom: reason === 99 ? customReason : null,
      },
      { headers: { token } }
    );

    setReportVisible(false);
    setReason(null);
    setCustomReason("");
  };

  // Block API
  const blockUser = async () => {
    const token = await config.getToken("token");

    await axios.post(
      config.BASE_URL + "/user/block",
      { blocked_id: finalData?.id },
      { headers: { token } }
    );
  };

  // Handle Inputs
  const handleChange = (key, val) => {
    setProfile((p) => ({ ...p, [key]: val }));

    if (original[key] !== val) {
      setDirty((d) => ({ ...d, [key]: val }));
    } else {
      const copy = { ...dirty };
      delete copy[key];
      setDirty(copy);
    }
  };

  // SAVE Update API
  const handleUpdate = async () => {
    if (!Object.keys(dirty).length) return;

    const token = await config.getToken("token");
    const headers = { token };

    const fields = [
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
      preferred_gender: "preferred_gender_id",
      open_to: "open_to_id",
      zodiac: "zodiac_id",
      family_plan: "family_plan_id",
      education: "education_id",
      communication_style: "communication_style_id",
      love_style: "love_style_id",
      drinking: "drinking_id",
      smoking: "smoking_id",
      workout: "workout_id",
      dietary: "dietary_id",
      sleeping_habit: "sleeping_habit_id",
      religion: "religion_id",
      personality_type: "personality_type_id",
      pet: "pet_id",
    };

    const p1 = {};
    const p2 = {};

    Object.entries(dirty).forEach(([key, val]) => {
      if (fields.includes(key)) p1[key] = val;
      else if (prefMap[key]) p2[prefMap[key]] = val;
    });

    if (Object.keys(p1).length)
      await axios.patch(config.BASE_URL + "/user/profile", p1, { headers });

    if (Object.keys(p2).length)
      await axios.patch(config.BASE_URL + "/user/userdetails", p2, { headers });

    if (dirty.image_prompt !== undefined) {
      await axios.patch(
        config.BASE_URL + "/user/photo/prompt",
        {
          photo_id: finalPhotos[0]?.photo_id,
          prompt: dirty.image_prompt,
        },
        { headers }
      );

      setPhotos((prev) => {
        const arr = [...prev];
        arr[0] = { ...arr[0], prompt: dirty.image_prompt };
        return arr;
      });
    }

    setOriginal(profile);
    setDirty({});
  };

  return (
    <View style={{ flex: 1 }}>

      {/* ⭐ TOP ACTION BAR ⭐ */}
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={onBack} style={styles.actionBtnWrap}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        {showMenu && (
          <Menu>
            <MenuTrigger>
              <View style={styles.actionBtnWrap}>
                <Ionicons name="ellipsis-vertical" size={28} color="white" />
              </View>
            </MenuTrigger>

            <MenuOptions customStyles={menuStyles}>

              <MenuOption
                onSelect={() => setReportVisible(true)}
                text="Report"
              />
              <MenuOption
                onSelect={blockUser}
                text="Block"
              />

            </MenuOptions>
          </Menu>
        )}
      </View>

      {/* MAIN CONTENT */}
      <ScrollView style={styles.pageContainer}>
        <View style={styles.mainCard}>
          <View style={styles.heroPhoto}>
            <PhotoInput imageUrl={config.urlConverter(finalPhotos[0]?.photo_url)} />
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.name}>{profile.user_name}</Text>
            <Text style={styles.tagline}>{profile.tagline}</Text>

            <Text style={styles.sectionLabel}>Bio</Text>
            <TextInput
              value={profile.bio || ""}
              style={styles.textArea}
              editable={editable}
              onChangeText={(t) => handleChange("bio", t)}
            />
          </View>
        </View>
      </ScrollView>

      {/* REPORT MODAL */}
      {reportVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Report User</Text>

            <MySelect
              label="Reason"
              value={reason}
              options={[
                { id: 1, name: "Fake Profile" },
                { id: 2, name: "Inappropriate Photos" },
                { id: 3, name: "Harassment" },
                { id: 4, name: "Spam or Scam" },
                { id: 99, name: "Other" },
              ]}
              onChange={setReason}
            />

            {reason === 99 && (
              <TextInput
                placeholder="Enter other reason..."
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
        </View>
      )}
    </View>
  );
};

export default ProfileView;

// ================== STYLES ===================
const styles = StyleSheet.create({
  actionBar: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#000",
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    zIndex: 50,
  },
  actionBtnWrap: {
    padding: 6,
  },

  pageContainer: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 80,
  },

  mainCard: {
    backgroundColor: "#121212",
    padding: 18,
    borderRadius: 14,
    marginBottom: 26,
    borderColor: "#222",
    borderWidth: 1,
  },

  heroPhoto: {
    width: "100%",
    height: 420,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#1c1c1c",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },

  tagline: {
    color: "#bbb",
    fontStyle: "italic",
    marginBottom: 16,
  },

  sectionLabel: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 6,
  },

  textArea: {
    backgroundColor: "#1d1d1d",
    color: "white",
    padding: 12,
    borderRadius: 10,
    minHeight: 120,
    marginBottom: 18,
    textAlignVertical: "top",
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
    backgroundColor: "#444",
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

// CUSTOM POPUP MENU STYLE
const menuStyles = {
  optionsContainer: {
    backgroundColor: "#1c1c1c",
    borderColor: "#444",
    borderWidth: 1,
    padding: 5,
    width: 140,
  },
  optionText: {
    color: "white",
    padding: 10,
    fontSize: 16,
  },
};
