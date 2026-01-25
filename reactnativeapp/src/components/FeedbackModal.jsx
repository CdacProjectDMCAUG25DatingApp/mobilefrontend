import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../services/config";

export default function FeedbackModal({ visible, onClose }) {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await axios.post(
        `${config.BASE_URL}/settings/send-feedback`,
        { subject, details },
        { headers: { token } }
      );

      if (res.data.status === "success") {
        Alert.alert("Success", res.data.data);
        onClose();
      } else {
        Alert.alert("Error", res.data.error);
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Submit Feedback</Text>

          <TextInput
            style={styles.input}
            placeholder="Subject"
            placeholderTextColor="#666"
            value={subject}
            onChangeText={setSubject}
          />

          <TextInput
            style={[styles.input, { height: 110 }]}
            placeholder="Enter feedback…"
            placeholderTextColor="#666"
            value={details}
            onChangeText={setDetails}
            multiline
          />

          <TouchableOpacity style={styles.actionBtn} onPress={handleSubmit}>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 350,
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 25,
    borderWidth: 2,
    borderColor: "white",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#000",
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: "white",
    marginBottom: 15,
  },
  actionBtn: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: "#444",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  closeText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});
