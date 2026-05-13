import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.subtitle}>Coming soon ☕📚✨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6ead8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 34,
    fontFamily: "Georgia",
    color: "#1f3324",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 18,
    color: "#6f665c",
  },
});