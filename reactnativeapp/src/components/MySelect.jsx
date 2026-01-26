import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const MySelect = ({ label, value, options = [], noDropdown, onChange }) => {
  const resolvedValue = (() => {
    if (!value) return "";
    if (typeof value === "number") return value;
    const match = options.find((o) => o.name === value);
    return match ? match.id : "";
  })();

  const displayText = (() => {
    const item = options.find((o) => o.id === resolvedValue);
    return item ? item.name : "N/A";
  })();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      {noDropdown ? (
        <View style={styles.readonly}>
          <Text style={styles.readonlyText}>{displayText}</Text>
        </View>
      ) : (
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={resolvedValue}
            onValueChange={(val) => onChange(val)}
            style={styles.picker}
            dropdownIconColor="white"
          >
            <Picker.Item label="Select" value="" />
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
  pickerBox: {
    backgroundColor: "#222",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    color: "white",
    width: "100%",
  },
  readonly: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 6,
  },
  readonlyText: { color: "white" },
});
