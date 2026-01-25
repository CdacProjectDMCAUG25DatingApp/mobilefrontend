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

    // Fade animation
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        let data = await serviceGetCandidate();
        if (!data?.length) data = await serviceGetCandidatesAgain();

        setCards(data);
        setIndex(0);
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

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {showProfile ? (
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.backBtn} onPress={goBackToCards}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <ProfileView editable={false} profileData={cards[index]} />
                </View>
            ) : (
                cards.length > 0 && (
                    <Swiper
                        cards={cards}
                        cardIndex={index}      
                        backgroundColor="black"
                        verticalSwipe={false}
                        disableTopSwipe
                        disableBottomSwipe


                        onSwiped={(i) => {
                            const next = i + 1;
                            if (next < cards.length) {
                                setIndex(next);
                            }
                        }}

                        onSwipedRight={(i) =>
                            sendSwipeToBackend("right", cards[i].token)
                        }

                        onSwipedLeft={(i) =>
                            sendSwipeToBackend("left", cards[i].token)
                        }

                        onSwipedAll={async () => {
                            setIndex(0);                     // reset index for new deck
                            setCards([]);                    // clear old deck (prevents flicker)

                            setTimeout(async () => {
                                await loadCards();           // load new profiles
                            }, 150);
                        }}

                        // ⭐ TAP SHOWS CORRECT PROFILE
                        onTapCard={(i) => {
                            setIndex(i);
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
