import React, { useCallback, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { getSavedBooks, SavedBook } from "../../services/libraryStorage";

export default function LibraryScreen() {
  const router = useRouter();
  const [libraryBooks, setLibraryBooks] = useState<SavedBook[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Recently Added");

  const filterOptions = [
    "All",
    "Currently Reading",
    "Want to Read",
    "Finished",
    "DNF",
  ];

  const sortOptions = [
    "Recently Added",
    "Title A-Z",
    "Title Z-A",
    "Author A-Z",
    "Author Z-A",
  ];
  const filtersActive =
  selectedFilter !== "All" ||
  selectedSort !== "Recently Added";

  useFocusEffect(
    useCallback(() => {
      const loadBooks = async () => {
        const books = await getSavedBooks();
        setLibraryBooks(books);
      };

      loadBooks();
    }, [])
  );

  const currentlyReading = libraryBooks.filter(
    (book) => book.status === "Currently Reading"
  );
const filteredBooks =
  selectedFilter === "All"
    ? [...libraryBooks]
    : libraryBooks.filter((book) => book.status === selectedFilter);

const sortedBooks = [...filteredBooks].sort((a, b) => {
  switch (selectedSort) {
    case "Title A-Z":
      return a.title.localeCompare(b.title);

    case "Title Z-A":
      return b.title.localeCompare(a.title);

    case "Author A-Z":
      return (a.author || "").localeCompare(b.author || "");

    case "Author Z-A":
      return (b.author || "").localeCompare(a.author || "");

    default:
      return 0;
  }
});
  return (
    <ImageBackground
      source={require("../../assets/images/library-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(255,248,235,0.82)",
          "rgba(255,248,235,0.45)",
          "rgba(255,248,235,0.0)",
        ]}
        style={styles.topFade}
      />

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>My Library</Text>

           <View style={styles.actions}>
  <TouchableOpacity
    style={styles.iconBubble}
    onPress={() => router.push("/add-book")}
  >
    <Feather name="plus" size={22} color="#234028" />
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.iconBubble,
      filtersActive && styles.iconBubbleActive,
    ]}
    onPress={() => setFilterOpen(true)}
  >
    <Feather
      name="sliders"
      size={20}
      color={filtersActive ? "#1f3324" : "#234028"}
    />
  </TouchableOpacity>
</View>
          </View>

          <Text style={styles.sectionLabel}>CURRENTLY READING</Text>

          <View style={styles.shelfWrapper}>
            <View style={styles.currentBooksRow}>
              {currentlyReading.map((book) =>
                book.coverUrl ? (
                  <TouchableOpacity
                    key={book.id}
                    activeOpacity={0.75}
                    onPress={() =>
                      router.push({
                        pathname: "/saved-book-details",
                        params: {
  id: book.id,
  returnTo: "library",
                        },
                      })
                    }
                  >
                    <Image
                      source={{ uri: book.coverUrl }}
                      style={styles.currentBook}
                    />
                  </TouchableOpacity>
                ) : null
              )}
            </View>

            <View pointerEvents="none">
              <Image
                source={require("../../assets/images/reading-shelf.png")}
                style={styles.shelf}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.sectionLabel}>
  {selectedFilter === "All" ? "ALL BOOKS" : selectedFilter.toUpperCase()}
</Text>

          {filteredBooks.length === 0 ? (
            <Text style={styles.emptyText}>
              {selectedFilter === "All"
  ? "No books yet. Tap + to add your first one."
  : `No books marked ${selectedFilter} yet.`}
            </Text>
          ) : (
            <FlatList
              data={sortedBooks}
              extraData={sortedBooks.map((book) => book.id).join("-")} // Force re-render when book list changes
              key={sortedBooks.map((book) => book.id).join("-")}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    router.push({
                      pathname: "/saved-book-details",
                      params: {
                        id: item.id,
                      },
                    })
                  }
                >
                  {item.coverUrl ? (
                    <Image
                      source={{ uri: item.coverUrl }}
                      style={styles.gridBook}
                    />
                  ) : (
                    <View style={styles.placeholderBook}>
                      <Text style={styles.placeholderTitle} numberOfLines={3}>
                        {item.title}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </ScrollView>
        <Modal
  visible={filterOpen}
  transparent
  animationType="fade"
  onRequestClose={() => setFilterOpen(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={() => setFilterOpen(false)}
  >
    <View style={styles.filterCard}>
      <Text style={styles.filterTitle}>Library Options</Text>

<Text style={styles.filterSection}>Filter By Status</Text>

{filterOptions.map((option) => (
  <TouchableOpacity
    key={option}
    style={[
      styles.filterOption,
      selectedFilter === option && styles.filterOptionActive,
    ]}
    onPress={() => setSelectedFilter(option)}
  >
    <Text
      style={[
        styles.filterOptionText,
        selectedFilter === option && styles.filterOptionTextActive,
      ]}
    >
      {option}
    </Text>
  </TouchableOpacity>
))}

<View style={styles.divider} />

<Text style={styles.filterSection}>Sort By</Text>

{sortOptions.map((option) => (
  <TouchableOpacity
    key={option}
    style={[
      styles.filterOption,
      selectedSort === option && styles.filterOptionActive,
    ]}
    onPress={() => setSelectedSort(option)}
  >
    <Text
      style={[
        styles.filterOptionText,
        selectedSort === option && styles.filterOptionTextActive,
      ]}
    >
      {option}
    </Text>
  </TouchableOpacity>
))}

<TouchableOpacity
  style={styles.doneButton}
  onPress={() => setFilterOpen(false)}
>
  <Text style={styles.doneButtonText}>Done</Text>
</TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    zIndex: 0,
  },

  safeArea: {
    flex: 1,
    zIndex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 220,
  },

  header: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },

  title: {
  fontSize: 52,
  fontFamily: "CormorantGaramond_600SemiBold",
  color: "#1f3324",
},

  actions: {
    flexDirection: "row",
    gap: 12,
    zIndex: 1000,
    elevation: 1000,
  },

  iconBubble: {
  width: 48,
  height: 48,
  borderRadius: 18,
  backgroundColor: "rgba(255, 248, 238, 0.78)",
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  zIndex: 1001,
  elevation: 1001,
  borderWidth: 1,
borderColor: "#D8CDBB",
},

iconBubbleActive: {
  backgroundColor: "rgba(185, 190, 167, 0.85)",
  borderColor: "#9BA68E",
  shadowOpacity: 0.14,
},

  sectionLabel: {
  marginTop: 36,
  marginBottom: 18,
  fontSize: 16,
  letterSpacing: 1.8,
  color: "#4a5b45",
  fontFamily: "CormorantGaramond_600SemiBold",
},

  shelfWrapper: {
    alignItems: "center",
    marginBottom: -310,
  },

  currentBooksRow: {
    flexDirection: "row",
    gap: 16,
    zIndex: 2,
    minHeight: 144,
  },

  currentBook: {
    width: 96,
    height: 144,
    borderRadius: 12,
  },

  shelf: {
    width: 2000,
    height: 620,
    marginTop: -288,
    zIndex: 1,
  },

  grid: {
    paddingBottom: 2,
  },

  gridRow: {
    justifyContent: "flex-start",
    gap: 42,
    marginBottom: 22,
  },

  gridBook: {
    width: 100,
    height: 150,
    borderRadius: 14,
  },

  placeholderBook: {
    width: 100,
    height: 150,
    borderRadius: 14,
    backgroundColor: "rgba(248, 241, 228, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },

  placeholderTitle: {
  color: "#234028",
  textAlign: "center",
  fontSize: 18,
  lineHeight: 20,
  fontFamily: "CormorantGaramond_600SemiBold",
},

  emptyText: {
  color: "#4a5b45",
  fontSize: 24,
  textAlign: "center",
  marginTop: 24,
  fontFamily: "CormorantGaramond_500Medium",
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(31, 51, 36, 0.25)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
},

filterCard: {
  width: "90%",
  maxWidth: 340,
  borderRadius: 30,
  backgroundColor: "rgba(255, 248, 238, 0.97)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  padding: 22,
},

filterTitle: {
  fontSize: 28,
  color: "#1f3324",
  fontFamily: "CormorantGaramond_600SemiBold",
  marginBottom: 8,
  textAlign: "center",
},

filterOption: {
  paddingVertical: 6,
  paddingHorizontal: 8,
  borderRadius: 16,
},

filterOptionActive: {
  backgroundColor: "rgba(185, 190, 167, 0.55)",
},

filterOptionText: {
  fontSize: 20,
  color: "#556552",
  fontFamily: "CormorantGaramond_500Medium",
},

filterOptionTextActive: {
  color: "#1f3324",
  fontFamily: "CormorantGaramond_600SemiBold",
},

filterSection: {
  fontSize: 18,
  color: "#6c7a67",
  letterSpacing: 1.2,
  marginTop: 6,
  marginBottom: 8,
  fontFamily: "CormorantGaramond_600SemiBold",
},

divider: {
  height: 1,
  backgroundColor: "rgba(216, 205, 187, 0.8)",
  marginVertical: 16,
  opacity: 0.45
},

doneButton: {
  marginTop: 18,
  backgroundColor: "#b9bea7",
  borderRadius: 16,
  paddingVertical: 12,
  alignItems: "center",
},

doneButtonText: {
  color: "#1f3324",
  fontSize: 20,
  fontFamily: "CormorantGaramond_600SemiBold",
},
});