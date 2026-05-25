import React, { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { getSavedBooks, SavedBook, getYearlyGoal, saveYearlyGoal } from "../../services/libraryStorage";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/build/Feather";


export default function HomeScreen() {
  const router = useRouter();
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
const [yearlyGoal, setYearlyGoal] = useState(24);
const [goalEditorOpen, setGoalEditorOpen] = useState(false);
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useFocusEffect(
  useCallback(() => {
    const loadBooks = async () => {
      const books = await getSavedBooks();
      const savedGoal = await getYearlyGoal();

      setSavedBooks(books);
      setYearlyGoal(savedGoal);
    };

    loadBooks();
  }, [])
);

const currentlyReading = savedBooks.find(
    (book) => book.status === "Currently Reading"
  );

  const recentlyAdded = [...savedBooks].reverse().slice(0, 3);

  const progressPercent =
    currentlyReading?.progressType === "percentage"
      ? Number(currentlyReading.progressValue || 0)
      : 0;

      const currentYear = new Date().getFullYear();

const booksFinishedThisYear = savedBooks.filter((book) => {
  if (book.status !== "Finished" || !book.finishedAt) return false;
  return new Date(book.finishedAt).getFullYear() === currentYear;
}).length;

const goalProgress = Math.min(booksFinishedThisYear / yearlyGoal, 1);

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
              Welcome back to your reading sanctuary
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
                Pick your next adventure from the library!
              </Text>
            </View>
          )}
        </View>

<TouchableOpacity
  style={styles.goalCard}
  activeOpacity={0.85}
  onPress={() => setGoalEditorOpen(true)}
>
  <View style={styles.goalHeader}>
    <Text style={styles.goalTitle}>{currentYear} Reading Goal</Text>
    <View style={styles.goalCountRow}>
  <Text style={styles.goalCount}>
    {booksFinishedThisYear} / {yearlyGoal}
  </Text>

  <Feather name="edit-2" size={14} color="#234028" />
</View>
  </View>

  <View style={styles.goalProgressTrack}>
    <View
      style={[
        styles.goalProgressFill,
        { width: `${goalProgress * 100}%` },
      ]}
    />
  </View>

  <Text style={styles.goalSubtext}>books completed this year</Text>
</TouchableOpacity>

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

        <Modal
  visible={goalEditorOpen}
  transparent
  animationType="fade"
  onRequestClose={() => setGoalEditorOpen(false)}
>
  <View style={styles.goalModalOverlay}>
    <TouchableOpacity
      style={styles.goalModalBackdrop}
      activeOpacity={1}
      onPress={() => setGoalEditorOpen(false)}
    />

    <View style={styles.goalModalCard}>
      <View style={styles.goalPickerWrap}>
        <Picker
          selectedValue={yearlyGoal}
          onValueChange={(value) => {
            setYearlyGoal(value);
          }}
          itemStyle={styles.goalPickerItem}
        >
          {Array.from({ length: 200 }, (_, index) => index + 1).map((goal) => (
            <Picker.Item key={goal} label={`${goal}`} value={goal} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.goalSaveButton}
        onPress={async () => {
          await saveYearlyGoal(yearlyGoal);
          setGoalEditorOpen(false);
        }}
      >
        <Text style={styles.goalSaveText}>Save Goal</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
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

goalCard: {
  backgroundColor: "rgba(255, 248, 238, 0.62)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  borderRadius: 24,
  padding: 18,
  marginTop: 18,
  marginBottom: -12,
  marginHorizontal: 20,
},

goalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
},

goalTitle: {
  fontSize: 26,
  color: "#234028",
  fontFamily: "CormorantGaramond_600SemiBold",
},

goalCount: {
  fontSize: 22,
  color: "#234028",
  fontFamily: "CormorantGaramond_600SemiBold",
},

goalProgressTrack: {
  height: 12,
  backgroundColor: "rgba(216, 205, 187, 0.55)",
  borderRadius: 99,
  overflow: "hidden",
},

goalProgressFill: {
  height: "100%",
  backgroundColor: "#A8B39A",
  borderRadius: 99,
},

goalSubtext: {
  marginTop: 10,
  fontSize: 16,
  color: "#6D745F",
  fontFamily: "CormorantGaramond_500Medium",
},

goalEditButton: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},

goalModalOverlay: {
  flex: 1,
  backgroundColor: "rgba(31, 51, 36, 0.25)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
},

goalModalCard: {
  width: "90%",
  borderRadius: 28,
  backgroundColor: "rgba(255, 248, 238, 0.97)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  padding: 22,
},

goalModalTitle: {
  fontSize: 28,
  color: "#234028",
  textAlign: "center",
  fontFamily: "CormorantGaramond_600SemiBold",
  marginBottom: 16,
},

goalInput: {
  backgroundColor: "rgba(255, 253, 248, 0.7)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  borderRadius: 18,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 24,
  color: "#234028",
  textAlign: "center",
  fontFamily: "CormorantGaramond_600SemiBold",
  marginBottom: 16,
},

goalSaveButton: {
  backgroundColor: "#b9bea7",
  borderRadius: 18,
  paddingVertical: 13,
  alignItems: "center",
},

goalSaveText: {
  color: "#1f3324",
  fontSize: 20,
  fontFamily: "CormorantGaramond_600SemiBold",
},

goalModalBackdrop: {
  ...StyleSheet.absoluteFillObject,
},

goalPickerWrap: {
  height: 170,
  backgroundColor: "rgba(255, 253, 248, 0.7)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  borderRadius: 18,
  overflow: "hidden",
  marginBottom: 16,
},

goalPickerItem: {
  fontSize: 24,
  color: "#234028",
  fontFamily: "CormorantGaramond_600SemiBold",
},

goalCountRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},

});