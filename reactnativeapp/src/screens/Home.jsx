import React, { useContext } from "react";
import BottomTabsPager from "../components/BottomTabsPager";
import Messages from "../screens/Messages";
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
      tabs={["People", "Messages", "Profile", "Likes", "Settings"]}
      screens={[
        <View key="0" style={{ flex: 1 }}>
          <SwipeCardStack />
        </View>
        ,
        <Messages />,
        <ProfileView editable={true} />,
        <LikesScreen />,
        <Settings />,
      ]}
    />
  );
};

export default Home;
