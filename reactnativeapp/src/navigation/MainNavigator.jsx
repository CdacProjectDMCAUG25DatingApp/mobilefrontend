import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home";
import People from "../screens/People";
import ChatHome from "../screens/ChatHome";
import ProfileView from "../screens/ProfileView";
import LikesAndMatches from "../screens/LikesAndMatches";
import Settings from "../screens/Settings";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="People" component={People} />
      <Stack.Screen name="ChatHome" component={ChatHome} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen name="LikesAndMatches" component={LikesAndMatches} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
