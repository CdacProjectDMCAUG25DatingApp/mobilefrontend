import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/homeStyles";

const BottomMenu = ({ active }) => {
  const navigation = useNavigation();

  const handlePress = (item) => {
    switch (item) {
      case "People":
        navigation.navigate("People");
        break;

      case "Message":
        navigation.navigate("ChatHome");
        break;

      case "Edit Profile":
        navigation.navigate("ProfileView", {
          editable: true,
        });
        break;

      case "Likes/Matched":
        navigation.navigate("LikesAndMatches");
        break;

      case "Settings":
        navigation.navigate("Settings");
        break;

      default:
        break;
    }
  };

  const menuItems = [
    "People",
    "Message",
    "Edit Profile",
    "Likes/Matched",
    "Settings",
  ];

  return (
    <View style={styles.bottomMenu}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.menuButton,
            active === item && styles.menuButtonActive,
          ]}
          onPress={() => handlePress(item)}
        >
          <Text
            style={[
              styles.menuText,
              active === item && styles.menuTextActive,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomMenu;
