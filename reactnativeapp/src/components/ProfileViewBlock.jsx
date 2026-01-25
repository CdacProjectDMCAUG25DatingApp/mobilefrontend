// src/components/ProfileViewBlock.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import axios from "axios";
import config from "../services/config";
import MySelect from "./MySelect";
import PhotoInput from "./PhotoInput";
import DatePicker from "react-native-date-picker";
import { UserContext } from "../context/UserContext";

const ProfileViewBlock = ({ dataObj, photos, editable, index }) => {
  const { setPhotos, setUserDetails } = useContext(UserContext);

  const [profile, setProfile] = useState({});
  const [original, setOriginal] = useState({});
  const [dirty, setDirty] = useState({});
  const [showDobPicker, setShowDobPicker] = useState(false);

  const endpoints = [
    "job-industry", "lookingfor", "lovestyle", "mother-tongue", "familyplan",
    "drinking", "education", "communicationstyle", "opento",
    "personalitytype", "pet", "religion", "sleepingHabit",
    "workout", "zodiac", "smoking", "dietary", "gender",
  ];

  const [lookups, setLookups] = useState({});

  // Load dropdowns ONCE
  useEffect(() => {
    const load = async () => {
      const token = await config.getToken("token");
      const headers = { token };

      const reqs = endpoints.map((e) =>
        axios.get(`${config.BASE_URL}/api/${e}`, { headers })
      );

      const res = await Promise.all(reqs);

      const map = {};
      endpoints.forEach((e, i) => (map[e] = res[i].data.data));

      setLookups(map);
    };

    load();
  }, []);

  // Map keys
  const dropdownMap = {
    job_industry: lookups["job-industry"],
    looking_for: lookups["lookingfor"],
    love_style: lookups["lovestyle"],
    mother_tongue: lookups["mother-tongue"],
    family_plan: lookups["familyplan"],
    drinking: lookups["drinking"],
    education: lookups["education"],
    communication_style: lookups["communicationstyle"],
    open_to: lookups["opento"],
    personality_type: lookups["personalitytype"],
    pet: lookups["pet"],
    religion: lookups["religion"],
    sleeping_habit: lookups["sleepingHabit"],
    workout: lookups["workout"],
    zodiac: lookups["zodiac"],
    smoking: lookups["smoking"],
    dietary: lookups["dietary"],
    preferred_gender: lookups["gender"],
  };

  // Init block when lookups ready
  useEffect(() => {
    const merged = {
      ...dataObj,
      image_prompt: photos?.[index]?.prompt || "",
    };

    // name → id conversion
    Object.entries(dropdownMap).forEach(([key, list]) => {
      if (list && typeof merged[key] === "string") {
        const found = list.find((i) => i.name === merged[key]);
        if (found) merged[key] = found.id;
      }
    });

    setProfile(merged);
    setOriginal(merged);
    setDirty({});
  }, [dataObj, photos, lookups]);

  const handleChange = (key, v) => {
    setProfile((p) => ({ ...p, [key]: v }));

    if (original[key] !== v) {
      setDirty((d) => ({ ...d, [key]: v }));
    } else {
      const c = { ...dirty };
      delete c[key];
      setDirty(c);
    }
  };

  const updateSection = async () => {
    if (!Object.keys(dirty).length) return;

    const token = await config.getToken("token");
    const headers = { token };

    const profileFields = [
      "bio", "height", "weight", "gender", "tagline",
      "dob", "marital_status", "location",
      "mother_tongue", "religion", "education",
      "job_industry_id",
    ];

    const p1 = {};
    const p2 = {};

    Object.entries(dirty).forEach(([k, v]) => {
      if (profileFields.includes(k)) p1[k] = v;
      else p2[k] = v;
    });

    if (Object.keys(p1).length)
      await axios.patch(`${config.BASE_URL}/user/profile`, p1, { headers });

    if (Object.keys(p2).length)
      await axios.patch(`${config.BASE_URL}/user/userdetails`, p2, { headers });

    if (dirty.image_prompt !== undefined) {
      await axios.patch(
        `${config.BASE_URL}/user/photo/prompt`,
        {
          photo_id: photos[index].photo_id,
          prompt: dirty.image_prompt,
        },
        { headers }
      );

      setPhotos((prev) => {
        const arr = [...prev];
        arr[index] = { ...arr[index], prompt: dirty.image_prompt };
        return arr;
      });
    }

    setUserDetails((prev) => ({ ...prev, ...dirty }));
    setOriginal(profile);
    setDirty({});
  };

  return (
    <View style={styles.blockContainer}>
      <View style={styles.photoCard}>
        <PhotoInput imageUrl={config.urlConverter(photos?.[index]?.photo_url)} />
      </View>

      {(editable || profile.image_prompt) && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Image Prompt</Text>
          <TextInput
            multiline
            style={styles.textArea}
            value={profile.image_prompt}
            editable={editable}
            onChangeText={(t) => handleChange("image_prompt", t)}
          />
        </View>
      )}

      {Object.entries(profile)
        .filter(([k]) => k !== "image_prompt")
        .map(([k, v]) => {
          if (k === "dob")
            return (
              <View key={k} style={styles.section}>
                <Text style={styles.sectionLabel}>Date of Birth</Text>
                {editable ? (
                  <>
                    <TouchableOpacity
                      onPress={() => setShowDobPicker(true)}
                      style={styles.selectorBox}
                    >
                      <Text style={styles.selectorText}>
                        {v ? new Date(v).toDateString() : "Select Date"}
                      </Text>
                    </TouchableOpacity>

                    <DatePicker
                      modal
                      open={showDobPicker}
                      date={v ? new Date(v) : new Date()}
                      mode="date"
                      onConfirm={(d) => {
                        setShowDobPicker(false);
                        handleChange("dob", d.toISOString());
                      }}
                      onCancel={() => setShowDobPicker(false)}
                    />
                  </>
                ) : (
                  <Text style={styles.readonlyText}>
                    {v ? new Date(v).toDateString() : "Not Set"}
                  </Text>
                )}
              </View>
            );

          if (dropdownMap[k])
            return (
              <View key={k} style={styles.section}>
                <MySelect
                  label={k.replace(/_/g, " ")}
                  value={v}
                  options={dropdownMap[k]}
                  noDropdown={!editable}
                  onChange={(id) => handleChange(k, id)}
                />
              </View>
            );

          return (
            <View key={k} style={styles.section}>
              <Text style={styles.sectionLabel}>{k.replace(/_/g, " ")}</Text>
              <TextInput
                style={styles.input}
                value={v || ""}
                editable={editable}
                onChangeText={(t) => handleChange(k, t)}
              />
            </View>
          );
        })}

      {editable && Object.keys(dirty).length > 0 && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              setProfile(original);
              setDirty({});
            }}
          >
            <Text style={styles.actionText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.updateButton]}
            onPress={updateSection}
          >
            <Text style={styles.actionText}>Update</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileViewBlock;

// styles unchanged

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  blockContainer: {
    backgroundColor: "#121212",
    padding: 18,
    borderRadius: 14,
    marginBottom: 26,
    borderColor: "#222",
    borderWidth: 1,
  },

  photoCard: {
    width: "100%",
    height: 420,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
  },

  section: {
    marginBottom: 18,
  },

  sectionLabel: {
    color: "#bbb",
    marginBottom: 6,
    fontSize: 14,
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
  },

  readonlyText: {
    color: "#ddd",
    fontSize: 15,
    paddingVertical: 8,
  },

  selectorBox: {
    backgroundColor: "#1d1d1d",
    padding: 12,
    borderRadius: 10,
  },

  selectorText: {
    color: "white",
    fontSize: 15,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },

  cancelButton: {
    backgroundColor: "#444",
  },

  updateButton: {
    backgroundColor: "#28a745",
  },

  actionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
