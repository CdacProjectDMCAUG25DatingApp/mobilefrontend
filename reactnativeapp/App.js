import React, { createContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./src/screens/Login";
import Register from "./src/screens/Register";

import Home from "./src/screens/Home";         // <— like your example
import Settings from "./src/screens/Settings";
import ProfileView from "./src/screens/ProfileView";
import { UserContext } from "./src/context/UserContext";
import Toast from "react-native-toast-message";


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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          {/* PUBLIC SCREENS */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />

          {/* ONBOARDING (PROTECTED) */}


          {/* MAIN HOME (TABS INSIDE) */}
          <Stack.Screen name="Home" component={Home} />

          {/* OTHER SCREENS */}
          <Stack.Screen name="ProfileView" component={ProfileView} />
          <Stack.Screen name="Settings" component={Settings} />


        </Stack.Navigator>
      </NavigationContainer>
      <Toast/>
    </UserContext.Provider>
  );
}
