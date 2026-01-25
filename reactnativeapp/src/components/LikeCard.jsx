import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from "react-native";
import config from "../services/config";

export default function LikeCard({
    user,
    showLikeBack,
    showMessage,
    showRemove,
    onLikeBack,
    onIgnore,
    onChat,
    onRemove,
    onCardClick,
}) {
    const calculateAge = (dob) => {
        const birth = new Date(dob);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
        return age;
    };

    const age = calculateAge(user.dob);

    return (
        <Pressable
            style={styles.card}
            onPress={() => onCardClick && onCardClick(user)}
        >
            {/* LEFT SIDE - IMAGE + INFO */}
            <View style={styles.leftRow}>
                <Image
                    source={{ uri: config.urlConverter(user.photo_url) }}
                    style={styles.profilePic}
                />

                <View style={styles.textCol}>
                    <Text style={styles.name}>{user.user_name}</Text>

                    {onChat ? (
                        <Text style={styles.subText}>Last Message: {user.last_message}</Text>
                    ) : (
                        <Text style={styles.subText}>
                            {age} · {user.gender}
                        </Text>
                    )}

                    <Text style={styles.tagline}>{user.tagline}</Text>
                </View>
            </View>

            {/* RIGHT SIDE - BUTTONS */}
            <View style={styles.btnCol}>
                {showLikeBack && (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnPrimary]}
                        onPress={() => onLikeBack(user.token)}
                    >
                        <Text style={styles.btnText}>Like Back</Text>
                    </TouchableOpacity>
                )}

                {showMessage && (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnInfo]}
                        onPress={() => alert("Chat coming soon!")}
                    >
                        <Text style={styles.btnText}>Message</Text>
                    </TouchableOpacity>
                )}

                {onIgnore && (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnWarning]}
                        onPress={() => onIgnore(user.token)}
                    >
                        <Text style={styles.btnText}>Ignore</Text>
                    </TouchableOpacity>
                )}

                {onRemove && (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnDanger]}
                        onPress={() => onRemove(user.token)}
                    >
                        <Text style={styles.btnText}>Remove</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1A1A1A",
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,

        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },


    leftRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },

    profilePic: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#777",
    },

    textCol: {
        flexDirection: "column",
    },

    name: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

    subText: {
        color: "#b5b5b5",
        fontSize: 12,
        marginTop: 2,
    },

    tagline: {
        color: "#888",
        fontSize: 12,
        marginTop: 2,
    },

    btnCol: {
        flexDirection: "column",
        gap: 8,
        marginLeft: 10,
    },

    btn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },

    btnText: {
        color: "white",
        fontSize: 12,
    },

    btnPrimary: {
        backgroundColor: "#0066ff33",
        borderColor: "#3385ff",
        borderWidth: 1,
    },

    btnInfo: {
        backgroundColor: "#00bcd433",
        borderColor: "#00bcd4",
        borderWidth: 1,
    },

    btnWarning: {
        backgroundColor: "#ffcc0033",
        borderColor: "#ffcc00",
        borderWidth: 1,
    },

    btnDanger: {
        backgroundColor: "#ff333333",
        borderColor: "#ff4444",
        borderWidth: 1,
    },
});
