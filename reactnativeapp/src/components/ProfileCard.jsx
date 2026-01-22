    import React from 'react';
    import { View, Text, Image } from 'react-native';
    import styles from '../styles/homeStyles';

    const ProfileCard = () => {
    return (
        <View style={styles.card}>
        <Image
            source={require('../../assets/profile-bg.jpg')} // put image here
            style={styles.image}
        />

        <View style={styles.overlay}>
            <Text style={styles.name}>Test5</Text>
            <Text style={styles.subtitle}>Doctor</Text>
        </View>

        <View style={styles.infoBox}>
            <Text style={styles.infoText}>
            0 • Prefer Not to Say • Maharashtra
            </Text>
            <Text style={styles.infoText}>
            Match Score 24 • Shares 4 interests
            </Text>
        </View>
        </View>
    );
    };

    export default ProfileCard;
