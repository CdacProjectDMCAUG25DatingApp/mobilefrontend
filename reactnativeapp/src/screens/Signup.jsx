import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { registerUser } from '../services/user';
import styles from '../styles/homeStyles';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const signup = async () => {
    if (!name || !email || !password || !mobile) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const result = await registerUser(name, email, password, mobile);

    if (result.status === 'success') {
      Alert.alert('Success', 'Signup Successful');
      navigation.navigate('Login');
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        {/* Name */}
        <Text style={styles.authLabel}>Name</Text>
        <TextInput
          style={styles.authInput}
          placeholder="name"
          placeholderTextColor="#777"
          onChangeText={setName}
        />

        {/* Email */}
        <Text style={styles.authLabel}>Email address</Text>
        <TextInput
          style={styles.authInput}
          placeholder="name@example.com"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
        />

        {/* Password */}
        <Text style={styles.authLabel}>Password</Text>
        <TextInput
          style={styles.authInput}
          placeholder="password"
          placeholderTextColor="#777"
          secureTextEntry
          onChangeText={setPassword}
        />

        {/* Helper */}
        <Text style={styles.authHelperText}>
          Your password must be 8-20 characters long, contain letters and numbers,
          and must not contain spaces, special characters, or emoji.
        </Text>

        {/* Phone */}
        <Text style={styles.authLabel}>Phone</Text>
        <TextInput
          style={styles.authInput}
          placeholder="9999999999"
          placeholderTextColor="#777"
          keyboardType="phone-pad"
          onChangeText={setMobile}
        />

        {/* Signup Button */}
        <TouchableOpacity style={styles.authButton} onPress={signup}>
          <Text style={styles.authButtonText}>Signup</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.authLinkRow}>
          <Text style={styles.authLinkText}>Have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.authLink}> Click Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;
