import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";

type PotStyle = "default" | "premium";

type PotData = {
  id: string;
  genre: string;
  flower: string;
  meaning: string;
  books: string[];
  readCount: number;
  potStyle: PotStyle;
  position: {
    top: number;
    left: number;
  };
};

const potAssets = {
  default: require("../../assets/images/default-pot.png"),
  premium: require("../../assets/images/ornate-stone-pot.png"),
};

const peonyAssets = {
  1: require("../../assets/images/peony.png"),
  2: require("../../assets/images/peony-2.png"),
  3: require("../../assets/images/peony-3.png"),
  4: require("../../assets/images/peony-4.png"),
  complete: require("../../assets/images/peony-complete.png"),
};

function getPeonyAsset(readCount: number) {
  if (readCount >= 5) return peonyAssets.complete;
  if (readCount === 4) return peonyAssets[4];
  if (readCount === 3) return peonyAssets[3];
  if (readCount === 2) return peonyAssets[2];
  return peonyAssets[1];
}

const samplePots: PotData[] = [
  {
    id: "1",
    genre: "Romance",
    flower: "Peony",
    meaning:
      "Peonies symbolize love, devotion, and emotional abundance—a fitting bloom for stories of longing, passion, and happily-ever-afters.",
    books: ["Fourth Wing"],
    readCount: 1,
    potStyle: "default",
    position: { top: 355, left: 65 },
  },
  {
    id: "2",
    genre: "Romance",
    flower: "Peony",
    meaning:
      "A fuller peony arrangement marks a growing collection of romantic stories.",
    books: ["Fourth Wing", "The Notebook", "Pride & Prejudice"],
    readCount: 3,
    potStyle: "default",
    position: { top: 355, left: 170 },
  },
  {
    id: "3",
    genre: "Premium Romance",
    flower: "Peony",
    meaning:
      "Premium users can customize pot styles while keeping their floral collection.",
    books: ["Fourth Wing", "The Notebook", "Pride & Prejudice", "Beach Read", "Book Lovers"],
    readCount: 5,
    potStyle: "premium",
    position: { top: 360, left: 275 },
  },
];

function PotSpot({
  pot,
  onPress,
}: {
  pot: PotData;
  onPress: () => void;
}) {
  const isPremium = pot.potStyle === "premium";

  const potSize = isPremium
    ? { width: 95, height: 115 }
    : { width: 95, height: 95 };

  const flowerTop = isPremium ? 46 : 68;

  return (
    <TouchableOpacity
      style={[
        styles.potContainer,
        {
          top: pot.position.top,
          left: pot.position.left,
        },
      ]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image
        source={potAssets[pot.potStyle]}
        resizeMode="contain"
        style={[
          styles.potImage,
          {
            width: potSize.width,
            height: potSize.height,
          },
        ]}
      />

      <Image
        source={getPeonyAsset(pot.readCount)}
        resizeMode="contain"
        style={[
          styles.flowerImage,
          {
            top: flowerTop,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

export default function ConservatoryScreen() {
  const [selectedPot, setSelectedPot] = useState<PotData | null>(null);

  return (
    <ImageBackground
      source={require("../../assets/images/reading-conservatory-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {samplePots.map((pot) => (
          <PotSpot
            key={pot.id}
            pot={pot}
            onPress={() => setSelectedPot(pot)}
          />
        ))}

        <Modal visible={!!selectedPot} transparent animationType="fade">
          <BlurView intensity={45} tint="light" style={styles.modalBackdrop}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setSelectedPot(null)}
            >
              <Pressable style={styles.modalCard}>
                <Text style={styles.genreTitle}>{selectedPot?.genre}</Text>

                <Text style={styles.flowerName}>{selectedPot?.flower}</Text>

                <Text style={styles.meaning}>{selectedPot?.meaning}</Text>

                <Text style={styles.booksHeader}>Books in Bloom</Text>

                {selectedPot?.books.map((book, index) => (
                  <Text key={index} style={styles.bookItem}>
                    • {book}
                  </Text>
                ))}
              </Pressable>
            </Pressable>
          </BlurView>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    position: "relative",
  },

  potContainer: {
    position: "absolute",
    width: 120,
    height: 220,
    alignItems: "center",

    shadowColor: "#8a6d4f",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  potImage: {
    position: "absolute",
    bottom: 0,
    zIndex: 2,
  },

  flowerImage: {
    position: "absolute",
    width: 60,
    height: 140,
    zIndex: 3,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    width: "88%",
    backgroundColor: "rgba(252,246,236,0.96)",
    borderRadius: 28,
    padding: 28,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  genreTitle: {
    fontSize: 30,
    fontFamily: "Georgia",
    color: "#2d3f2f",
    textAlign: "center",
    marginBottom: 8,
  },

  flowerName: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#556b55",
    textAlign: "center",
    marginBottom: 30,
  },

  meaning: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4a5b45",
    textAlign: "center",
    marginBottom: 24,
  },

  booksHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3f2f",
    marginBottom: 12,
  },

  bookItem: {
    fontSize: 15,
    color: "#4a5b45",
    marginBottom: 8,
  },
});