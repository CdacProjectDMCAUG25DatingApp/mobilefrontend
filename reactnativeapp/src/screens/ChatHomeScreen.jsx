import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChatHome from "./ChatHomeList";   // NEW renamed file
import Messages from "./Messages";

const Stack = createStackNavigator();

export default function ChatHomeScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="ChatHomeList" component={ChatHome} />
      <Stack.Screen name="ChatWindow" component={Messages} />
    </Stack.Navigator>
  );
}
