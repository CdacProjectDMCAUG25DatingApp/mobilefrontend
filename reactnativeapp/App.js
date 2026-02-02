import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Toast from "react-native-toast-message";
import { MenuProvider } from "react-native-popup-menu";

import { Provider } from "react-redux";
import store from "./src/redux/configureStore";

import SplashScreen from "./src/screens/SplashScreen";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); 
    }, 2000); // 2 seconds animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <MenuProvider>
        {showSplash ? <SplashScreen /> : <RootNavigator />}
        <Toast />
      </MenuProvider>
    </Provider>
  );
}
