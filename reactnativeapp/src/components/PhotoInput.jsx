import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const PhotoInput = ({ imageUrl, onChange }) => {
  const [preview, setPreview] = useState(imageUrl);

  const pickImage = async () => {
    // ask permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission needed to access gallery");
      return;
    }

    // open gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setPreview(img.uri);
      onChange && onChange(img); // send image object to parent
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.box}>
      {preview ? (
        <Image source={{ uri: preview }} style={styles.image} />
      ) : (
        <Text style={styles.text}>Select Image</Text>
      )}
    </TouchableOpacity>
  );
};

export default PhotoInput;

const styles = StyleSheet.create({
  box: {
    width: 260,
    height: 380,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  text: { color: "#aaa" },
});
