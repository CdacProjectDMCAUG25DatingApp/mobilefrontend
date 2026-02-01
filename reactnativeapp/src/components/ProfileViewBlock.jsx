import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import axios from "axios";
import config from "../services/config";

import PhotoInput from "./PhotoInput";
import MySelect from "./MySelect";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useSelector, useDispatch } from "react-redux";
import { setPhotos } from "../redux/photosSlice";
import { setUserDetails } from "../redux/userDetailsSlice";
import { updateUserDetails } from "../redux/userDetailsThunks";

export default function ProfileViewBlock({ dataObj, photos, editable, index }) {
  const dispatch = useDispatch();
  // Redux state
  const reduxDetails = useSelector((s) => s.userDetails.data);
  // Local state
  const [profile, setProfile] = useState({});
  const [original, setOriginal] = useState({});
  const [dirty, setDirty] = useState({});
  const [showDobPicker, setShowDobPicker] = useState(false);

  // Lookup lists
  const [lookups, setLookups] = useState({});

  const fieldFixMap = {
    job_industry: "job_industry_id",
    education: "education_id",
    religion: "religion_id",
    mother_tongue: "mother_tongue_id",
    love_style: "love_style_id",
    communication_style: "communication_style_id",
    personality_type: "personality_type_id",
    preferred_gender: "preferred_gender_id",
    looking_for: "looking_for_id",
    open_to: "open_to_id",
    family_plan: "family_plan_id",
    drinking: "drinking_id",
    smoking: "smoking_id",
    workout: "workout_id",
    dietary: "dietary_id",
    sleeping_habit: "sleeping_habit_id",
    zodiac: "zodiac_id",
    pet: "pet_id",
  };


  const apiEndpoints = {
    job_industry: "job-industry",
    looking_for: "lookingfor",
    love_style: "lovestyle",
    mother_tongue: "mother-tongue",
    family_plan: "familyplan",
    drinking: "drinking",
    education: "education",
    communication_style: "communicationstyle",
    open_to: "opento",
    personality_type: "personalitytype",
    pet: "pet",
    religion: "religion",
    sleeping_habit: "sleepingHabit",
    workout: "workout",
    zodiac: "zodiac",
    smoking: "smoking",
    dietary: "dietary",
    preferred_gender: "gender",
  };

  // ---------------- LOOKUPS LOAD ----------------
  useEffect(() => {
    (async () => {
      const token = await config.getToken("token");
      const headers = { token };

      const fetches = Object.values(apiEndpoints).map((e) =>
        axios.get(`${config.BASE_URL}/api/${e}`, { headers })
      );

      const results = await Promise.all(fetches);

      const mapped = {};
      Object.keys(apiEndpoints).forEach((key, i) => {
        mapped[key] = results[i].data.data;
      });

      setLookups(mapped);
    })();
  }, []);

  // ---------------- INIT MERGE ----------------
  useEffect(() => {
    if (!dataObj) return;

    const merged = {
      ...dataObj,
      image_prompt: photos?.[index]?.prompt || "",
    };

    setProfile(merged);
    setOriginal(merged);
    setDirty({});
  }, [dataObj, photos]);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (key, value) => {
    const finalKey = fieldFixMap[key] || key;

    setProfile((p) => ({ ...p, [finalKey]: value }));

    if (original[finalKey] !== value) {
      setDirty((d) => ({ ...d, [finalKey]: value }));
    } else {
      const copy = { ...dirty };
      delete copy[finalKey];
      setDirty(copy);
    }
  };


  // ---------------- SAVE SECTION -
  // ---------------
  const handleUpdate = async () => {
    if (!Object.keys(dirty).length) return;

    const token = await config.getToken("token");
    const headers = { token };

    const updatePayload = { ...dirty };
    const promptVal = updatePayload.image_prompt;
    delete updatePayload.image_prompt;

    try {
      // 1. Update prompt
      if (promptVal !== undefined && photos[index]?.photo_id) {
        await axios.patch(
          `${config.BASE_URL}/user/photo/prompt`,
          {
            photo_id: photos[index].photo_id,
            prompt: promptVal,
          },
          { headers }
        );

        dispatch(
          setPhotos(
            photos.map((p, i) =>
              i === index ? { ...p, prompt: promptVal } : p
            )
          )
        );
      }

      // 2. Update user details (merged API)
      if (Object.keys(updatePayload).length > 0) {
        await dispatch(updateUserDetails(updatePayload));
      }

      // 3. Merge into redux
      dispatch(
        setUserDetails({
          ...reduxDetails,
          ...profile,
        })
      );

      setOriginal(profile);
      setDirty({});
    } catch (err) {
      console.log("Error updating block:", err);
    }
  };

  // ---------------- UI RENDER ----------------
  return (
    <View style={styles.block}>
      {/* PHOTO */}
      <View style={styles.photoContainer}>
        <PhotoInput
          imageUrl={config.urlConverter(photos[index+1]?.photo_url)}
          disabled={!editable}
        />
      </View>

      {/* IMAGE PROMPT */}
      {(editable || profile.image_prompt) && (
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.label}>Image Prompt</Text>
          <TextInput
            editable={editable}
            style={styles.inputMultiline}
            multiline
            value={profile.image_prompt}
            onChangeText={(t) => handleChange("image_prompt", t)}
          />
        </View>
      )}

      {/* DYNAMIC FIELDS */}
      {Object.entries(profile)
        .filter(([key]) => key !== "image_prompt")
        .map(([key, value]) => {
          // DOB
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
                          : "Choose Date"}
                      </Text>
                    </TouchableOpacity>

                    {showDobPicker && (
                      <DateTimePicker
                        mode="date"
                        value={value ? new Date(value) : new Date()}
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

          // SELECT FIELDS
          if (lookups[key]) {
            return (
              <View key={key} style={styles.section}>
                <MySelect
                  label={key.replace(/_/g, " ")}
                  value={value}
                  options={lookups[key]}
                  noDropdown={!editable}
                  onChange={(v) => handleChange(key, v)}
                />
              </View>
            );
          }
        })}

      {/* ACTION BUTTONS */}
      {editable && Object.keys(dirty).length > 0 && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btn, styles.cancel]}
            onPress={() => {
              setProfile(original);
              setDirty({});
            }}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.save]}
            onPress={handleUpdate}
          >
            <Text style={styles.btnText}>Save Section</Text>
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#222",
  },
  photoContainer: {
    width: "100%",
    height: 420,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  section: { marginBottom: 18 },
  label: { color: "#aaa", marginBottom: 6, fontSize: 14 },
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
    minHeight: 110,
    borderRadius: 10,
    textAlignVertical: "top",
  },
  dateBox: {
    backgroundColor: "#1c1c1c",
    padding: 12,
    borderRadius: 10,
  },
  valueText: { color: "#ddd", fontSize: 15 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  btn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  cancel: { backgroundColor: "#444" },
  save: { backgroundColor: "#0a84ff" },
  btnText: { color: "white", fontWeight: "600" },
});
