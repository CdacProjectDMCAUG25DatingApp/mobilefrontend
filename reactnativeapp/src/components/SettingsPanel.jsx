    import React, { useState } from 'react';
    import { View, Text, TouchableOpacity } from 'react-native';
    import styles from '../styles/homeStyles';

    import ChangePasswordModal from './ChangePassWordModal';
    import FeedbackModal from './FeedbackModal';

    const SettingsPanel = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    return (
        <View style={styles.settingsContainer}>
        <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Settings</Text>
        </View>

        <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowPassword(true)}
        >
            <Text style={styles.settingsText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowFeedback(true)}
        >
            <Text style={styles.settingsText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* MODALS */}
        <ChangePasswordModal
            visible={showPassword}
            onClose={() => setShowPassword(false)}
        />

        <FeedbackModal
            visible={showFeedback}
            onClose={() => setShowFeedback(false)}
        />
        </View>
    );
    };

    export default SettingsPanel;
