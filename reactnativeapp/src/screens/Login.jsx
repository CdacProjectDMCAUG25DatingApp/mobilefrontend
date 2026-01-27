import React, { useState, useContext } from "react";
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
import axios from "axios";
import config from "../services/config";
import { UserContext } from "../context/UserContext";

const Login = ({ navigation }) => {
  const {
    setUser,
    setProfile,
    setPhotos,
    setPreferences,
    setUserDetails,
  } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      // 🔥 HIT LOGIN API
      const result = await loginUser(email, password);

      if (result.status !== "success") {
        Alert.alert("Login Failed", result.error);
        return;
      }

      // SAVE TOKEN IN STORAGE (use AsyncStorage)
      await AsyncStorage.setItem("token", result.data.token);

      // SET USER
      setUser({
        name: result.data.name,
        email: result.data.email,
        mobile: result.data.mobile,
      });

      Alert.alert("Success", "Login Successful");

      // HEADER WITH TOKEN
      const headers = { token: await AsyncStorage.getItem("token") };

      // FETCH USER DATA (DUPLICATE OF REACT LOGIC)
      const [profileRes, photosRes, prefRes, userDetailsRes] =
        await Promise.all([
          axios.get(config.BASE_URL + "/user/userprofile", { headers }),
          axios.get(config.BASE_URL + "/photos/userphotos", { headers }),
          axios.get(config.BASE_URL + "/user/userpreferences", { headers }),
          axios.get(config.BASE_URL + "/user/userdetails", { headers }),
        ]);
            
      setProfile(profileRes.data.data[0] || {});
      setPhotos(photosRes.data.data || []);
      setPreferences(prefRes.data.data[0] || {});
      setUserDetails(userDetailsRes.data.data[0] || {});

      // ONBOARDING NAVIGATION (MATCHES YOUR WEB LOGIC)
      if (!profileRes.data.data.length)
        return navigation.replace("CreateProfile");

      if (photosRes.data.data.length !== 6)
        return navigation.replace("AddPhotos");

      if (!prefRes.data.data.length)
        return navigation.replace("UserPreferencaes");

      // ALL SET → GO TO HOME
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
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
