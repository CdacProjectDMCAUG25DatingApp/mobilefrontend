import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import People from "../screens/People";
import ChatHome from "../screens/ChatHome";
import ProfileView from "../screens/ProfileView";
import Settings from "../screens/Settings";

import { Ionicons } from "@expo/vector-icons";
import EditProfile from "../screens/EditProfile";
import LikesScreen from "../screens/LikesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ----- HOME STACK -----
function EditProfileTab() {
  return (
    <EditProfile/>
  );
}

// ----- PEOPLE STACK -----
function PeopleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PeopleMain" component={People} />
      <Stack.Screen name="ProfileViewPeople" component={ProfileView} />
    </Stack.Navigator>
  );
}

// ----- CHAT STACK -----
function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatHomeMain" component={ChatHome} />
      <Stack.Screen name="ProfileViewChat" component={ProfileView} />
    </Stack.Navigator>
  );
}

// ----- LIKES & MATCHES STACK -----
function LikesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LikesMain" component={LikesScreen} />
      <Stack.Screen name="ProfileViewLikes" component={ProfileView} />
    </Stack.Navigator>
  );
}
 
// ----- SETTINGS STACK -----
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
          let icon = "home";

          if (route.name === "People") icon = "people";
          if (route.name === "Chat") icon = "chatbubble-ellipses";
          if (route.name === "Likes") icon = "heart";
          if (route.name === "SettingsTab") icon = "settings";

          return <Ionicons name={icon} size={size} color={color} />;
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
