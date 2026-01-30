import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const MySelect = ({ label, value, options = [], noDropdown, onChange }) => {
  const [iosOpen, setIosOpen] = useState(false);

  const stringValue = value !== undefined && value !== null
    ? String(value)
    : "";

  const stringOptions = options.map((o) => ({
    id: String(o.id),
    name: o.name,
  }));

  // Display text
  const selectedLabel =
    stringOptions.find((o) => o.id === stringValue)?.name || "Select";

  // -----------------------------
  // iOS Picker UI
  // -----------------------------
  const renderIOSPicker = () => (
    <Modal transparent animationType="slide" visible={iosOpen}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => setIosOpen(false)}
          >
            <Text style={styles.doneTxt}>Done</Text>
          </TouchableOpacity>

          <Picker
            selectedValue={stringValue}
            onValueChange={(val) => onChange(val)} // return string
          >
            <Picker.Item label="Select" value="" />
            {stringOptions.map((opt) => (
              <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
            ))}
          </Picker>
        </View>
      </View>
    </Modal>
  );

  // -----------------------------
  // READONLY MODE
  // -----------------------------
  if (noDropdown) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyTxt}>{selectedLabel}</Text>
        </View>
      </View>
    );
  }

  // -----------------------------
  // ANDROID — native Picker
  // -----------------------------
  if (Platform.OS === "android") {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.androidPickerBox}>
          <Picker
            selectedValue={stringValue}
            dropdownIconColor="white"
            style={styles.androidPicker}
            onValueChange={(val) => onChange(val)}
          >
            <Picker.Item label="Select" value="" />
            {stringOptions.map((opt) => (
              <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  // -----------------------------
  // iOS
  // -----------------------------
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.iosSelector}
        onPress={() => setIosOpen(true)}
      >
        <Text style={styles.iosText}>{selectedLabel}</Text>
      </TouchableOpacity>

      {renderIOSPicker()}
    </View>
  );
};

export default MySelect;

const styles = StyleSheet.create({
  wrapper: { marginBottom: 18 },
  label: { color: "#aaa", marginBottom: 6, fontSize: 14 },

  // Readonly
  readonlyBox: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
  },
  readonlyTxt: { color: "white" },

  // ANDROID
  androidPickerBox: {
    backgroundColor: "#222",
    borderRadius: 8,
    overflow: "hidden",
  },
  androidPicker: {
    color: "white",
    height: 50,
    width: "100%",
  },

  // iOS Selector
  iosSelector: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
  },
  iosText: { color: "white" },

  // iOS Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
  },
  doneBtn: {
    padding: 12,
    alignItems: "flex-end",
  },
  doneTxt: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
