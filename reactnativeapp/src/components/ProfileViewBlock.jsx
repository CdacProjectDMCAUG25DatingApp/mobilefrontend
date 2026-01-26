// src/components/ProfileViewBlock.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import axios from "axios";
import config from "../services/config";
import MySelect from "./MySelect";
import PhotoInput from "./PhotoInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserContext } from "../context/UserContext";

export default function ProfileViewBlock({ dataObj, photos, editable, index }) {
  const { setPhotos, setUserDetails } = useContext(UserContext);

  const [profile, setProfile] = useState({});
  const [original, setOriginal] = useState({});
  const [dirty, setDirty] = useState({});
  const [showDobPicker, setShowDobPicker] = useState(false);

  /* ---------------- LOOKUPS ---------------- */

  const endpoints = [
    "job-industry",
    "lookingfor",
    "lovestyle",
    "mother-tongue",
    "familyplan",
    "drinking",
    "education",
    "communicationstyle",
    "opento",
    "personalitytype",
    "pet",
    "religion",
    "sleepingHabit",
    "workout",
    "zodiac",
    "smoking",
    "dietary",
    "gender",
  ];

  const [lookups, setLookups] = useState({});

  useEffect(() => {
    (async () => {
      const token = await config.getToken("token");
      const headers = { token };

      const req = endpoints.map((e) =>
        axios.get(`${config.BASE_URL}/api/${e}`, { headers })
      );

      const res = await Promise.all(req);

      const map = {};
      endpoints.forEach((e, i) => (map[e] = res[i].data.data));

      setLookups(map);
    })();
  }, []);

  /* ------------ KEY → LOOKUP MAPPING ---------- */

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


  /* ---------------- INIT MERGE ---------------- */

  useEffect(() => {
    if (!dataObj) return;

    const merged = {
      ...dataObj,
      image_prompt: photos?.[index]?.prompt || "",
    };

    setOriginal(merged);
    setProfile(merged);
    setDirty({});
  }, [dataObj, photos, lookups]);

  /* ---------------- HANDLE CHANGE ---------------- */

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

  /* ---------------- UPDATE SECTION ---------------- */

  const updateSection = async () => {
    if (!Object.keys(dirty).length) return;

    const token = await config.getToken("token");
    const headers = { token };

    const basicProfileKeys = [
      "bio",
      "height",
      "weight",
      "gender",
      "tagline",
      "dob",
      "marital_status",
      "location",
      "mother_tongue_id",
      "religion_id",
      "education_id",
      "job_industry_id",
    ];

    const personalKeys = Object.keys(dirty).filter(
      (k) => !basicProfileKeys.includes(k)
    );

    const mainProfilePayload = {};
    const detailsPayload = {};

    Object.entries(dirty).forEach(([k, v]) => {
      if (basicProfileKeys.includes(k)) {
        mainProfilePayload[k] = v;
      } else {
        detailsPayload[k] = v;
      }
    });

    if (Object.keys(mainProfilePayload).length)
      await axios.patch(`${config.BASE_URL}/user/profile`, mainProfilePayload, {
        headers,
      });

    if (Object.keys(detailsPayload).length)
      await axios.patch(`${config.BASE_URL}/user/userdetails`, detailsPayload, {
        headers,
      });

    // Update image prompt separately
    if (dirty.image_prompt !== undefined && photos?.[index]?.photo_id) {
      await axios.patch(
        `${config.BASE_URL}/user/photo/prompt`,
        {
          photo_id: photos[index].photo_id,
          prompt: dirty.image_prompt,
        },
        { headers }
      );

      // update context
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

  /* ---------------- UI RENDER ---------------- */

  return (
    <View style={styles.block}>
      {/* PHOTO */}
      <View style={styles.photoBox}>
        <PhotoInput
          imageUrl={config.urlConverter(photos?.[index]?.photo_url)}
          editable={false}
        />
      </View>

      {/* IMAGE PROMPT */}
      {(editable || profile.image_prompt) && (
        <View style={styles.section}>
          <Text style={styles.label}>Image Prompt</Text>
          <TextInput
            style={styles.inputMultiline}
            multiline
            editable={editable}
            value={profile.image_prompt}
            onChangeText={(t) => handleChange("image_prompt", t)}
          />
        </View>
      )}

      {/* ALL OTHER FIELDS */}
      {Object.entries(profile)
        .filter(([key]) => key !== "image_prompt")
        .map(([key, value]) => {
          /* DOB FIELD */
          if (key === "dob") {
            return (
              <View key={key} style={styles.section}>
                <Text style={styles.label}>Date of Birth</Text>

                {editable ? (
                  <>
                    <TouchableOpacity
                      style={styles.dateBox}
                      onPress={() => setShowDobPicker(true)}
                    >
                      <Text style={styles.valueText}>
                        {value
                          ? new Date(value).toDateString()
                          : "Select Date"}
                      </Text>
                    </TouchableOpacity>

                    {showDobPicker && (
                      <DateTimePicker
                        value={value ? new Date(value) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(e, d) => {
                          setShowDobPicker(false);
                          if (d) handleChange("dob", d.toISOString().slice(0, 10));
                        }}
                      />
                    )}
                  </>
                ) : (
                  <Text style={styles.valueText}>
                    {value ? new Date(value).toDateString() : "Not set"}
                  </Text>
                )}
              </View>
            );
          }

          /* DROPDOWN FIELDS */
          if (dropdownMap[key]) {
            return (
              <View key={key} style={styles.section}>
                <MySelect
                  label={key.replace(/_/g, " ").replace("id", "")}
                  value={value}
                  options={dropdownMap[key]}
                  noDropdown={!editable}
                  onChange={(v) => handleChange(key, v)}
                />
              </View>
            );
          }

          /* NORMAL TEXT FIELD */
          return (
            <View key={key} style={styles.section}>
              <Text style={styles.label}>{key.replace(/_/g, " ")}</Text>
              <TextInput
                style={styles.input}
                editable={editable}
                value={value?.toString() || ""}
                onChangeText={(t) => handleChange(key, t)}
              />
            </View>
          );
        })}

      {/* ACTION BUTTONS */}
      {editable && Object.keys(dirty).length > 0 && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            onPress={() => {
              setProfile(original);
              setDirty({});
            }}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.updateBtn]}
            onPress={updateSection}
          >
            <Text style={styles.btnText}>Update</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  block: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 14,
    marginBottom: 25,
    borderColor: "#222",
    borderWidth: 1,
  },

  photoBox: {
    width: "100%",
    height: 420,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#1c1c1c",

    justifyContent: "center",   // centers vertically
    alignItems: "center",       // centers horizontally
  },


  section: {
    marginBottom: 20,
  },

  label: {
    color: "#888",
    marginBottom: 5,
    fontSize: 14,
  },

  input: {
    backgroundColor: "#1c1c1c",
    color: "white",
    padding: 12,
    borderRadius: 10,
  },

  inputMultiline: {
    backgroundColor: "#1c1c1c",
    color: "white",
    padding: 12,
    borderRadius: 10,
    minHeight: 120,
    textAlignVertical: "top",
  },

  dateBox: {
    backgroundColor: "#1c1c1c",
    padding: 12,
    borderRadius: 10,
  },

  valueText: {
    color: "#ddd",
    fontSize: 15,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  btn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },

  cancelBtn: {
    backgroundColor: "#444",
  },

  updateBtn: {
    backgroundColor: "#28a745",
  },

  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
