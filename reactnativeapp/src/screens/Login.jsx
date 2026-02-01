import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/homeStyles";

import { loginUser } from "../services/user";
import { useDispatch } from 'react-redux';
import { setUser } from "../redux/userSlice";
import { setPhotos } from "../redux/photosSlice";
import { setUserDetails } from "../redux/userDetailsSlice";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const result = await loginUser(email, password);

      if (result.status !== "success") {
        Alert.alert("Login Failed", result.error);
        return;
      }

      const { token, userdetails, photos, onboarding, name, email: e, mobile } = result.data;

      // Save token
      await AsyncStorage.setItem("token", token);

      dispatch(setUser({ token, name, email: e, mobile }));
      dispatch(setUserDetails(userdetails || {}));
      dispatch(setPhotos(photos || []));

      Alert.alert("Success", "Login Successful");

      if (onboarding.needs_profile)
        return navigation.replace("CreateProfile");

      if (onboarding.needs_photos)
        return navigation.replace("AddPhotos");

      if (onboarding.needs_preferences)
        return navigation.replace("UserPreferences");  

    } catch (ex) {
      console.log("Login error:", ex);
      Alert.alert("Error", "Something went wrong");
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginLabel}>Email address</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="name@example.com"
          placeholderTextColor="#777"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.loginLabel}>Password</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={signin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.loginLinkRow}>
          <Text style={styles.loginLinkText}>Don’t have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.loginLink}> Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
