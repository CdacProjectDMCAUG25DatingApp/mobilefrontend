import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import config from "../services/config";
import { socket, connectSocket } from "../services/socket";

export default function Messages({ user, candidateToken, goBack }) {
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState("");
    const [myDp, setMyDp] = useState(null);

    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        scrollRef.current?.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        connectSocket();

        const timer = setTimeout(() => {
            if (!socket) return;

            loadHistory(); // load chat history

            socket.on("private_message", (msg) => {
                setMessages((prev) => [
                    ...prev,
                    { message: msg.message, incoming: true }
                ]);
                scrollToBottom();
            });

        }, 400); // give time for auth + connect

        return () => {
            clearTimeout(timer);
            socket?.off("private_message");
        };
    }, []);


    const loadHistory = async () => {
        const token = await AsyncStorage.getItem("token");

        const res = await axios.post(
            `${config.BASE_URL}/chat/history`,
            { token: candidateToken },
            { headers: { token } }
        );

        setMessages(res.data.data || []);
        setTimeout(scrollToBottom, 200);
    };

    const sendMessage = () => {
        if (!inputMsg.trim()) return;

        socket.emit("private_message", {
            to_token: candidateToken,
            message: inputMsg,
        });

        setMessages((prev) => [
            ...prev,
            { message: inputMsg, incoming: false },
        ]);

        setInputMsg("");
        scrollToBottom();
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Text style={styles.backBtn}>❮</Text>
                </TouchableOpacity>

                <Image
                    source={{ uri: config.urlConverter(user.photo_url) }}
                    style={styles.headerDp}
                />

                <Text style={styles.headerName}>{user.user_name}</Text>
            </View>

            {/* CHAT BODY */}
            <ScrollView
                ref={scrollRef}
                style={styles.chatBody}
                onContentSizeChange={scrollToBottom}
            >
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            styles.bubbleRow,
                            msg.incoming ? styles.incoming : styles.outgoing,
                        ]}
                    >
                        {msg.incoming && (
                            <Image
                                source={{ uri: config.urlConverter(user.photo_url) }}
                                style={styles.bubbleDp}
                            />
                        )}

                        <View style={styles.bubble}>
                            <Text style={styles.bubbleText}>{msg.message}</Text>
                        </View>

                        {!msg.incoming && myDp && (
                            <Image
                                source={{ uri: config.urlConverter(myDp) }}
                                style={styles.bubbleDp}
                            />
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* INPUT BOX */}
            <View style={styles.inputArea}>
                <TextInput
                    value={inputMsg}
                    onChangeText={setInputMsg}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    style={styles.input}
                />

                <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
                    <Text style={styles.sendBtnText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    paddingTop:37,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#111",
    },

    backBtn: {
        color: "white",
        fontSize: 26,
        marginRight: 10,
    },

    headerDp: {
        width: 45,
        height: 45,
        borderRadius: 50,
        marginRight: 10,
    },

    headerName: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },

    chatBody: {
        flex: 1,
        padding: 10,
    },

    bubbleRow: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },

    incoming: {
        justifyContent: "flex-start",
    },

    outgoing: {
        justifyContent: "flex-end",
    },

    bubble: {
        maxWidth: "70%",
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#222",
    },

    bubbleText: {
        color: "white",
    },

    bubbleDp: {
        width: 35,
        height: 35,
        borderRadius: 50,
        marginHorizontal: 6,
    },

    inputArea: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#111",
    },

    input: {
        flex: 1,
        padding: 12,
        backgroundColor: "#222",
        borderRadius: 10,
        color: "white",
    },

    sendBtn: {
        paddingHorizontal: 18,
        justifyContent: "center",
        marginLeft: 10,
        backgroundColor: "#333",
        borderRadius: 10,
    },

    sendBtnText: {
        color: "white",
        fontWeight: "bold",
    },
});
