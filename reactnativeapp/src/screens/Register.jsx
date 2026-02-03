import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StyleSheet } from "react-native";
import { registerUser } from '../services/user';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email))
      newErrors.email = "Invalid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!phone) newErrors.phone = "Phone number required";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Phone must be 10 digits";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validate();
  }, [name, email, password, phone]);

  const signup = async () => {
    validate();
    if (!isValid) return;

    const result = await registerUser(name, email, password, phone);

    if (result.status === "success") {
      alert("Account created successfully!");
      navigation.navigate("Login");
      return;
    }

    if (result.error?.sqlMessage?.includes("email")) {
      setErrors(prev => ({ ...prev, email: "Email already registered" }));
      return;
    }
    if (result.error?.sqlMessage?.includes("phone_number")) {
      setErrors(prev => ({ ...prev, phone: "Phone number already registered" }));
      return;
    }

    alert(result.error || "Signup failed");

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Find your perfect match ❤️</Text>

      {/* NAME */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={[styles.input, errors.name && styles.errorInput]}
        placeholder="Enter your name"
        placeholderTextColor="#777"
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* EMAIL */}
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={[styles.input, errors.email && styles.errorInput]}
        placeholder="Enter your email"
        placeholderTextColor="#777"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* PASSWORD */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Minimum 8 characters"
        placeholderTextColor="#777"
        secureTextEntry
        onChangeText={setPassword}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* PHONE */}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={[styles.input, errors.phone && styles.errorInput]}
        placeholder="Enter your phone"
        placeholderTextColor="#777"
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={signup}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* LOGIN LINK */}
      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

export default Signup;


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    padding: 24,
    paddingTop: 70,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
  },

  subtitle: {
    color: "#aaa",
    marginTop: 6,
    marginBottom: 30,
    fontSize: 16,
  },

  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },

  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#1a1a1a",
    color: "white",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },

  errorInput: {
    borderColor: "#ffb1ad",
  },

  errorText: {
    color: "#ffb1ad",
    fontSize: 13,
    marginTop: 4,
  },

  button: {
    backgroundColor: "#0a84ff",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 30,
  },

  buttonDisabled: {
    backgroundColor: "#444",
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#888",
  },

  loginLink: {
    color: "#0a84ff",
    fontWeight: "700",
  },
});
