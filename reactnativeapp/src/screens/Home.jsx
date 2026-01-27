import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomTabsPager from "../components/BottomTabsPager";
import ChatHome from "./ChatHome.jsx";
import ProfileView from "../screens/ProfileView";
import LikesScreen from "../screens/LikesScreen";
import Settings from "../screens/Settings";
import SwipeCardStack from "../components/SwipeCardStack";

import config from "../services/config";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const {
    setUserDetails,
    setPhotos,
    setPreferences,
  } = useContext(UserContext);

  const isFocused = useIsFocused();

  // -------- Fetch fresh data whenever Home comes into focus --------
  const refreshUserData = async () => {
    const token = await AsyncStorage.getItem("token");
    const headers = { token };

    try {
      const [detailsRes, photosRes, prefRes] = await Promise.all([
        axios.get(config.BASE_URL + "/user/userdetails", { headers }),
        axios.get(config.BASE_URL + "/photos/userphotos", { headers }),
        axios.get(config.BASE_URL + "/user/userpreferences", { headers }),
      ]);

      if (detailsRes.data.data.length)
        setUserDetails(detailsRes.data.data[0]);

      if (photosRes.data.data.length)
        setPhotos(photosRes.data.data);

      if (prefRes.data.data.length)
        setPreferences(prefRes.data.data[0]);
    } catch (error) {
      console.log("Home refresh error →", error);
    }
  };

  // Trigger when tab/screen is active
  useEffect(() => {
    if (isFocused) refreshUserData();
  }, [isFocused]);

  // ------------------------------------------------------------------

  return (
    <BottomTabsPager
      tabs={["People", "ChatHome", "Profile", "Likes", "Settings"]}
      screens={[
        <View key="0" style={{ flex: 1 }}>
          <SwipeCardStack />
        </View>,

        <ChatHome />,

        <ProfileView editable={true} />
        ,
        <LikesScreen />,
        <Settings />,
      ]}
    />
  );
};

export default Home;
