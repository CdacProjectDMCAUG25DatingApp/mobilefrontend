import io from "socket.io-client";
import config from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export let socket = null;

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return;

  if (!socket) {
    socket = io(config.BASE_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) socket.disconnect();
};
