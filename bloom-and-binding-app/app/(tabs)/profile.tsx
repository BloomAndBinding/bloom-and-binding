import React from "react";
import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f6ead8",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile 👤</Text>
    </View>
  );
}