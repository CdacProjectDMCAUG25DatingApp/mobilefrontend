import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.27:4000'; 

export const loginUser = async (email, password) => {
  try {
    console.log('📡 Calling backend login API');

    const response = await axios.post(`${BASE_URL}/user/signin`, {
      email,
      password,
    });

    console.log('✅ Backend response:', response.data);

    if (response.data.status === 'success') {
      await AsyncStorage.setItem(
        'token',
        response.data.data.token
      );
    }

    return response.data;
  } catch (error) {
    console.log('❌ Login API error:', error.message);
    return {
      status: 'error',
      error: 'Server not reachable',
    };
  }
};
