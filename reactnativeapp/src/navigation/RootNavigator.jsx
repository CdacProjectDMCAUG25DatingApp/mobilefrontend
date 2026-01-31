import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";


const RootNavigator = () => {
    const token = AsyncStorage.getItem("token")

    return (
        <NavigationContainer>
            {token ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default RootNavigator;
