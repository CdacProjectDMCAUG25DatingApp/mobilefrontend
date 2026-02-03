import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';


export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${config.BASE_URL}/user/signin`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return {
      status: 'error',
      error: 'Server not reachable',
    };
  }
};

export async function registerUser(name, email, password, mobile) {
  try {
    const url = config.BASE_URL + '/user/signup'
    const body = { name, email, password, mobile }
    const response = await axios.post(url, body)
    return response.data
  } catch (ex) {
    toast.error(ex)
  }
}


export async function getProfile() {
    try {
        const url = config.BASE_URL + '/user/profile'
        const headers = {
            token: config.getToken('token')
        }
        const response = await axios.get(url, { headers })
        return response.data
    } catch (error) {
        toast.error(error)
    }
}

export async function updateUser(mobile) {
    try {
        const url = config.BASE_URL + '/user'
        const body = { mobile }
        const headers = {
            token: config.getToken('token')
        }
        const response = await axios.put(url, body, { headers })
        return response.data
    } catch (error) {
        toast.error(error)
    }
}