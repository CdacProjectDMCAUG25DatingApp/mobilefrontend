import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-deck-swiper";
import BasicCard from "./BasicCard";

import {
  serviceGetCandidate,
  serviceGetCandidatesAgain,
} from "../services/interactions";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../services/config";

export default function SwipeCardStack() {
  const navigation = useNavigation();

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
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

  // ------------------------
  // FETCH FULL USER PROFILE
  // ------------------------
  const openFullProfile = async (candidateToken) => {
    const userToken = await AsyncStorage.getItem("token");

    try {
      const profileDataRes = await axios.get(
        `${config.BASE_URL}/user/userdetails`,
        { headers: { token: candidateToken } }
      );
      const photoRes = await axios.get(
        `${config.BASE_URL}/photos/userphotos`,
        { headers: { token: candidateToken } }
      );
      const fullProfile = profileDataRes.data.data;
      const fullPhotos = photoRes.data.data;
      
      navigation.navigate("PeopleProfile", {
        profileData: fullProfile,
        photos : fullPhotos,
        propEditable: false,
      });

    } catch (err) {
      console.log("Failed to load profile:", err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCards();
    setTimeout(() => setRefreshing(false), 300);
  };

  const NoCards = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No cards available</Text>
      <Text style={styles.emptySub}>Pull to refresh</Text>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#000" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="white"
        />
      }
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {cards.length === 0 ? (
          <NoCards />
        ) : (
          <Swiper
            cards={cards}
            cardIndex={index}
            backgroundColor="black"
            verticalSwipe={false}
            disableTopSwipe
            disableBottomSwipe
            onTapCardDeadZone={0}
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
              setCards([]);
              setTimeout(async () => {
                await loadCards();
              }, 50);
            }}
            onTapCard={(i) => {
              const candidate = cards[i];
              openFullProfile(candidate.token);
            }}
            renderCard={(card) => (
              <View style={{ width: "100%", height: "100%" }}>
                <BasicCard candidate={card} />
              </View>
            )}
          />
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

  emptyContainer: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  emptySub: {
    color: "#aaa",
    marginTop: 8,
  },
});
