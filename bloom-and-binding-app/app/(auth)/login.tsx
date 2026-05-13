import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/welcome-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(86, 67, 20, 0.22)",
          "rgba(0, 0, 0, 0)",
          "rgba(0, 0, 0, 0.44)",
        ]}
        style={styles.overlay}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[styles.button, styles.appleButton]}
              activeOpacity={0.85}
            >
              <Text style={styles.appleIcon}></Text>
              <Text style={styles.appleText}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              activeOpacity={0.85}
            >
              <AntDesign name="google" size={22} color="#4285f4" />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
  style={[styles.button, styles.emailButton]}
  activeOpacity={0.85}
  onPress={() => router.replace("/(tabs)/library")}
            >
              <Feather name="book-open" size={20} color="#4a3d33" />
              <Text style={styles.emailText}>Sign up with Email</Text>
            </TouchableOpacity>

            <Text style={styles.signInText}>
              Already have an account?{" "}
              <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  bottomSection: {
    paddingHorizontal: 28,
    paddingBottom: 42,
    gap: 14,
  },

  button: {
    height: 62,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  appleButton: {
    backgroundColor: "#000",
  },

  googleButton: {
    backgroundColor: "#fff",
  },

  emailButton: {
    backgroundColor: "rgba(244, 232, 214, 0.96)",
  },

  appleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  googleText: {
    color: "#2d241d",
    fontSize: 18,
    fontWeight: "600",
  },

  emailText: {
    color: "#4a3d33",
    fontSize: 18,
    fontWeight: "600",
  },

  appleIcon: {
    color: "#fff",
    fontSize: 28,
  },

  signInText: {
    textAlign: "center",
    color: "#f5ede2",
    fontSize: 16,
    marginTop: 6,
  },

  signInLink: {
    textDecorationLine: "underline",
    color: "#ffffff",
    fontWeight: "600",
  },
});