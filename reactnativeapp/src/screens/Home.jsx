import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { Platform } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomTabsPager from "../components/BottomTabsPager";
import ChatHome from "./ChatHome.jsx";
import ProfileView from "../screens/ProfileView";
import LikesScreen from "../screens/LikesScreen";
import Settings from "../screens/Settings";
import SwipeCardStack from "../components/SwipeCardStack";
import { loadUserDetails, loadPhotos } from "../redux/userDetailsThunks";

import { useDispatch } from 'react-redux';

const Home = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserDetails());
    dispatch(loadPhotos());
  }, []);
  
  return (

    <BottomTabsPager
      swipeEnabled={Platform.OS === "android"}
      tabs={["People", "ChatHome", "Profile", "Likes", "Settings"]}
      screens={[
        <View key="0" style={{ flex: 1 }}>
          <SwipeCardStack />
        </View>,
        <ChatHome />,
        <ProfileView editable={true} />,
        <LikesScreen />,
        <Settings />,
      ]}
    />

  );
};

export default Home;
