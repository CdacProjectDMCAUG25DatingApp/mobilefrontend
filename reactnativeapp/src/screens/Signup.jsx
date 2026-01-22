import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView
} from 'react-native';
import { registerUser } from '../services/user';
import styles from '../styles/authStyles';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const signup = async () => {
    if (!name || !email || !password || !phone) {
      alert('All fields are required');
      return;
    }

    const result = await registerUser(name, email, password, phone);

    if (result.status === 'success') {
      alert('Signup Successful');
      navigation.navigate('Login');
    } else {
      alert(result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} onChangeText={setName} />

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Text style={styles.helperText}>
        Your password must be 8-20 characters long, contain letters and numbers.
      </Text>

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={signup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text>Have an account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Click Here</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signup;
