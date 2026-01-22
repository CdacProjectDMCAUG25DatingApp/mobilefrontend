    import React, { useState } from 'react';
    import { View } from 'react-native';

    import SwipeCard from '../components/SwipeCard';
    import BottomMenu from '../components/BottomMenu';
    import SettingsPanel from '../components/SettingsPanel';
    import EditProfilePanel from '../components/EditProfilePanel';
    import styles from '../styles/homeStyles';

    const Home = () => {
    const [active, setActive] = useState('People');

    return (
        <View style={styles.container}>
        {active === 'People' && <SwipeCard />}
        {active === 'Settings' && <SettingsPanel />}
        {active === 'Edit Profile' && <EditProfilePanel />}

        <BottomMenu active={active} setActive={setActive} />
        </View>
    );
    };

    export default Home;
