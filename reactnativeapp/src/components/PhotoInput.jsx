import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import config from "../services/config";

export default function PhotoInput({
  imageUrl,
  onPicked,          // for AddPhotos
  onUploaded,        // optional callback
  onReplaceSuccess,  // for ProfileView & ProfileViewBlock
  disabled,
  photo_id,
  mode = "add",
  isDP,
  placeholder,
}) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load existing image
  useEffect(() => {
    if (!imageUrl) return;

    if (typeof imageUrl === "string") setPreview(imageUrl);
    else if (imageUrl?.uri) setPreview(imageUrl.uri);
  }, [imageUrl]);

  // Pick Image
  const pickImage = async () => {
    if (disabled) return;

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted)
      return Alert.alert("Permission Required", "Allow gallery access.");

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: isDP ? undefined : [3, 5],
      quality: 1,
    });

    if (result.canceled) return;

    const img = result.assets[0];
    setPreview(img.uri);

    if (mode === "add") {
      onPicked && onPicked(img);
      return;
    }

    if (mode === "replace") {
      uploadToServer(img);
    }
  };

  // Upload new photo in replace mode
  const uploadToServer = async (fileObj) => {
    try {
      setLoading(true);

      const token = await config.getToken("token");
      const form = new FormData();

      form.append("photo_id", photo_id);
      form.append("photo", {
        uri: fileObj.uri,
        name: `${photo_id}-${Date.now()}.webp`,
        type: "image/webp",
      });

      const res = await axios.put(config.BASE_URL + "/photos/replace", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      setLoading(false);

      if (res.data?.data?.new_url) {
        const newURL = config.urlConverter(res.data.data.new_url);

        setPreview(newURL);
        onUploaded && onUploaded(newURL);

        //  trigger redux reload
        onReplaceSuccess && onReplaceSuccess();
      }
    } catch (err) {
      setLoading(false);
      console.log("UPLOAD ERROR =>", err);
      Alert.alert("Upload Failed", "Try again.");
    }
  };

  const getSource = () => {
    if (!preview) return placeholder;
    return { uri: preview };
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      style={styles.box}
    >
      {preview ? (
        <Image source={getSource()} style={styles.image} />
      ) : (
        <Text style={styles.text}>Select Image</Text>
      )}

      {loading && (
        <ActivityIndicator size="small" color="#fff" style={{ marginTop: 8 }} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 260,
    height: 380,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
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
