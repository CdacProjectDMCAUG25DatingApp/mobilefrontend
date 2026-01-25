import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../services/config";

export default function ChangePasswordModal({ visible, onClose }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await axios.put(
        `${config.BASE_URL}/settings/change-password`,
        { oldPassword: oldPass, newPassword: newPass },
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
          <Text style={styles.title}>Change Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Old Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={oldPass}
            onChangeText={setOldPass}
          />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={newPass}
            onChangeText={setNewPass}
          />

          <TouchableOpacity style={styles.actionBtn} onPress={handleSubmit}>
            <Text style={styles.actionText}>Update</Text>
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
    width: 330,
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
