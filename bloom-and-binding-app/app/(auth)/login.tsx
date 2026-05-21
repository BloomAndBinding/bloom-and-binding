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
  onPress={() => router.replace("/(tabs)")}
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
    borderRadius: 18,
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
    backgroundColor: "#1F1B17",
  },

  googleButton: {
    backgroundColor: "rgba(247, 239, 226, 0.96)",
  },

  emailButton: {
    backgroundColor: "rgba(247, 239, 226, 0.96)",
  },

  appleText: {
    color: "#F7F0E4",
    fontSize: 22,
    fontFamily: "CormorantGaramond_600SemiBold",
    letterSpacing: 0.2,
  },

  googleText: {
    color: "#234028",
    fontSize: 22,
    fontFamily: "CormorantGaramond_600SemiBold",
    letterSpacing: 0.2,
  },

  emailText: {
    color: "#234028",
    fontSize: 22,
    fontFamily: "CormorantGaramond_600SemiBold",
    letterSpacing: 0.2,
  },

  appleIcon: {
    color: "#F7F0E4",
    fontSize: 28,
  },

  signInText: {
    textAlign: "center",
    color: "#F7F0E4",
    fontSize: 18,
    marginTop: 8,
    fontFamily: "CormorantGaramond_500Medium",
  },

  signInLink: {
    textDecorationLine: "underline",
    color: "#F7F0E4",
    fontFamily: "CormorantGaramond_600SemiBold",
  },
});