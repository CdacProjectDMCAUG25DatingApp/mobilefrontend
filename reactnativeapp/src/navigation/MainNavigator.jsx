import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import People from "../screens/People";
import ChatHome from "../screens/ChatHome";
import ProfileView from "../screens/ProfileView";
import Settings from "../screens/Settings";
import EditProfile from "../screens/EditProfile";
import LikesScreen from "../screens/LikesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// People Stack
function PeopleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PeopleMain" component={People} />
      <Stack.Screen name="PeopleProfile" component={ProfileView} />
    </Stack.Navigator>
  );
}

// Chat Stack
function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatMain" component={ChatHome} />
      <Stack.Screen name="ChatProfile" component={ProfileView} />
    </Stack.Navigator>
  );
}

// Likes Stack
function LikesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LikesMain" component={LikesScreen} />
      <Stack.Screen name="LikesProfile" component={ProfileView} />
    </Stack.Navigator>
  );
}

// Settings Stack
function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={Settings} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "black", borderTopColor: "gray" },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
        tabBarIcon: ({ color, size }) => {
          const icons = {
            People: "people",
            Chat: "chatbubble-ellipses",
            EditProfile: "create",
            Likes: "heart",
            SettingsTab: "settings",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="People" component={PeopleStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="EditProfile" component={EditProfile} />
      <Tab.Screen name="Likes" component={LikesStack} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} />
    </Tab.Navigator>
  );
}
