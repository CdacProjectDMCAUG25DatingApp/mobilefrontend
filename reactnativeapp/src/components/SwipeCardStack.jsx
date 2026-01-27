import React, { useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated,
    ScrollView,
    RefreshControl,
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
    const [refreshing, setRefreshing] = useState(false);

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

    const onRefresh = async () => {
        setRefreshing(true);
        await loadCards();       // reload cards
        setTimeout(() => setRefreshing(false), 300);
    };


    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#000" }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
            }
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                {showProfile ? (
                    <View style={{ flex: 1 }}>
                        <ProfileView
                            editable={false}
                            profileData={cards[index]}
                            showMenu={true}
                            onBack={goBackToCards}
                        />
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
                                if (next < cards.length) setIndex(next);
                            }}
                            onSwipedRight={(i) =>
                                sendSwipeToBackend("right", cards[i].token)
                            }
                            onSwipedLeft={(i) =>
                                sendSwipeToBackend("left", cards[i].token)
                            }
                            onSwipedAll={async () => {
                                setIndex(0);
                                setCards([]);

                                setTimeout(async () => {
                                    await loadCards();
                                }, 150);
                            }}
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
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
});
