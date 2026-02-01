import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Signup from "../screens/Register";
import CreateProfile from "../screens/onboarding/CreateProfile";
import AddPhotos from "../screens/onboarding/AddPhotos";
import UserPreferences from "../screens/onboarding/UserPreferences";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="AddPhotos" component={AddPhotos} />
      <Stack.Screen name="UserPreferences" component={UserPreferences} />
    </Stack.Navigator>
  );
}
