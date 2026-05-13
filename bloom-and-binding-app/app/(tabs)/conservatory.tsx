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

type PotData = {
  id: string;
  genre: string;
  flower: string;
  meaning: string;
  books: string[];
  potStyle: any;
  flowerAsset?: any;

  position: {
    top: number;
    left: number;
  };

  potSize: {
    width: number;
    height: number;
  };

  flowerSize: {
    width: number;
    height: number;
  };

  flowerOffset: {
    top: number;
  };
};

const samplePots: PotData[] = [
  {
    id: "1",
    genre: "Romance",
    flower: "Peony",
    meaning: "Peonies symbolize love and devotion.",
    books: ["Fourth Wing"],
flowerAsset: require("../../assets/images/peony.png"),
    potStyle: require("../../assets/images/default-pot.png"),

    flowerSize: {
      width: 120,
      height: 135,
    },

    flowerOffset: {
      top: 68,
    },

        position: {
      top: 420,
      left: 70,
    },

    potSize: {
      width: 95,
      height: 95,
    },
  },

  {
    id: "2",
    genre: "Premium Romance",
    flower: "Peony",
    meaning: "Premium users can customize pot styles.",
    books: ["Fourth Wing"],

    potStyle: require("../../assets/images/ornate-stone-pot.png"),
    flowerAsset: require("../../assets/images/peony.png"),

    position: {
      top: 395,
      left: 220,
    },

    potSize: {
      width: 125,
      height: 150,
    },

    flowerSize: {
      width: 120,
      height: 135,
    },

    flowerOffset: {
      top: 46,
    },
  },
];

function PotSpot({
  pot,
  onPress,
}: {
  pot: PotData;
  onPress: () => void;
}) {
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
  source={pot.potStyle}
  resizeMode="contain"
  style={{
    position: "absolute",
    width: pot.potSize.width,
    height: pot.potSize.height,
    bottom: 0,
    zIndex: 2,
  }}
/>

{pot.flowerAsset && (
  <Image
    source={pot.flowerAsset}
    resizeMode="contain"
    style={{
      position: "absolute",
      width: pot.flowerSize.width,
      height: pot.flowerSize.height,
      top: pot.flowerOffset.top,
      zIndex: 3,
    }}
  />
)}
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
                <Text style={styles.genreTitle}>
                  {selectedPot?.genre}
                </Text>

                <Text style={styles.flowerName}>
                  {selectedPot?.flower}
                </Text>

                <Text style={styles.meaning}>
                  {selectedPot?.meaning}
                </Text>

                <Text style={styles.booksHeader}>
                  Books in Bloom
                </Text>

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
    width: 150,
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
    marginBottom: 20,
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