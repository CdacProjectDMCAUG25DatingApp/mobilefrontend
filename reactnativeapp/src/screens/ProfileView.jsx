import { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import {
  Menu,
  MenuOptions,
  MenuTrigger,
  MenuOption,
} from "react-native-popup-menu";

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import config from "../services/config";
import Toast from "react-native-toast-message";

import { useSelector, useDispatch } from "react-redux";

import PhotoInput from "../components/PhotoInput";
import MySelect from "../components/MySelect";
import ProfileViewBlock from "../components/ProfileViewBlock";
import ReportModal from "../components/ReportModal";

import { setPhotos } from "../redux/photosSlice";
import { setUserDetails } from "../redux/userDetailsSlice";
import { updateUserDetails } from "../redux/userDetailsThunks";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProfileView = ({ editable: componentEditable, profileData: componentData, photos: componentPhotos }) => {
  const route = useRoute();
  const params = route.params || {};

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isEditable = componentEditable ?? params.propEditable ?? false;

  // Redux data
  const reduxUser = useSelector(state => state.userDetails.data);
  const finalData = componentData ?? params.profileData ?? reduxUser;
  console.log(finalData)
  const reduxPhotos = useSelector(state => state.photos.data);
  const finalPhotos = componentPhotos ?? params.photos ?? reduxPhotos;
  if (!finalData || finalPhotos.length === 0) return null;




  // ---------------------------------------------------------
  // LOCAL STATE
  // ---------------------------------------------------------
  const [genderList, setGenderList] = useState([]);
  const [reportReasons, setReportReasons] = useState([]);

  const [profile, setProfile] = useState({});
  const [original, setOriginal] = useState({});
  const [dirty, setDirty] = useState({});

  const [reportVisible, setReportVisible] = useState(false);


  // ---------------------------------------------------------
  // LOAD INITIAL API DATA
  // ---------------------------------------------------------
  useEffect(() => {
    (async () => {
      const token = await config.getToken("token");
      const headers = { token };

      const [gendersRes, reasonsRes] = await Promise.all([
        axios.get(config.BASE_URL + "/api/gender", { headers }),
        axios.get(config.BASE_URL + "/api/report-reasons", { headers })
      ]);

      setGenderList(gendersRes.data.data);
      setReportReasons(reasonsRes.data.data);
    })();
  }, []);

  //Block User
  const handleBlock = async () => {
    try {
      const token = await config.getToken("token");
      await axios.post(
        config.BASE_URL + "/settings/block",
        { blocked_id: finalData?.token },
        { headers: { token } }
      );
      Toast.show({ type: "success", text1: "User Blocked" });
    } catch (err) {
      console.log("Block failed:", err?.response?.data || err);
      Toast.show({ type: "error", text1: "Failed to block user" });
    }
  };

  // ---------------------------------------------------------
  // INITIALIZE PROFILE
  // ---------------------------------------------------------
  useEffect(() => {
    setProfile(prev => ({
      ...finalData,
      image_prompt: finalPhotos?.[0]?.prompt || "",
    }));
    setOriginal({
      ...finalData,
      image_prompt: finalPhotos?.[0]?.prompt || "",
    });
    setDirty({});
  }, [finalData, finalPhotos]);


  // ---------------------------------------------------------
  // CHANGE HANDLER
  // ---------------------------------------------------------
  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));

    if (original[field] !== value) {
      setDirty(prev => ({ ...prev, [field]: value }));
    } else {
      setDirty(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // ---------------------------------------------------------
  // SAVE HANDLER
  // ---------------------------------------------------------
  const handleUpdate = async () => {
    if (!Object.keys(dirty).length) return;

    const token = await config.getToken("token");
    const headers = { token };

    const payload = { ...dirty };
    const promptVal = payload.image_prompt;
    delete payload.image_prompt;

    try {
      if (Object.keys(payload).length) {
        await dispatch(updateUserDetails(payload));
      }

      if (promptVal !== undefined) {
        await axios.patch(
          config.BASE_URL + "/photos/prompt",
          {
            photo_id: finalPhotos[1].photo_id,
            prompt: promptVal,
          },
          { headers }
        );

        dispatch(
          setPhotos(
            finalPhotos.map((p, idx) =>
              idx === 0 ? { ...p, prompt: promptVal } : p
            )
          )
        );
      }

      dispatch(setUserDetails({ ...finalData, ...dirty }));
      setOriginal(profile);
      setDirty({});

      Toast.show({ type: "success", text1: "Profile Updated" });

    } catch (err) {
      Toast.show({ type: "error", text1: "Update failed" });
    }
  };

  const handleCancel = () => {
    setProfile(original);
    setDirty({});
  };

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

  // ---------------------------------------------------------
  // PROFILE BLOCK GROUPS
  // ---------------------------------------------------------
  const blocks = useMemo(() => [
    {
      dob: finalData.dob,
      location: finalData.location,
      mother_tongue: finalData.mother_tongue,
      religion: finalData.religion_id,
    },
    {
      education: finalData.education_id,
      job_industry: finalData.job_industry_id,
      looking_for: finalData.looking_for_id,
      open_to: finalData.open_to_id,
    },
    {
      drinking: finalData.drinking_id,
      smoking: finalData.smoking_id,
      workout: finalData.workout_id,
      dietary: finalData.dietary_id,
      sleeping_habit: finalData.sleeping_habit_id,
    },
    {
      love_style: finalData.love_style_id,
      communication_style: finalData.communication_style_id,
      family_plan: finalData.family_plan_id,
      personality_type: finalData.personality_type_id,
      pet: finalData.pet_id,
      zodiac: finalData.zodiac_id,
      preferred_gender: finalData.preferred_gender_id,
    },
  ], [finalData]);

  const mainPhoto = useMemo(() => {
    return config.urlConverter(finalPhotos[1]?.photo_url);
  }, [finalPhotos]);


  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <View style={styles.pageContainer}>

      {/* HEADER */}
      {!isEditable && (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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

      <ScrollView style={styles.container}>

        {/* MAIN CARD */}
        <View style={styles.card}>
          <View style={styles.photoContainer}>
            <PhotoInput
              imageUrl={mainPhoto}
              disabled={!isEditable}
            />
          </View>

          <Text style={styles.name}>{finalData.user_name}</Text>
          <Text style={styles.tagline}>{finalData.tagline}</Text>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.textArea}
            editable={isEditable}
            value={profile.bio || ""}
            onChangeText={v => handleChange("bio", v)}
          />

          {/* HEIGHT / WEIGHT / GENDER */}
          <View style={styles.row}>

            <View style={styles.col}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.height?.toString() || ""}
                editable={isEditable}
                onChangeText={v => handleChange("height", v)}
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Weight</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.weight?.toString() || ""}
                editable={isEditable}
                onChangeText={v => handleChange("weight", v)}
              />
            </View>

            <View style={styles.col}>
              <MySelect
                label="Gender"
                value={profile.gender}
                options={genderList}
                noDropdown={!isEditable}
                onChange={v => handleChange("gender", v)}
              />
            </View>
          </View>

          {(isEditable || profile.image_prompt) && (
            <>
              <Text style={styles.label}>Image Prompt</Text>
              <TextInput
                style={styles.textArea}
                editable={isEditable}
                value={profile.image_prompt}
                onChangeText={v => handleChange("image_prompt", v)}
              />
            </>
          )}

          {isEditable && Object.keys(dirty).length > 0 && (
            <View style={styles.saveRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <Text style={styles.saveTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        {/* PROFILE BLOCKS */}
        {blocks.map((grp, i) => (
          <ProfileViewBlock
            key={i}
            dataObj={grp}
            photos={finalPhotos}
            editable={isEditable}
            index={Math.min(i + 1, finalPhotos.length - 1)}
            reverse={i % 2 === 1}
          />
        ))}

      </ScrollView>

      {/* REPORT MODAL */}
      {reportVisible && (
        <ReportModal
          visible={reportVisible}
          onClose={() => setReportVisible(false)}
          reportReasons={reportReasons}
          reportedToken={finalData?.token}
          styles={styles}
        />
      )}

    </View>
  );
};

export default ProfileView;


/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  actionBar: {
    marginTop: 30,
    height: 60,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  pageContainer: {
    flex: 1, backgroundColor: "#000"
  },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30,
  },

  photoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  name: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 14,
  },
  tagline: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    color: "#bbb",
    marginTop: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1c1c1c",
    padding: 10,
    borderRadius: 10,
    color: "white",
    minHeight: 44,
    justifyContent: 'center',
  },
  textArea: {
    backgroundColor: "#1c1c1c",
    color: "white",
    minHeight: 120,
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  col: {
    flex: 1,
  },
  saveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 10,
    width: "45%",
  },
  cancelTxt: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#0a84ff",
    padding: 12,
    borderRadius: 10,
    width: "45%",
  },
  saveTxt: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    marginBottom: 12,
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
    marginTop: 16,
  },
  modalCancel: {
    backgroundColor: "#555",
    width: "48%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalSubmit: {
    backgroundColor: "#d9534f",
    width: "48%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalBtnTxt: {
    color: "white",
    fontWeight: "600",
  },
});
