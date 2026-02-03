import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

import ChangePasswordModal from "../components/ChangePasswordModal";
import FeedbackModal from "../components/FeedbackModal";
import BlockedUsersModal from "../components/BlockedUsersModal";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { logout } from "../redux/userSlice";

export default function Settings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false); 

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert("Logged Out", "You have been logged out", [
      {
        text: "OK",
        onPress: () =>
          dispatch(logout())
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setShowPasswordModal(true)}
        >
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setShowFeedbackModal(true)}
        >
          <Text style={styles.optionText}>Feedback</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.option}
          onPress={() => setShowBlockedModal(true)}
        >
          <Text style={styles.optionText}>Blocked Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logout}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </View>

      {/* MODALS */}
      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />


      <BlockedUsersModal
        visible={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 55,
    paddingHorizontal: 18,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 26,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 14,
  },

  card: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#222",
    gap: 14,
  },

  option: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },

  optionText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },

  logout: {
    backgroundColor: "rgba(255,0,0,0.12)",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    marginTop: 8,
  },

  logoutText: {
    color: "#ff4d4d",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "600",
  },
});
