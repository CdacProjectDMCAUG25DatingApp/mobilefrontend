import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

const PhotoInput = ({ imageUrl, onUploaded, disabled, photo_id }) => {
  const [preview, setPreview] = useState(imageUrl);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    console.log("📌 PhotoInput tapped!");

    if (disabled) {
      console.log("⚠ Disabled");
      return;
    }

    // Ask permission
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("📌 Permission:", perm);

    if (!perm.granted) {
      Alert.alert("Permission Required", "Allow gallery access.");
      return;
    }

    console.log("📌 Opening gallery…");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Image],
      allowsEditing: true,
      aspect: [3, 5],
      quality: 1,
    });

    console.log("📌 Picker Result:", result);

    if (result.canceled) return;

    const img = result.assets[0];

    if (img.fileSize && img.fileSize > 5 * 1024 * 1024) {
      return Alert.alert("Too Large", "Image must be below 5MB.");
    }

    const manipulated = await ImageManipulator.manipulateAsync({
      uri: img.uri,
      actions: [{ resize: { width: 300, height: 500 } }],
      compress: 0.85,
      format: ImageManipulator.SaveFormat.WEBP,
    });

    setPreview(manipulated.uri);
    uploadToServer(manipulated);
  };

  const uploadToServer = async (manipulated) => {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("photo_id", photo_id);
      form.append("photo", {
        uri: manipulated.uri,
        name: `${photo_id}-${Date.now()}.webp`,
        type: "image/webp",
      });

      const res = await axios.put("http://YOUR_SERVER/replace", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: sessionStorage.getItem("token"),
        },
      });

      setLoading(false);
      onUploaded && onUploaded(res.data?.data?.new_url);
    } catch (err) {
      setLoading(false);
      console.log("UPLOAD ERROR:", err);
      Alert.alert("Upload failed", "Try again.");
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      style={[styles.box, disabled && { opacity: 0.5 }]}
      activeOpacity={0.6}
    >
      {preview ? (
        <Image source={{ uri: preview }} style={styles.image} />
      ) : (
        <Text style={styles.text}>Select Image</Text>
      )}

      {loading && (
        <Text style={{ color: "white", marginTop: 8 }}>Uploading...</Text>
      )}
    </TouchableOpacity>
  );
};

export default PhotoInput;

const styles = StyleSheet.create({
  box: {
    width: 260,
    height: 380,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  text: {
    color: "#aaa",
  },
});
