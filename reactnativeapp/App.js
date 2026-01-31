import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Toast from "react-native-toast-message";

import { MenuProvider } from 'react-native-popup-menu';

import { Provider } from 'react-redux';
import store from './src/redux/configureStore';
import RootNavigator from "./src/navigation/RootNavigator";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <Provider store={store}>
      <MenuProvider>
        <RootNavigator/>
        <Toast />
      </MenuProvider>
    </Provider>

  );
}
