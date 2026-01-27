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
  const [showIOSPicker, setShowIOSPicker] = useState(false);

  const resolvedValue = (() => {
    if (!value) return "";
    if (typeof value === "number") return value;
    const match = options.find((o) => o.name === value);
    return match ? match.id : "";
  })();

  const displayText = (() => {
    const item = options.find((o) => o.id === resolvedValue);
    return item ? item.name : "Select";
  })();

  const renderIOSPicker = () => (
    <Modal transparent animationType="slide" visible={showIOSPicker}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setShowIOSPicker(false)}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>

          <Picker
            selectedValue={resolvedValue}
            onValueChange={(val) => onChange(val)}
          >
            {!value && <Picker.Item label="Select" value="" />}
            {options.map((opt) => (
              <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
            ))}
          </Picker>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      {noDropdown ? (
        <View style={styles.readonly}>
          <Text style={styles.readonlyText}>{displayText}</Text>
        </View>
      ) : Platform.OS === "ios" ? (
        <>
          <TouchableOpacity
            onPress={() => setShowIOSPicker(true)}
            style={styles.iosSelector}
          >
            <Text style={styles.iosSelectorText}>{displayText}</Text>
          </TouchableOpacity>

          {showIOSPicker && renderIOSPicker()}
        </>
      ) : (
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={resolvedValue}
            onValueChange={(val) => onChange(val)}
            style={styles.picker}
            dropdownIconColor="white"
          >
            {!value && <Picker.Item label="Select" value="" />}
            {options.map((opt) => (
              <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
};

export default MySelect;

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { color: "#bbb", marginBottom: 6, fontSize: 13 },

  // ANDROID Picker Box
  pickerBox: {
    backgroundColor: "#222",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    color: "white",
    width: "100%",
  },

  // READONLY
  readonly: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 6,
  },
  readonlyText: { color: "white" },

  // iOS Touchable Selector
  iosSelector: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 6,
  },
  iosSelectorText: {
    color: "white",
  },

  // iOS Modal
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  doneButton: {
    alignItems: "flex-end",
    padding: 12,
  },
  doneText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
