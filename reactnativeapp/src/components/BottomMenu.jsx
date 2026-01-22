    import React from 'react';
    import { View, Text, TouchableOpacity } from 'react-native';
    import styles from '../styles/homeStyles';

    const menuItems = [
    'People',
    'Message',
    'Edit Profile',
    'Likes/Matched',
    'Settings',
    ];

    const BottomMenu = ({ active, setActive }) => {
    return (
        <View style={styles.bottomMenu}>
        {menuItems.map(item => (
            <TouchableOpacity
            key={item}
            style={[
                styles.menuButton,
                active === item && styles.menuButtonActive,
            ]}
            onPress={() => setActive(item)}
            >
            <Text
                style={[
                styles.menuText,
                active === item && styles.menuTextActive,
                ]}
            >
                {item}
            </Text>
            </TouchableOpacity>
        ))}
        </View>
    );
    };

    export default BottomMenu;
