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
import LikeCard from "../components/LikeCard";

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

      // Update UI instantly
      setBlockedUsers((p) => p.filter((u) => u.blocked_id !== uid));
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
            <ScrollView style={{ maxHeight: 450 }}>
              {blockedUsers.map((u) => (
                <LikeCard
                  key={u.block_id}
                  user={u}
                  showRemove={true}
                  onRemove={() => unblockUser(u.blocked_id)}
                />
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
    width: "88%",
    backgroundColor: "#151515",
    padding: 18,
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
  closeBtn: {
    marginTop: 15,
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
