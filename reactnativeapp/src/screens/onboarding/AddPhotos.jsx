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
import axios from "axios";

import { addPhotos } from "../../services/addphotos";
import config from "../../services/config";

const placeholder = require("../../../assets/preload.jpg");

export default function AddPhotos({ navigation, route }) {
  const { token } = route.params;

  const [img, setImg] = useState({
    img0: null,
    img1: null,
    img2: null,
    img3: null,
    img4: null,
    img5: null,
  });

  const pickImage = async (index) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission required");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: index === 0 ? undefined : [3, 5],
      quality: 0.9,
    });

    if (!res.canceled) {
      setImg((prev) => ({
        ...prev,
        [`img${index}`]: res.assets[0],
      }));
    }
  };

  const upload = async () => {
    const result = await addPhotos(img, token);
    if (!result) return Toast.show({ type: "error", text1: "Server Down" });

    const headers = { token };

    if (result.status === "success") {
      Toast.show({ type: "success", text1: "Photos Added" });

      const prefs = await axios.get(
        config.BASE_URL + "/user/userpreferences",
        { headers }
      );

      if (!prefs.data.data.length)
        return navigation.replace("UserPreferences", { token });

      navigation.replace("People", { token });
    } else {
      Toast.show({ type: "error", text1: "Upload failed" });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Your Photos</Text>

      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, id) => (
          <TouchableOpacity
            key={id}
            onPress={() => pickImage(id)}
            activeOpacity={0.7}
            style={id === 0 ? styles.dpContainer : styles.rectContainer}
          >
            <Image
              source={img[`img${id}`] ? { uri: img[`img${id}`].uri } : placeholder}
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

/* ------------ STYLES (Restored Old UI) ------------ */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 90,
    backgroundColor: "#f2f2f2",
    flexGrow: 1,
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#000",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },

  /* DP ROUND IMAGE */
  dpContainer: {
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 18,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dpImg: {
    width: "100%",
    height: "100%",
    borderRadius: 150,
  },

  /* OTHER 5 IMAGES */
  rectContainer: {
    width: "47%",
    height: "300",
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },

  rectImg: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    resizeMode: "cover",
  },

  uploadBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
  },

  uploadText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
