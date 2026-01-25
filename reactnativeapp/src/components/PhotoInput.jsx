// src/components/PhotoInput.jsx
import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "react-native-image-picker";

const PhotoInput = ({ imageUrl, onChange }) => {
  const [preview, setPreview] = useState(imageUrl);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.8 },
      (response) => {
        if (response.didCancel || response.error) return;

        const img = response.assets[0];
        setPreview(img.uri);
        onChange && onChange(img);
      }
    );
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
  image: { width: "100%", height: "100%", borderRadius: 12 },
  text: { color: "#aaa" },
});
