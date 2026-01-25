// src/components/MySelect.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const MySelect = ({ label, value, options = [], noDropdown, onChange }) => {
  const resolvedValue = (() => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "number") return value;
    const match = options.find((o) => o.name === value);
    return match ? match.id : "";
  })();

  const displayValue = (() => {
    const item = options.find((o) => o.id === resolvedValue);
    return item ? item.name : "N/A";
  })();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      {noDropdown ? (
        <View style={styles.readonly}>
          <Text style={styles.readonlyText}>{displayValue}</Text>
        </View>
      ) : (
        <View style={styles.pickerBox}>
          <Picker
            style={styles.picker}
            selectedValue={resolvedValue}
            dropdownIconColor="white"
            onValueChange={(val) => onChange(Number(val))}
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
  pickerBox: { backgroundColor: "#222", borderRadius: 6 },
  picker: { color: "white" },
  readonly: { backgroundColor: "#222", padding: 12, borderRadius: 6 },
  readonlyText: { color: "white" },
});
