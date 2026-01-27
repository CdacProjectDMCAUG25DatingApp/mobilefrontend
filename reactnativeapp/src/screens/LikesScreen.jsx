import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  ToastAndroid,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import config from "../services/config";
import LikeCard from "../components/LikeCard";
import ProfileView from "../screens/ProfileView";

export default function LikesScreen() {
  const [likes, setLikes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [token, setToken] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fadeMap = useRef({}).current;

  const initFade = (key) => {
    if (!fadeMap[key]) fadeMap[key] = new Animated.Value(1);
  };

  useEffect(() => {
    (async () => {
      const t = await config.getToken("token");
      setToken(t);
    })();
  }, []);

  useEffect(() => {
    if (!token) return;
    loadLikes();
    loadMatches();
  }, [token, refreshKey]);

  const loadLikes = async () => {
    try {
      const res = await axios.get(
        `${config.BASE_URL}/likeesandmatches/likes/liked-you`,
        { headers: { token } }
      );
      setLikes(res.data.data || []);
    } catch (err) {
      console.log("Error loading Likes:", err.response?.data || err);
    }
  };

  const loadMatches = async () => {
    try {
      const res = await axios.get(
        `${config.BASE_URL}/likeesandmatches/likes/matches`,
        { headers: { token } }
      );
      setMatches(res.data.data || []);
    } catch (err) {
      console.log("Error loading Matches:", err.response?.data || err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 600);
  };

  const openFullProfile = async (user) => {
    try {
      const headers = { token: user.token };

      const detailsRes = await axios.get(
        `${config.BASE_URL}/likeesandmatches/like/likeduserdetails`,
        { headers }
      );

      const photosRes = await axios.get(
        `${config.BASE_URL}/likeesandmatches/like/likeduserphotos`,
        { headers }
      );

      setProfileData({
        candidateData: detailsRes.data.data,
        photos: photosRes.data.data,
      });

      setShowProfile(true);
    } catch (err) {
      console.log("Failed loading full profile", err);
    }
  };

  const likeBack = async (candidateToken) => {
    try {
      await axios.post(
        `${config.BASE_URL}/likeesandmatches/likes/like`,
        { token: candidateToken, is_super_like: 0 },
        { headers: { token } }
      );

      ToastAndroid.show("Liked Back", ToastAndroid.SHORT);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      ToastAndroid.show("Like Back Failed", ToastAndroid.SHORT);
    }
  };

  const ignoreUser = async (candidateToken) => {
    try {
      const res = await axios.delete(
        `${config.BASE_URL}/likeesandmatches/likes/ignore`,
        {
          headers: { token },
          data: { user_to_ignore: candidateToken }
        }
      );

      const uid = res?.data?.data?.uid;

      fadeAndRemove(uid, "likes");

    } catch (err) {
      ToastAndroid.show("Ignore Failed", ToastAndroid.SHORT);
      console.log("IGNORE ERROR:", err);
    }
  };



  const removeMatch = async (candidateToken) => {
    try {
      await axios.delete(
        `${config.BASE_URL}/likeesandmatches/matches/remove`,
        { headers: { token }, data: { token: candidateToken } }
      );

      ToastAndroid.show("Match Removed", ToastAndroid.SHORT);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      ToastAndroid.show("Failed to remove match", ToastAndroid.SHORT);
    }
  };

  const fadeAndRemove = (uid, list) => {
    initFade(uid);

    Animated.timing(fadeMap[uid], {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (list === "likes") setLikes((p) => p.filter((x) => x.uid !== uid));
      if (list === "matches") setMatches((p) => p.filter((x) => x.uid !== uid));
    });
  };

  if (showProfile && profileData) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000"}}>
        <ProfileView editable={false}
          profileData={profileData}
          onBack={() => setShowProfile(false)}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.pageContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
      }
    >
      <Text style={styles.title}>Likes & Matches</Text>

      <Text style={styles.sectionTitle}>Liked You</Text>

      {likes.length === 0 ? (
        <Text style={styles.empty}>No likes yet.</Text>
      ) : (
        likes.map((user) => {
          initFade(user.token);

          return (
            <Animated.View key={user.token} style={{ opacity: fadeMap[user.token] }}>
              <LikeCard
                user={user}
                showLikeBack
                onLikeBack={likeBack}
                onIgnore={ignoreUser}
                onCardClick={openFullProfile}
              />
            </Animated.View>
          );
        })
      )}

      <Text style={styles.sectionTitle}>Matches</Text>

      {matches.length === 0 ? (
        <Text style={styles.empty}>No matches yet.</Text>
      ) : (
        matches.map((user) => {
          initFade(user.token);

          return (
            <Animated.View key={user.token} style={{ opacity: fadeMap[user.token] }}>
              <LikeCard
                user={user}
                showMessage
                showRemove
                onRemove={() => removeMatch(user.token)}
                onCardClick={openFullProfile}
              />
            </Animated.View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 80,
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    paddingTop: 37 ,
  },
  sectionTitle: {
    color: "#bbb",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
});
