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

import { UserContext } from "../context/UserContext";
import PhotoInput from "../components/PhotoInput";
import MySelect from "../components/MySelect";
import ProfileViewBlock from "../components/ProfileViewBlock";
import config from "../services/config";
import axios from "axios";

const ProfileView = ({ editable, profileData }) => {
  const { userDetails, photos, setPhotos } = useContext(UserContext);

  const finalData = profileData?.candidateData || userDetails;
  const finalPhotos = profileData?.photos || photos;

  if (!finalData || !finalPhotos?.length) return null;

  const [genderList, setGenderList] = useState([]);
  const [profile, setProfile] = useState({});
  const [original, setOriginal] = useState({});
  const [dirty, setDirty] = useState({});

  // Fetch gender ONCE
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

  // Initialize only when gender list is ready
  useEffect(() => {
    if (!genderList.length) return;

    const merged = {
      ...finalData,
      image_prompt: finalPhotos[0]?.prompt || "",
    };

    // Convert gender NAME → ID
    if (typeof merged.gender === "string") {
      const found = genderList.find((g) => g.name === merged.gender);
      if (found) merged.gender = found.id;
    }

    setProfile(merged);
    setOriginal(merged);
    setDirty({});
  }, [finalData, genderList]);

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

  const profileFields = [
    "bio", "height", "weight", "gender", "tagline",
    "dob", "marital_status", "location", "mother_tongue",
    "religion", "education", "job_industry_id",
  ];

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

  const handleUpdate = async () => {
    if (!Object.keys(dirty).length) return;

    const token = await config.getToken("token");
    const headers = { token };

    const p1 = {};
    const p2 = {};

    Object.entries(dirty).forEach(([k, v]) => {
      if (profileFields.includes(k)) p1[k] = v;
      else if (prefMap[k]) p2[prefMap[k]] = v;
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

          <View style={styles.row}>
            {["height", "weight"].map((f) => (
              <View key={f} style={styles.col}>
                <Text style={styles.sectionLabel}>{f}</Text>
                <TextInput
                  style={styles.input}
                  value={profile[f] ? String(profile[f]) : ""}
                  editable={editable}
                  onChangeText={(t) => handleChange(f, t)}
                />
              </View>
            ))}

            <View style={styles.col}>
              <MySelect
                label="Gender"
                value={profile.gender}
                options={genderList}
                noDropdown={!editable}
                onChange={(id) => handleChange("gender", id)}
              />
            </View>
          </View>

          {(editable || profile.image_prompt) && (
            <>
              <Text style={styles.sectionLabel}>Image Prompt</Text>
              <TextInput
                multiline
                style={styles.textArea}
                value={profile.image_prompt}
                editable={editable}
                onChangeText={(t) => handleChange("image_prompt", t)}
              />
            </>
          )}

          {editable && Object.keys(dirty).length > 0 && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => {
                  setProfile(original);
                  setDirty({});
                }}
                style={[styles.actionBtn, styles.cancelBtn]}
              >
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdate}
                style={[styles.actionBtn, styles.updateBtn]}
              >
                <Text style={styles.actionText}>Update</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* REPEATED BLOCKS */}
      <ProfileViewBlock
        dataObj={{
          dob: profile.dob,
          location: profile.location,
          mother_tongue: profile.mother_tongue,
          religion: profile.religion,
        }}
        photos={finalPhotos}
        editable={editable}
        index={1}
      />

      <ProfileViewBlock
        dataObj={{
          education: profile.education,
          job_industry: profile.job_industry,
          looking_for: profile.looking_for,
          open_to: profile.open_to,
        }}
        photos={finalPhotos}
        editable={editable}
        index={2}
      />

      <ProfileViewBlock
        dataObj={{
          drinking: profile.drinking,
          smoking: profile.smoking,
          workout: profile.workout,
          dietary: profile.dietary,
          sleeping_habit: profile.sleeping_habit,
        }}
        photos={finalPhotos}
        editable={editable}
        index={3}
      />

      <ProfileViewBlock
        dataObj={{
          love_style: profile.love_style,
          communication_style: profile.communication_style,
          family_plan: profile.family_plan,
          personality_type: profile.personality_type,
          pet: profile.pet,
          zodiac: profile.zodiac,
          preferred_gender: profile.preferred_gender,
        }}
        photos={finalPhotos}
        editable={editable}
        index={4}
      />

    </ScrollView>
  );
};

export default ProfileView;

// styles unchanged
const styles = StyleSheet.create({

  pageContainer: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 10,   // reduce top padding
    paddingBottom: 80,
  },



  mainCard: {
    backgroundColor: "#121212",
    padding: 18,
    borderRadius: 14,
    marginBottom: 26,
    borderColor: "#222",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
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
    textTransform: "capitalize",
  },

  input: {
    backgroundColor: "#1d1d1d",
    color: "white",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
  },

  textArea: {
    backgroundColor: "#1d1d1d",
    color: "white",
    padding: 12,
    borderRadius: 10,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },

  col: {
    flex: 1,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#444",
  },

  updateBtn: {
    backgroundColor: "#28a745",
  },

  actionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  cardBody: {
    paddingHorizontal: 4,
  },

});