import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { addPhotos } from "../../services/addphotos";
import config from "../../services/config";

const placeholder = require("../../../assets/preload.jpg");

export default function AddPhotos({ navigation }) {
  const [img, setImg] = useState({
    img0: null,
    img1: null,
    img2: null,
    img3: null,
    img4: null,
    img5: null,
  });

  const pickImage = async (index) => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission needed to select images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.9,
      aspect: index === 0 ? undefined : [3, 5], // DP = free crop, Others = 300×500 ratio
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const imgData = result.assets[0];

      setImg((prev) => ({
        ...prev,
        [`img${index}`]: imgData,
      }));
    }
  };

  const upload = async () => {
    const response = await addPhotos(img);

    if (!response) {
      Toast.show({ type: "error", text1: "Server Down" });
      return;
    }

    if (response.status === "success") {
      Toast.show({ type: "success", text1: "Photos Added" });

      const token = await AsyncStorage.getItem("token");
      const headers = { token };

      const prefRes = await axios.get(
        config.BASE_URL + "/user/userpreferences",
        { headers }
      );

      if (!prefRes.data.data.length)
        return navigation.replace("UserPreferencaes");

      navigation.replace("Home");
    } else {
      Toast.show({ type: "error", text1: "Upload failed" });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Your Photos</Text>

      <View style={styles.grid}>
        {Array.from({ length: 6 }, (_, id) => (
          <TouchableOpacity
            key={id}
            onPress={() => pickImage(id)}
            style={[
              styles.box,
              id === 0 ? styles.dpCircle : styles.rectBox,
            ]}
          >
            <Image
              source={img[`img${id}`]?.uri ? { uri: img[`img${id}`].uri } : placeholder}
              style={id === 0 ? styles.dpImg : styles.rectImg}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.uploadBtn} onPress={upload}>
        <Text style={styles.uploadText}>Upload</Text>
      </TouchableOpacity>

      <Toast />
    </ScrollView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },

  /* DP (first image) */
  dpCircle: {
    width: 150,
    height: 150,
    borderRadius: 150,
    overflow: "hidden",
  },

  dpImg: {
    width: "100%",
    height: "100%",
    borderRadius: 150,
  },

  /* Other 5 rectangular images */
  rectBox: {
    width: 150,
    height: 250, // scaled 300×500 ratio
    overflow: "hidden",
    borderRadius: 12,
  },

  rectImg: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  uploadBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 30,
  },

  uploadText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
});
