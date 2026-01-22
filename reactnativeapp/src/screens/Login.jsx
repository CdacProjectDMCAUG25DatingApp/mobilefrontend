    import React from 'react';
    import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    } from 'react-native';

    import styles from '../styles/authStyles';

    const Login = ({ navigation }) => {
    const signin = () => {
        navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
        });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.label}>Email address</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={signin}>
            <Text style={styles.buttonText}>Signin</Text>
        </TouchableOpacity>
        </View>
    );
    };

    export default Login;
