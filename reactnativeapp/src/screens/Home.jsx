    import React from 'react';
    import { View } from 'react-native';
    import ProfileCard from '../components/ProfileCard';
    import styles from '../styles/homeStyles';

    const Home = () => {
    return (
        <View style={styles.container}>
        <ProfileCard />
        </View>
    );
    };

    export default Home;
