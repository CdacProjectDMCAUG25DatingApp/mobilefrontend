import  { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { setUser } from "../redux/userSlice";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem("token").then((t) => {
      if (t) dispatch(setUser({ token: t })); // AUTO LOGIN
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
