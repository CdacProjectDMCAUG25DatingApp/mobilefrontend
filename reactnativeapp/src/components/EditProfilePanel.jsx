    import React from 'react';
    import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    } from 'react-native';
    import styles from '../styles/homeStyles';

    const EditProfilePanel = () => {
    return (
        <ScrollView
        style={styles.editWrapper}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        >

        {/* ===== IMAGE PREVIEW CARD ===== */}
        <View style={styles.previewCard}>
            <Image
            source={require('../../assets/photo1.jpg')}
            style={styles.previewImage}
            />
        </View>

        {/* ===== BASIC INFO ===== */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Info</Text>

            <TextInput style={styles.input} placeholder="Bio" placeholderTextColor="#aaa" multiline />
            <TextInput style={styles.input} placeholder="Height" placeholderTextColor="#aaa" />
            <TextInput style={styles.input} placeholder="Weight" placeholderTextColor="#aaa" />

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Gender</Text>
            </TouchableOpacity>
        </View>

        {/* ===== PERSONAL DETAILS ===== */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Religion</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Mother Tongue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Marital Status</Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Date of Birth" placeholderTextColor="#aaa" />
            <TextInput style={styles.input} placeholder="Location" placeholderTextColor="#aaa" />
        </View>

        {/* ===== EDUCATION & WORK ===== */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Work</Text>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Education</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Job Industry</Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Job Title" placeholderTextColor="#aaa" />
        </View>

        {/* ===== PREFERENCES ===== */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Looking For</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Open To</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Preferred Gender</Text>
            </TouchableOpacity>
        </View>

        {/* ===== LIFESTYLE ===== */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Drinking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Smoking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Dietary</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Sleeping Habit</Text>
            </TouchableOpacity>
        </View>

        {/* ===== SAVE BUTTON ===== */}
        <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        </ScrollView>
    );
    };

    export default EditProfilePanel;
