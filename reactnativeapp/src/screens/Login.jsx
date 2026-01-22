    import React, { useState } from 'react';
    import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    } from 'react-native';

    import styles from '../styles/homeStyles';
    import { loginUser } from '../services/user';

    const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signin = async () => {
        // 🔹 UI stays same, only logic added
        if (!email || !password) {
        Alert.alert('Error', 'All fields are required');
        return;
        }

        console.log('📡 Calling backend login API');

        const result = await loginUser(email, password);
        console.log('📡 Login response:', result);

        if (result.status === 'success') {
        Alert.alert('Success', 'Login Successful');

        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
        } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
        }
    };

    return (
        <View style={styles.container}>
        <View style={styles.loginContainer}>
            {/* Email */}
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

            {/* Password */}
            <Text style={styles.loginLabel}>Password</Text>
            <TextInput
            style={styles.loginInput}
            placeholder="password"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            />

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={signin}>
            <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.loginLinkRow}>
            <Text style={styles.loginLinkText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.loginLink}> Signup</Text>
            </TouchableOpacity>
            </View>
        </View>
        </View>
    );
    };

    export default Login;
