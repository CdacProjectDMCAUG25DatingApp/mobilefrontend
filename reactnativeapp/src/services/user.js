import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';


export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${config.BASE_URL}/user/signin`, {
      email,
      password,
    });
    if (response.data.status === 'success') {
      await AsyncStorage.setItem(
        'token',
        response.data.data.token
      );
    }
    return response.data;
  } catch (error) {
    return {
      status: 'error',
      error: 'Server not reachable',
    };
  }
};
