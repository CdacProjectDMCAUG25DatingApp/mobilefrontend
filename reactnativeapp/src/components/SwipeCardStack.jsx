import React, { useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated,
} from "react-native";

import Swiper from "react-native-deck-swiper";
import BasicCard from "./BasicCard";
import ProfileView from "../screens/ProfileView";

import {
    serviceGetCandidate,
    serviceGetCandidatesAgain,
} from "../services/interactions";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../services/config";

export default function SwipeCardStack() {
    const [cards, setCards] = useState([]);
    const [index, setIndex] = useState(0);
    const [showProfile, setShowProfile] = useState(false);
    const [deckKey, setDeckKey] = useState(0);   // ⭐ FORCE SWIPER RESET

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const isSwiping = useRef(false);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        let data = await serviceGetCandidate();
        if (!data?.length) data = await serviceGetCandidatesAgain();

        setCards(data);
        setIndex(0);                 // reset index
        setDeckKey((k) => k + 1);    // ⭐ this forces Swiper to remount fully
        isSwiping.current = false;   // reset tap/swipe lock
    };

    const sendSwipeToBackend = async (direction, token) => {
        const userToken = await AsyncStorage.getItem("token");

        const url =
            direction === "right"
                ? `${config.BASE_URL}/swipe/right`
                : `${config.BASE_URL}/swipe/left`;

        await axios.post(
            url,
            { swiped_token: token },
            { headers: { token: userToken } }
        );
    };

    const openProfile = () => setShowProfile(true);
    const goBackToCards = () => setShowProfile(false);

    // ⭐ Protect against crashes (never access invalid index)
    const getSafeCard = (idx) =>
        cards[Math.min(idx, cards.length - 1)] || null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

            {/* ================= PROFILE VIEW ================= */}
            {showProfile ? (
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.backBtn} onPress={goBackToCards}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    {/* ⭐ always safe */}
                    <ProfileView
                        editable={false}
                        profileData={getSafeCard(index)}
                    />
                </View>
            ) : (

                /* ================= SWIPE VIEW ================= */
                cards.length > 0 && (
                    <Swiper
                        key={deckKey}       // ⭐ MAGIC LINE → refreshes swiper
                        cards={cards}
                        backgroundColor="black"
                        verticalSwipe={false}
                        disableTopSwipe
                        disableBottomSwipe

                        onSwipedRight={(i) => {
                            const safe = Math.min(i, cards.length - 1);
                            sendSwipeToBackend("right", cards[safe].token);
                        }}

                        onSwipedLeft={(i) => {
                            const safe = Math.min(i, cards.length - 1);
                            sendSwipeToBackend("left", cards[safe].token);
                        }}

                        onSwiped={(i) => {
                            isSwiping.current = false;
                            const safeIndex = Math.min(i + 1, cards.length - 1);
                            setIndex(safeIndex);
                        }}

                        onSwipedAll={async () => {
                            await loadCards(); // ⭐ reload new deck
                        }}

                        // Tap to open profile
                        onTapCard={(i) => {
                            if (isSwiping.current) return;
                            isSwiping.current = true;

                            const safeIndex = Math.min(i, cards.length - 1);
                            setIndex(safeIndex);
                            openProfile();
                        }}

                        renderCard={(card) => (
                            <View style={{ width: "100%", height: "100%" }}>
                                <BasicCard candidate={card} />
                            </View>
                        )}
                    />
                )
            )}

        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    backBtn: {
        padding: 14,
        marginTop: 45,
        marginLeft: 16,
    },
    backText: {
        color: "white",
        fontSize: 20,
        fontWeight: "500",
    },
});
