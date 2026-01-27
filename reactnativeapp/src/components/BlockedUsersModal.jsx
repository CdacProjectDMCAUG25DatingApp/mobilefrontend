import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import axios from "axios";
import config from "../services/config";

export default function BlockedUsersModal({ visible, onClose }) {
  const [loading, setLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Fetch blocked users
  const loadBlockedUsers = async () => {
    setLoading(true);
    try {
      const token = await config.getToken("token");
      const r = await axios.get(config.BASE_URL + "/settings/blocked-list", {
        headers: { token },
      });
      setBlockedUsers(r.data.data || []);
    } catch (err) {
      console.log("Blocked list error:", err);
    }
    setLoading(false);
  };

  // Unblock user
  const unblockUser = async (uid) => {
    try {
      const token = await config.getToken("token");
      await axios.delete(config.BASE_URL + `/settings/unblock/${uid}`, {
        headers: { token },
      });

      // Refresh list
      loadBlockedUsers();
    } catch (err) {
      console.log("Unblock error:", err);
    }
  };

  useEffect(() => {
    if (visible) loadBlockedUsers();
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Blocked Users</Text>

          {loading ? (
            <ActivityIndicator color="#fff" size="large" style={{ marginTop: 20 }} />
          ) : blockedUsers.length === 0 ? (
            <Text style={styles.empty}>No blocked users</Text>
          ) : (
            <ScrollView style={{ maxHeight: 300 }}>
              {blockedUsers.map((user) => (
                <View key={user.block_id} style={styles.userRow}>
                  <Text style={styles.userName}>{user.user_name}</Text>

                  <TouchableOpacity
                    style={styles.unblockBtn}
                    onPress={() => unblockUser(user.blocked_id)}
                  >
                    <Text style={styles.unblockText}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "#151515",
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
    textAlign: "center",
  },
  empty: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 30,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  userName: {
    color: "#fff",
    fontSize: 16,
  },
  unblockBtn: {
    backgroundColor: "#d9534f",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  unblockText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  closeBtn: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#444",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
