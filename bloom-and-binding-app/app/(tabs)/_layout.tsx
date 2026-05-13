import React from "react";
import { Tabs, router } from "expo-router";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

function ShiftedIcon({
  name,
  color,
  shift = 0,
}: {
  name: keyof typeof Feather.glyphMap;
  color: string;
  shift?: number;
}) {
  return (
    <View
  style={{
    transform: [
      { translateX: shift },
      { translateY: 7 },
    ],
  }}
>
      <Feather name={name} size={26} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,

          sceneStyle: {
            overflow: "visible",
          },

          tabBarStyle: {
            position: "absolute",
            left: 18,
            right: 18,
            bottom: 24,
            height: 58,
            borderRadius: 24,
            backgroundColor: "rgba(244, 234, 216, 0.97)",
            borderTopWidth: 0,
            overflow: "visible",

            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 6 },

            elevation: 10,
          },

          tabBarActiveTintColor: "#1f3324",
          tabBarInactiveTintColor: "#7f7a6f",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <ShiftedIcon name="home" color={color} shift={-4} />
            ),
          }}
        />

        <Tabs.Screen
          name="library"
          options={{
            tabBarIcon: ({ color }) => (
              <ShiftedIcon name="book-open" color={color} shift={-22} />
            ),
          }}
        />

        <Tabs.Screen
          name="community"
          options={{
            tabBarIcon: ({ color }) => (
              <ShiftedIcon
                name="message-circle"
                color={color}
                shift={22}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color }) => (
              <ShiftedIcon name="user" color={color} shift={14} />
            ),
          }}
        />

        <Tabs.Screen
          name="conservatory"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <TouchableOpacity
        style={styles.floatingButton}
        activeOpacity={0.9}
        onPress={() => router.push("/(tabs)/conservatory")}
      >
        <Image
          source={require("../../assets/images/conservatory-medallion.png")}
          style={styles.medallion}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    zIndex: 999,
  },

  medallion: {
    width: 124,
    height: 124,
  },
});