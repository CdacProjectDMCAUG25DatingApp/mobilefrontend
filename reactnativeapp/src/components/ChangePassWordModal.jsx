    import React from 'react';
    import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
    import styles from '../styles/homeStyles';

    const ChangePasswordModal = ({ visible, onClose }) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
                placeholder="Old Password"
                placeholderTextColor="#777"
                secureTextEntry
                style={styles.modalInput}
            />

            <TextInput
                placeholder="New Password"
                placeholderTextColor="#777"
                secureTextEntry
                style={styles.modalInput}
            />

            <TouchableOpacity style={styles.modalPrimaryBtn}>
                <Text style={styles.modalPrimaryText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={onClose}>
                <Text style={styles.modalSecondaryText}>Close</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    );
    };

    export default ChangePasswordModal;
