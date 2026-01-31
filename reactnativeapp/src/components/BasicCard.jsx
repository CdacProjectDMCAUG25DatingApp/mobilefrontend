import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import config from "../services/config";

export default function BasicCard({ candidate }) {

  const user = candidate.candidateData;
  return (
    <View style={styles.card}>

      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: config.urlConverter(candidate.photos[0].photo_url) }}
          style={styles.image}
        />
      </View>

      {/* NAME */}
      <Text style={styles.name}>{user.user_name}</Text>

      {/* TAGLINE */}
      {user.tagline ? (
        <Text style={styles.tagline}>{user.tagline}</Text>
      ) : null}

      {/* INFO BOX */}
      <View style={styles.infoBox}>
        <Text style={styles.infoBold}>
          {user.age ?? "0"} • {user.gender} • {user.location}
        </Text>
        <Text style={styles.infoNormal}>
          Match Score {candidate.score} • Shares {candidate.match_interests_count} interests
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#0E0E0E",
  },

  imageWrapper: {
    width: "100%",
    aspectRatio: 300 / 500,   // EXACT 3:5 IMAGE
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },

  tagline: {
    fontSize: 15,
    color: "#cccccc",
    fontStyle: "italic",
    marginBottom: 16,
  },

  infoBox: {
    backgroundColor: "#181818",
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },

  infoBold: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  infoNormal: {
    color: "#dddddd",
    fontSize: 13,
    marginTop: 4,
  },
});
