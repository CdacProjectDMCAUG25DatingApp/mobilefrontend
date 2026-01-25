import React, { useContext } from "react";
import BottomTabsPager from "../components/BottomTabsPager";
import ChatHome from "./ChatHome.jsx";
import ProfileView from "../screens/ProfileView";
import LikesScreen from "../screens/LikesScreen";
import Settings from "../screens/Settings";

import { UserContext } from "../context/UserContext";
import { View } from 'react-native';
import SwipeCardStack from "../components/SwipeCardStack";

const Home = () => {
  const { userDetails, photos } = useContext(UserContext);

  return (
    <BottomTabsPager
      tabs={["People", "ChatHome", "Profile", "Likes", "Settings"]}
      screens={[
        <View key="0" style={{ flex: 1 }}>
          <SwipeCardStack />
        </View>
        ,
        <ChatHome />,
        <ProfileView editable={true} />,
        <LikesScreen />,
        <Settings />,
      ]}
    />
  );
};

export default Home;
