import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import MySelect from "./MySelect";  
import axios from "axios";
import config from "../services/config";
import Toast from "react-native-toast-message";

function ReportModal({ visible, onClose, reportReasons, reportedToken, styles }) {
  const [reason, setReason] = useState(null);
  const [customReason, setCustomReason] = useState("");

  const submit = async () => {
    if (!reason) {
      Toast.show({ type: "error", text1: "Select a reason" });
      return;
    }

    try {
      const token = await config.getToken("token");

      await axios.post(
        config.BASE_URL + "/settings/report",
        {
          reported_id: reportedToken,
          reason_id: reason,
          reason_custom: reason == 99 ? customReason : null,
        },
        { headers: { token } }
      );

      Toast.show({ type: "success", text1: "User Reported" });

      // reset and close modal
      setReason(null);
      setCustomReason("");
      onClose();
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to report user" });
    }
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      style={styles.modalOverlay}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.modalBox}>

        <Text style={styles.modalTitle}>Report User</Text>

        <MySelect
          label="Reason"
          value={reason}
          options={reportReasons.map(r => ({
            id: r.reason_id,
            name: r.name,
          }))}
          onChange={setReason}
        />

        {reason == 99 && (
          <TextInput
            style={styles.modalInput}
            placeholder="Enter custom reason..."
            placeholderTextColor="#777"
            value={customReason}
            onChangeText={setCustomReason}
          />
        )}

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={onClose}
          >
            <Text style={styles.modalBtnTxt}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalSubmit}
            onPress={submit}
          >
            <Text style={styles.modalBtnTxt}>Submit</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

export default React.memo(ReportModal);
