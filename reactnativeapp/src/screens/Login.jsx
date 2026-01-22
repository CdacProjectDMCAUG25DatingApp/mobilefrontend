    import React from 'react';
    import { View, Text, TextInput, TouchableOpacity } from 'react-native';
    import styles from '../styles/authStyles';

    const Login = ({ navigation }) => {
    return (
        <View style={styles.container}>
        <Text style={styles.label}>Email address</Text>

        <TextInput
            style={styles.input}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry={true}   // ✅ boolean
        />

        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Signin</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Click Here</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
    };

    export default Login;
