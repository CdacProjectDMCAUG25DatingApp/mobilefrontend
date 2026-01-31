import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import SwipeCardStack from "../components/SwipeCardStack";
import { loadUserDetails, loadPhotos } from "../redux/userDetailsThunks";

import { useDispatch } from 'react-redux';

const People = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserDetails());
    dispatch(loadPhotos());
  }, []);
  
  return <View key="0" style={{ flex: 1 }}>
          <SwipeCardStack />
        </View>
}

export default People;
