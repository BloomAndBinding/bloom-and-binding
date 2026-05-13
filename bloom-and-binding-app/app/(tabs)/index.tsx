import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <ImageBackground
          source={require("../../assets/images/hero-header.png")}
          style={styles.heroWrap}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              "rgba(246,234,216,0)",
              "rgba(246,234,216,0.60)",
              "rgba(246,234,216,0.95)",
              "#f6ead8",
            ]}
            style={styles.heroFade}
          />

          <View style={styles.heroTextWrap}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>Brittany</Text>
            <Text style={styles.subGreeting}>
              Welcome back to your reading sanctuary!
            </Text>
          </View>
        </ImageBackground>

        {/* CURRENTLY READING */}
        <View style={styles.currentCard}>
          <Text style={styles.currentLabel}>CURRENTLY READING</Text>

          <View style={styles.currentContent}>
            <Image
              source={{
                uri: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
              }}
              style={styles.bookCover}
            />

            <View style={styles.currentInfo}>
              <Text style={styles.bookTitle}>To Kill a Mockingbird</Text>
              <Text style={styles.bookAuthor}>Harper Lee</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaTag}>Hardcover</Text>
                <Text style={styles.metaDate}>Started May 8</Text>
              </View>

              <Text style={styles.progressText}>68% complete</Text>

              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Update Progress</Text>
          </TouchableOpacity>
        </View>

        {/* RECENTLY ADDED */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <Text style={styles.sectionLink}>See All</Text>
          </View>

          <View style={styles.bookRow}>
            <Image
              source={{
                uri: "https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg",
              }}
              style={styles.smallBook}
            />
            <Image
              source={{
                uri: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
              }}
              style={styles.smallBook}
            />
           <Image
  source={{
    uri: "https://covers.openlibrary.org/b/isbn/9780553213119-L.jpg",
  }}
  style={styles.smallBook}
            />
          </View>
        </View>
        {/* CONSERVATORY */}
        <View style={styles.section}>
          <ImageBackground
            source={require("../../assets/images/conservatory-preview.png")}
            style={styles.conservatoryCard}
            imageStyle={styles.conservatoryImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={[
                "rgba(246,234,216,0.88)",
                "rgba(246,234,216,0.4)",
                "rgba(246,234,216,0.08)",
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.conservatoryFade}
            />

            <View style={styles.conservatoryOverlay}>
              <Text style={styles.conservatoryTitle}>Your Conservatory</Text>
              <Text style={styles.conservatoryText}>
                A blooming record of every story you’ve finished.
              </Text>

              <TouchableOpacity style={styles.visitButton}>
                <Text style={styles.visitButtonText}>Enter Conservatory</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6ead8",
  },

  container: {
    flex: 1,
    backgroundColor: "#f6ead8",
  },

  scrollContent: {
  backgroundColor: "#f6ead8",
  paddingBottom: 80,
},

  heroWrap: {
    height: 285,
  },

  heroFade: {
    ...StyleSheet.absoluteFillObject,
  },

  heroTextWrap: {
    position: "absolute",
    left: 24,
    top: 78,
  },

  greeting: {
    fontSize: 24,
    fontFamily: "Georgia",
    color: "#1f3324",
  },

  name: {
    fontSize: 48,
    fontFamily: "Georgia",
    color: "#1f3324",
    marginTop: -2,
  },

  subGreeting: {
    marginTop: 4,
    fontSize: 18,
    fontFamily: "Georgia",
    color: "#2b4430",
  },

  currentCard: {
    backgroundColor: "#23361f",
    marginHorizontal: 20,
    marginTop: -72,
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },

  currentLabel: {
    color: "#dbe6d7",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 18,
  },

  currentContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  bookCover: {
    width: 110,
    height: 160,
    borderRadius: 14,
  },

  currentInfo: {
    flex: 1,
    marginLeft: 18,
  },

  bookTitle: {
    color: "#fff",
    fontSize: 21,
    fontFamily: "Georgia",
  },

  bookAuthor: {
    color: "#e5eee2",
    fontSize: 16,
    fontFamily: "Georgia",
    marginTop: 6,
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    flexWrap: "wrap",
  },

  metaTag: {
    backgroundColor: "rgba(255,255,255,0.16)",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 1005,
    fontSize: 12,
  },

  metaDate: {
    backgroundColor: "rgba(255,255,255,0.16)",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 1005,
    fontSize: 12,
  },

  progressText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 14,
    fontWeight: "600",
  },

  progressBarBg: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    marginTop: 8,
    overflow: "hidden",
  },

  progressBarFill: {
    width: "68%",
    height: "100%",
    backgroundColor: "#f6ead8",
    borderRadius: 999,
  },

  updateButton: {
    marginTop: 20,
    backgroundColor: "rgba(244,232,214,0.14)",
    borderWidth: 1,
    borderColor: "rgba(244,232,214,0.10)",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },

  updateButtonText: {
    color: "#ffffff",
    fontFamily: "Georgia",
    fontSize: 15,
  },

  section: {
    marginTop: 36,
    paddingHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionTitle: {
    fontSize: 24,
    fontFamily: "Georgia",
    color: "#2f261f",
  },

  sectionLink: {
    color: "#6f6257",
    fontSize: 15,
    fontFamily: "Georgia",
  },

  bookRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
    gap: 30,
    marginTop: 20,
  },

  smallBook: {
    width: 110,
    height: 175,
    borderRadius: 14,
  },

  conservatoryCard: {
    height: 220,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "center",
  },

  conservatoryImage: {
    borderRadius: 28,
  },

  conservatoryFade: {
    ...StyleSheet.absoluteFillObject,
  },

  conservatoryOverlay: {
    padding: 20,
    width: "52%",
    justifyContent: "flex-end",
  },

  conservatoryTitle: {
    fontSize: 24,
    fontFamily: "Georgia",
    color: "#2f261f",
  },

  conservatoryText: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: "Georgia",
    color: "#5f5147",
    lineHeight: 24,
  },

visitButton: {
  marginTop: 12,
  alignSelf: "flex-start",
  backgroundColor: "rgba(31,51,36,0.18)",
  borderWidth: 1,
  borderColor: "rgba(31,51,36,0.10)",
  paddingHorizontal: 18,
  paddingVertical: 12,
  borderRadius: 999,
  },

  visitButtonText: {
   color: "#1f3324",
    fontFamily: "Georgia",
    fontSize: 15,
  },
});