import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { useContext } from "react";
import { UserContext } from "./src/context/UserContext";

const RootNavigator = () => {
    const { user } = useContext(UserContext);

    return (
        <NavigationContainer>
            {user ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default RootNavigator;
