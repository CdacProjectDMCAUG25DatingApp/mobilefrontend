    import React from 'react';
    import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    } from 'react-native';
    import styles from '../styles/homeStyles';

    const FeedbackModal = ({ visible, onClose }) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Submit Feedback</Text>

            <TextInput
                placeholder="Subject"
                placeholderTextColor="#777"
                style={styles.modalInput}
            />

            <TextInput
                placeholder="Enter feedback..."
                placeholderTextColor="#777"
                style={[styles.modalInput, styles.modalTextarea]}
                multiline
            />

            <TouchableOpacity style={styles.modalPrimaryBtn}>
                <Text style={styles.modalPrimaryText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={onClose}>
                <Text style={styles.modalSecondaryText}>Close</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    );
    };

    export default FeedbackModal;
