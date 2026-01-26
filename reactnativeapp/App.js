import React, { createContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./src/screens/Login";
import Signup from "./src/screens/Register";


import Home from "./src/screens/Home";
import Settings from "./src/screens/Settings";
import ProfileView from "./src/screens/ProfileView";

import CreateProfile from "./src/screens/onboarding/CreateProfile";
import AddPhotos from "./src/screens/onboarding/AddPhotos";
import UserPreferencaes from "./src/screens/onboarding/UserPreferences";

import { UserContext } from "./src/context/UserContext";
import Toast from "react-native-toast-message";

import { MenuProvider } from 'react-native-popup-menu';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [userDetails, setUserDetails] = useState({});

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        profile,
        setProfile,
        photos,
        setPhotos,
        preferences,
        setPreferences,
        userDetails,
        setUserDetails,
      }}
    >
      <MenuProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* PUBLIC */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />

            {/* ONBOARDING SCREENS */}
            <Stack.Screen name="CreateProfile" component={CreateProfile} />
            <Stack.Screen name="AddPhotos" component={AddPhotos} />
            <Stack.Screen name="UserPreferencaes" component={UserPreferencaes} />

            {/* MAIN */}
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ProfileView" component={ProfileView} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </MenuProvider>
    </UserContext.Provider>
  );
}
