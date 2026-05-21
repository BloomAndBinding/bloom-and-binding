import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,    
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  searchGoogleBooks,
  searchGoogleBooksByIsbn,
  GoogleBookResult,
} from "../services/googleBooks";

export default function AddBookScreen() {
  const router = useRouter();
const { isbn } = useLocalSearchParams();
const [handledIsbn, setHandledIsbn] = useState("");

useEffect(() => {
  if (isbn && String(isbn) !== handledIsbn) {
    const scannedIsbn = String(isbn);
    setHandledIsbn(scannedIsbn);
    searchByIsbn(scannedIsbn);
  }
}, [isbn, handledIsbn]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookResult[]>([]);
  const [loading, setLoading] = useState(false);
 const searchByIsbn = async (isbn: string) => {
  try {
    setLoading(true);
    setQuery(isbn);

    const books = await searchGoogleBooksByIsbn(isbn);
    setResults(books);
  } catch (error) {
    console.error("ISBN search screen error:", error);
    setResults([]);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.trim().length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const books = await searchGoogleBooks(text);
      console.log("Books returned to screen:", books.length);
      setResults(books);
    } catch (error) {
      console.error("Search screen error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <Image
  source={require("../assets/images/save-leaf.png")}
  style={styles.cornerLeaf}
/>
  <TouchableOpacity 
  style={styles.backButton} 
  onPress={() => router.dismissTo("/library")}
>
    <Text style={styles.backText}>‹ Back</Text>
  </TouchableOpacity>

  <Text style={styles.title}>Add a Book</Text>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#6E7B68" />
        <TextInput
          placeholder="Search title or author..."
          placeholderTextColor="#8A8A8A"
          value={query}
          onChangeText={handleSearch}
          style={styles.input}
        />
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
  style={styles.actionButton}
  onPress={() => router.push("/scan-isbn")}
>
  <Feather name="camera" size={22} color="#234028" />
  <Text style={styles.actionText}>Scan ISBN</Text>
</TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="book-open" size={18} color="#234028" />
          <Text style={styles.actionText}>AI Cover Scan</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#234028" />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          query.trim().length >= 3 && !loading ? (
            <Text style={styles.emptyText}>No books found.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookCard}
            onPress={() =>
              router.push({
                pathname: "/book-details",
                params: {
                  title: item.title,
                  author: item.authors.join(", "),
                  coverUrl: item.coverUrl ?? "",
                },
              })
            }
          >
            {item.coverUrl ? (
              <Image source={{ uri: item.coverUrl }} style={styles.cover} />
            ) : (
              <View style={styles.placeholderCover} />
            )}

            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>
                {item.authors.join(", ")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E4",
    padding: 20,
    paddingTop: 80,
  },

  title: {
  fontSize: 46,
  color: "#234028",
  marginBottom: 18,
  fontFamily: "CormorantGaramond_600SemiBold",
},

  searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255, 248, 238, 0.68)",
  borderRadius: 18,
  paddingHorizontal: 16,
  paddingVertical: 14,
  marginBottom: 18,
  borderWidth: 1,
  borderColor: "#D8CDBB",
},

  input: {
  flex: 1,
  marginLeft: 10,
  fontSize: 20,
  color: "#234028",
  fontFamily: "CormorantGaramond_500Medium",
},

  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  actionButton: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  backgroundColor: "rgba(255, 248, 238, 0.68)",
  paddingHorizontal: 18,
  paddingVertical: 14,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#D8CDBB",
  flex: 1,
  justifyContent: "center",
},

  actionText: {
  color: "#234028",
  fontSize: 20,
  fontFamily: "CormorantGaramond_600SemiBold",
},

  bookCard: {
  flexDirection: "row",
  backgroundColor: "rgba(255, 248, 238, 0.68)",
  borderRadius: 20,
  padding: 14,
  marginBottom: 14,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#D8CDBB",
},

  cover: {
    width: 50,
    height: 75,
    borderRadius: 8,
  },

  placeholderCover: {
    width: 50,
    height: 75,
    borderRadius: 8,
    backgroundColor: "#DDD",
  },

  bookInfo: {
    flex: 1,
    marginLeft: 14,
  },

  bookTitle: {
  fontSize: 24,
  color: "#234028",
  fontFamily: "CormorantGaramond_600SemiBold",
},

  bookAuthor: {
  fontSize: 18,
  color: "#5E665B",
  marginTop: 2,
  fontFamily: "CormorantGaramond_500Medium",
},

  emptyText: {
  textAlign: "center",
  color: "#5E665B",
  marginTop: 30,
  fontSize: 22,
  fontFamily: "CormorantGaramond_500Medium",
},

  backButton: {
  alignSelf: "flex-start",
  marginBottom: 20,
},

backText: {
  color: "#234028",
  fontSize: 22,
  fontFamily: "CormorantGaramond_600SemiBold",
},

cornerLeaf: {
  position: "absolute",
  top: 12,
  right: -12,
  width: 150,
  height: 150,
  resizeMode: "contain",
  transform: [{ rotate: "180deg" }],
  opacity: 0.18,
},
});