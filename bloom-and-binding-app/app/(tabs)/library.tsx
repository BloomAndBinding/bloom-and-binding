import React from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const currentlyReading = [
  {
    id: "1",
    cover: "https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg",
  },
  {
    id: "2",
    cover: "https://covers.openlibrary.org/b/isbn/9780553213119-L.jpg",
  },
  {
    id: "3",
    cover: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
  },
];

const libraryBooks = [
  { id: "1", cover: "https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg" },
  { id: "2", cover: "https://covers.openlibrary.org/b/isbn/9780553213119-L.jpg" },
  { id: "3", cover: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg" },
  { id: "4", cover: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg" },
  { id: "5", cover: "https://covers.openlibrary.org/b/isbn/9780142437209-L.jpg" },
  { id: "6", cover: "https://covers.openlibrary.org/b/isbn/9780143105428-L.jpg" },
  { id: "7", cover: "https://covers.openlibrary.org/b/isbn/9781503280786-L.jpg" },
  { id: "8", cover: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg" },
  { id: "9", cover: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg" },
];

export default function LibraryScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/library-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
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
              <TouchableOpacity style={styles.iconBubble}>
                <Feather name="search" size={20} color="#234028" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBubble}>
                <Feather name="sliders" size={20} color="#234028" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionLabel}>CURRENTLY READING</Text>

          <View style={styles.shelfWrapper}>
            <View style={styles.currentBooksRow}>
              {currentlyReading.map((book) => (
                <Image
                  key={book.id}
                  source={{ uri: book.cover }}
                  style={styles.currentBook}
                />
              ))}
            </View>

            <Image
              source={require("../../assets/images/reading-shelf.png")}
              style={styles.shelf}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.sectionLabel}>ALL BOOKS</Text>

          <FlatList
            data={libraryBooks}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <Image source={{ uri: item.cover }} style={styles.gridBook} />
            )}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  topFade: {
    ...StyleSheet.absoluteFillObject,
    height: 280,
  },

  safeArea: {
    flex: 1,
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
  },

  title: {
    fontSize: 42,
    fontFamily: "Georgia",
    color: "#1f3324",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
  },

  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(248, 241, 228, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  sectionLabel: {
    marginTop: 36,
    marginBottom: 18,
    fontSize: 13,
    letterSpacing: 1.5,
    color: "#4a5b45",
    fontWeight: "600",
  },

  shelfWrapper: {
    alignItems: "center",
    marginBottom: -260,
  },

  currentBooksRow: {
    flexDirection: "row",
    gap: 16,
    zIndex: 2,
  },

  currentBook: {
    width: 82,
    height: 122,
    borderRadius: 10,
  },

  shelf: {
    width: 1800,
    height: 550,
    marginTop: -254,
    zIndex: 1,
  },

  grid: {
    paddingBottom: 2,
  },

  gridRow: {
    justifyContent: "space-between",
    marginBottom: 22,
  },

  gridBook: {
    width: 100,
    height: 150,
    borderRadius: 14,
  },
});