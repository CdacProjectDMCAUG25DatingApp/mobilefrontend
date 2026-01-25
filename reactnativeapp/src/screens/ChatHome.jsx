import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import config from "../services/config";
import { connectSocket } from "../services/socket";
import LikeCard from "../components/LikeCard";
import Messages from "../components/Messages";

export default function ChatHome() {
  const [chatUsers, setChatUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // this decides what to render

  useEffect(() => {
    connectSocket();
    loadChatUsers();
  }, []);

  const loadChatUsers = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await axios.get(`${config.BASE_URL}/chat/chat/list`, {
      headers: { token },
    });

    setChatUsers(res.data.data || []);
  };

  // ─────────────────────────────────────
  // RETURN: Decide which screen to show
  // ─────────────────────────────────────
  if (activeChat) {
    return (
      <Messages
        user={activeChat}
        candidateToken={activeChat.token}
        goBack={() => setActiveChat(null)}
      />
    );
  }

  // Default: Chat User List
  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>

      {/* Title */}
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Messages
      </Text>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {chatUsers.map((user, i) => (
          <LikeCard
            key={i}
            user={user}
            onChat     // enables "Last Message"
            onCardClick={(u) => setActiveChat(u)}  // opens chat
          />
        ))}
      </ScrollView>

    </View>
  );


}