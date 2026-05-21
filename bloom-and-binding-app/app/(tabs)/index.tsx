import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getSavedBooks, SavedBook } from "../../services/libraryStorage";
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
  const router = useRouter();
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const books = await getSavedBooks();
    setSavedBooks(books);
  };

  const currentlyReading = savedBooks.find(
    (book) => book.status === "Currently Reading"
  );

  const recentlyAdded = [...savedBooks].reverse().slice(0, 3);

  const progressPercent =
    currentlyReading?.progressType === "percentage"
      ? Number(currentlyReading.progressValue || 0)
      : 0;

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.name}>Brittany!</Text>
            <Text style={styles.subGreeting}>
              Welcome back to your reading sanctuary!
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.currentCard}>
          <Text style={styles.currentLabel}>CURRENTLY READING</Text>

          {currentlyReading ? (
            <>
              <View style={styles.currentContent}>
                {currentlyReading.coverUrl ? (
                  <Image
                    source={{ uri: currentlyReading.coverUrl }}
                    style={styles.bookCover}
                  />
                ) : (
                  <View style={styles.coverPlaceholder} />
                )}

                <View style={styles.currentInfo}>
                  <Text style={styles.bookTitle}>{currentlyReading.title}</Text>
                  <Text style={styles.bookAuthor}>{currentlyReading.author}</Text>

                  <View style={styles.metaRow}>
                    {currentlyReading.formats?.[0] && (
                      <Text style={styles.metaTag}>
                        {currentlyReading.formats[0]}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.progressText}>
  {currentlyReading.progressType === "page"
    ? `Page ${currentlyReading.progressValue || "0"}`
    : `${progressPercent}% complete`}
</Text>

<View style={styles.progressBarBg}>
  <View
    style={[
      styles.progressBarFill,
      {
        width:
          currentlyReading.progressType === "percentage"
            ? `${progressPercent}%`
            : "0%",
      },
    ]}
  />
</View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={() =>
                  router.push({
                    pathname: "/saved-book-details",
                    params: {
  id: currentlyReading.id,
  returnTo: "home",
},
                  })
                }
              >
                <Text style={styles.updateButtonText}>Update Progress</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No current read</Text>
              <Text style={styles.emptyText}>
                Pick your next adventure from the library 📚
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
          </View>

          <View style={styles.bookRow}>
  {recentlyAdded.length > 0 ? (
    recentlyAdded.map((book) => (
      <TouchableOpacity
        key={book.id}
        onPress={() =>
          router.push({
            pathname: "/saved-book-details",
            params: {
  id: book.id,
  returnTo: "home",
},
          })
        }
      >
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.smallBook}
          />
        ) : (
          <View style={styles.smallPlaceholder} />
        )}
      </TouchableOpacity>
    ))
  ) : (
    <Text style={styles.emptyText}>Your library is waiting 🌿</Text>
  )}
</View>
        </View>

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
                {"A blooming record\nof every story\nyou’ve finished."}
              </Text>

              <TouchableOpacity
  style={styles.visitButton}
  onPress={() => router.push("/(tabs)/conservatory")}
>
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
    fontSize: 30,
    fontFamily: "CormorantGaramond_500Medium",
    color: "#1f3324",
  },

  name: {
    fontSize: 46,
    fontFamily: "CormorantGaramond_600SemiBold",
    color: "#1f3324",
    marginTop: -6,
  },

  subGreeting: {
    marginTop: 4,
    fontSize: 22,
    fontFamily: "CormorantGaramond_500Medium",
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
    color: "#F7F0E4",
    fontSize: 28,
    lineHeight: 30,
    fontFamily: "CormorantGaramond_600SemiBold",
  },

  bookAuthor: {
    color: "#e5eee2",
    fontSize: 20,
    fontFamily: "CormorantGaramond_500Medium",
    marginTop: 4,
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
    flexWrap: "wrap",
  },

  metaTag: {
    backgroundColor: "rgba(255,255,255,0.16)",
    color: "#F7F0E4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
  },

  metaDate: {
    backgroundColor: "rgba(255,255,255,0.16)",
    color: "#F7F0E4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
  },

  progressText: {
    color: "#F7F0E4",
    marginTop: 18,
    fontSize: 16,
    fontFamily: "CormorantGaramond_600SemiBold",
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
    borderRadius: 14,
    alignItems: "center",
  },

  updateButtonText: {
    color: "#F7F0E4",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 20,
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
    fontSize: 32,
    fontFamily: "CormorantGaramond_600SemiBold",
    color: "#2f261f",
  },

  sectionLink: {
    color: "#6f6257",
    fontSize: 20,
    fontFamily: "CormorantGaramond_500Medium",
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
    opacity: 0.98,
  },

  conservatoryFade: {
    ...StyleSheet.absoluteFillObject,
  },

  conservatoryOverlay: {
    padding: 20,
    width: "60%",
    justifyContent: "flex-end",
  },

  conservatoryTitle: {
    fontSize: 24,
    fontFamily: "CormorantGaramond_600SemiBold",
    color: "#2f261f",
  },

  conservatoryText: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "CormorantGaramond_500Medium",
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
    borderRadius: 14,
  },

  visitButtonText: {
    color: "#1f3324",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 20,
  },

  coverPlaceholder: {
  width: 110,
  height: 160,
  borderRadius: 14,
  backgroundColor: "rgba(255,255,255,0.14)",
},

smallPlaceholder: {
  width: 110,
  height: 175,
  borderRadius: 14,
  backgroundColor: "#D8CDBB",
},

emptyState: {
  paddingVertical: 24,
  alignItems: "center",
},

emptyTitle: {
  color: "#F7F0E4",
  fontSize: 26,
  fontFamily: "CormorantGaramond_600SemiBold",
},

emptyText: {
  color: "#E5EEE2",
  fontSize: 18,
  marginTop: 6,
  fontFamily: "CormorantGaramond_500Medium",
  textAlign: "center",
},
});