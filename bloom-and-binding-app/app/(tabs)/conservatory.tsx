import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CONSERVATORY_STORAGE_KEY = "bloom-and-binding-conservatory-placements";
const UNCLAIMED_BLOOMS_KEY = "bloom-and-binding-unclaimed-blooms";

const flowerAssets: Record<string, any> = {
  hydrangea: require("../../assets/conservatory/hydrangea.png"),
  peony: require("../../assets/conservatory/peony.png"),
  rose: require("../../assets/conservatory/rose.png"),
  tulip: require("../../assets/conservatory/tulip.png"),
  lavender: require("../../assets/conservatory/lavender.png"),
  sunflower: require("../../assets/conservatory/sunflower.png"),
  daisy: require("../../assets/conservatory/daisy.png"),
  wildflowers: require("../../assets/conservatory/wildflowers.png"),
  ranunculus: require("../../assets/conservatory/ranunculus.png"),
  cosmos: require("../../assets/conservatory/cosmos.png"),

  "mid-hydrangea": require("../../assets/conservatory/mid-hydrangea.png"),
  "mid-peony": require("../../assets/conservatory/mid-peony.png"),
  "mid-rose": require("../../assets/conservatory/mid-rose.png"),
  "mid-tulip": require("../../assets/conservatory/mid-tulip.png"),
  "mid-lavender": require("../../assets/conservatory/mid-lavender.png"),
  "mid-sunflower": require("../../assets/conservatory/mid-sunflower.png"),
  "mid-daisy": require("../../assets/conservatory/mid-daisy.png"),
  "mid-wildflowers": require("../../assets/conservatory/mid-wildflowers.png"),
  "mid-ranunculus": require("../../assets/conservatory/mid-ranunculus.png"),
  "mid-cosmos": require("../../assets/conservatory/mid-cosmos.png"),

  "upper-hydrangea": require("../../assets/conservatory/upper-hydrangea.png"),
  "upper-peony": require("../../assets/conservatory/upper-peony.png"),
  "upper-rose": require("../../assets/conservatory/upper-rose.png"),
  "upper-tulip": require("../../assets/conservatory/upper-tulip.png"),
  "upper-lavender": require("../../assets/conservatory/upper-lavender.png"),
  "upper-sunflower": require("../../assets/conservatory/upper-sunflower.png"),
  "upper-daisy": require("../../assets/conservatory/upper-daisy.png"),
  "upper-wildflowers": require("../../assets/conservatory/upper-wildflowers.png"),
  "upper-ranunculus": require("../../assets/conservatory/upper-ranunculus.png"),
  "upper-cosmos": require("../../assets/conservatory/upper-cosmos.png"),

  ghostpot: require("../../assets/conservatory/ghostpot.png"),
  "mid-ghostpot": require("../../assets/conservatory/mid-ghostpot.png"),
  "upper-ghostpot": require("../../assets/conservatory/upper-ghostpot.png"),
};

const flowerPreviewAssets: Record<string, any> = {
  hydrangea: require("../../assets/conservatory/hydrangea.png"),
  peony: require("../../assets/conservatory/peony.png"),
  rose: require("../../assets/conservatory/rose.png"),
  tulip: require("../../assets/conservatory/tulip.png"),
  lavender: require("../../assets/conservatory/lavender.png"),
  sunflower: require("../../assets/conservatory/sunflower.png"),
  daisy: require("../../assets/conservatory/daisy.png"),
  wildflowers: require("../../assets/conservatory/wildflowers.png"),
  ranunculus: require("../../assets/conservatory/ranunculus.png"),
  cosmos: require("../../assets/conservatory/cosmos.png"),
};

const shelves = [
  { id: "top", top: "13.9%" },
  { id: "second", top: "26.4%" },
  { id: "third", top: "39.7%" },
  { id: "fourth", top: "65.2%" },
  { id: "fifth", top: "77.5%" },
];

const slotLefts = ["16%", "33%", "50%", "67%", "84%"];

const flowerOptions = [
  "hydrangea",
  "peony",
  "rose",
  "tulip",
  "lavender",
  "sunflower",
  "daisy",
  "wildflowers",
  "ranunculus",
  "cosmos",
];

const flowerAdjustments: Record<
  string,
  {
    lower: { scale: number; y: number; x?: number };
    mid: { scale: number; y: number; x?: number };
    upper: { scale: number; y: number; x?: number };
  }
> = {
  hydrangea: {
    lower: { scale: 1.1, y: -8 },
    mid: { scale: 1.08, y: -11 },
    upper: { scale: 1.2, y: -14 },
  },
  peony: {
    lower: { scale: 1.1, y: -8 },
    mid: { scale: 1.06, y: -11.2 },
    upper: { scale: 1.24, y: -15 },
  },
  rose: {
    lower: { scale: 1.172, y: -10 },
    mid: { scale: 1.08, y: -12.6 },
    upper: { scale: 1.21, y: -12.2 },
  },
  tulip: {
    lower: { scale: 1.18, y: -10 },
    mid: { scale: 1.12, y: -14.8 },
    upper: { scale: 1.2, y: -15 },
  },
  lavender: {
    lower: { scale: 1.2, y: -12 },
    mid: { scale: 1.08, y: -12.5 },
    upper: { scale: 1.25, y: -15 },
  },
  sunflower: {
    lower: { scale: 1.1, y: -9 },
    mid: { scale: 1.1, y: -8.5 },
    upper: { scale: 1.21, y: -7 },
  },
  daisy: {
    lower: { scale: 1.15, y: -11 },
    mid: { scale: 1.08, y: -11 },
    upper: { scale: 1.19, y: -11 },
  },
  wildflowers: {
    lower: { scale: 1.2, y: -13 },
    mid: { scale: 1.1, y: -9 },
    upper: { scale: 1.25, y: -12 },
  },
  ranunculus: {
    lower: { scale: 1.18, y: -12 },
    mid: { scale: 1.05, y: -11 },
    upper: { scale: 1.18, y: -12 },
  },
  cosmos: {
    lower: { scale: 1.15, y: -12 },
    mid: { scale: 1.05, y: -12 },
    upper: { scale: 1.18, y: -10 },
  },
};

type PlacedFlower = {
  shelfIndex: number;
  slotIndex: number;
  flower: string;
  year?: number;
  bookId?: string;
  bookTitle?: string;
  author?: string;
  finishedAt?: string;
  coverUrl?: string;
};

type UnclaimedBloom = {
  bookId: string;
  title: string;
  author?: string;
  finishedAt?: string;
  coverUrl?: string;
};

type PendingPlacement = {
  flower: string;
  year: number;
  bookId?: string;
  bookTitle?: string;
  author?: string;
  finishedAt?: string;
  coverUrl?: string;
};

export default function ConservatoryScreen() {
  const {
    placingFlower,
    selectedFlower,
    bookId,
    bookTitle,
    author,
    finishedAt,
    coverUrl,
  } = useLocalSearchParams();

  const selectedFlowerName = Array.isArray(selectedFlower)
    ? selectedFlower[0]
    : selectedFlower;

  const selectedBookId = Array.isArray(bookId) ? bookId[0] : bookId;
  const selectedBookTitle = Array.isArray(bookTitle) ? bookTitle[0] : bookTitle;
  const selectedAuthor = Array.isArray(author) ? author[0] : author;
  const selectedFinishedAt = Array.isArray(finishedAt)
    ? finishedAt[0]
    : finishedAt;
  const selectedCoverUrl = Array.isArray(coverUrl)
    ? coverUrl[0]
    : coverUrl;

  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [placedFlowers, setPlacedFlowers] = useState<PlacedFlower[]>([]);
  const [unclaimedBlooms, setUnclaimedBlooms] = useState<UnclaimedBloom[]>([]);
  const [flowerModalVisible, setFlowerModalVisible] = useState(false);
  const [pickerSelectedFlower, setPickerSelectedFlower] = useState<string | null>(
    null
  );
  const [pendingPlacement, setPendingPlacement] =
    useState<PendingPlacement | null>(null);
  const [selectedPlacedFlower, setSelectedPlacedFlower] =
    useState<PlacedFlower | null>(null);
    const [changingPlacedFlower, setChangingPlacedFlower] =
  useState<PlacedFlower | null>(null);

  const getYearFromDate = (dateString?: string) => {
    if (!dateString) return currentYear;

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return currentYear;

    return date.getFullYear();
  };

  useEffect(() => {
    const loadData = async () => {
      const savedPlacements = await AsyncStorage.getItem(
        CONSERVATORY_STORAGE_KEY
      );

      if (savedPlacements) {
        const parsed = JSON.parse(savedPlacements);

        const upgraded = parsed.map((flower: PlacedFlower) => ({
          ...flower,
          year: flower.year ?? getYearFromDate(flower.finishedAt),
        }));

        setPlacedFlowers(upgraded);
      }

      const savedBlooms = await AsyncStorage.getItem(UNCLAIMED_BLOOMS_KEY);

      if (savedBlooms) {
        setUnclaimedBlooms(JSON.parse(savedBlooms));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (placingFlower === "true" && selectedFlowerName) {
  const placementYear = getYearFromDate(selectedFinishedAt);

  setSelectedYear(placementYear);

  setPendingPlacement({
        flower: selectedFlowerName,
        year: placementYear,
        bookId: selectedBookId ?? undefined,
        bookTitle: selectedBookTitle ?? undefined,
        author: selectedAuthor ?? undefined,
        finishedAt: selectedFinishedAt ?? undefined,
        coverUrl: selectedCoverUrl ?? undefined,
      });
    }
  }, [
    placingFlower,
    selectedFlowerName,
    selectedBookId,
    selectedBookTitle,
    selectedAuthor,
    selectedFinishedAt,
    selectedCoverUrl,
  ]);

  const savePlacements = async (nextPlacements: PlacedFlower[]) => {
    setPlacedFlowers(nextPlacements);

    await AsyncStorage.setItem(
      CONSERVATORY_STORAGE_KEY,
      JSON.stringify(nextPlacements)
    );
  };

  const saveUnclaimedBlooms = async (nextBlooms: UnclaimedBloom[]) => {
    setUnclaimedBlooms(nextBlooms);

    await AsyncStorage.setItem(UNCLAIMED_BLOOMS_KEY, JSON.stringify(nextBlooms));
  };

  const removeClaimedBloom = async (claimedBookId?: string) => {
    if (!claimedBookId) return;

    const updated = unclaimedBlooms.filter(
      (bloom) => bloom.bookId !== claimedBookId
    );

    await saveUnclaimedBlooms(updated);
  };

  const visiblePlacedFlowers = useMemo(
    () =>
      placedFlowers.filter(
        (flower) => (flower.year ?? currentYear) === selectedYear
      ),
    [placedFlowers, selectedYear]
  );

  const currentUnclaimedBloom = useMemo(
    () =>
      unclaimedBlooms.find((bloom) => {
        const bloomYear = getYearFromDate(bloom.finishedAt);

        return (
          bloomYear === selectedYear &&
          !placedFlowers.some((flower) => flower.bookId === bloom.bookId)
        );
      }),
    [unclaimedBlooms, placedFlowers, selectedYear]
  );

  const isPlacingFlower =
    !!pendingPlacement &&
    pendingPlacement.year === selectedYear &&
    !placedFlowers.some(
      (flower) =>
        !!pendingPlacement.bookId && flower.bookId === pendingPlacement.bookId
    );

  const isSlotOccupied = (shelfIndex: number, slotIndex: number) =>
    visiblePlacedFlowers.some(
      (item) => item.shelfIndex === shelfIndex && item.slotIndex === slotIndex
    );

  const getShelfPerspective = (shelfIndex: number) => {
    if (shelfIndex <= 1) return "upper";
    if (shelfIndex === 2) return "mid";
    return "lower";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date unknown";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "Date unknown";

    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
const movePlacedFlower = async () => {
  if (!selectedPlacedFlower) return;

  const nextPlacements = placedFlowers.filter(
    (flower) =>
      !(
        flower.shelfIndex === selectedPlacedFlower.shelfIndex &&
        flower.slotIndex === selectedPlacedFlower.slotIndex &&
        flower.year === selectedPlacedFlower.year
      )
  );

  await savePlacements(nextPlacements);

  setPendingPlacement({
    flower: selectedPlacedFlower.flower,
    year: selectedPlacedFlower.year ?? currentYear,
    bookId: selectedPlacedFlower.bookId,
    bookTitle: selectedPlacedFlower.bookTitle,
    author: selectedPlacedFlower.author,
    finishedAt: selectedPlacedFlower.finishedAt,
    coverUrl: selectedPlacedFlower.coverUrl,
  });

  setSelectedPlacedFlower(null);
};

const changePlacedFlower = async () => {
  if (!selectedPlacedFlower) return;

  setChangingPlacedFlower(selectedPlacedFlower);
  setPickerSelectedFlower(selectedPlacedFlower.flower);
  setSelectedPlacedFlower(null);
  setFlowerModalVisible(true);
};

const deletePlacedFlowerReward = async () => {
  if (!selectedPlacedFlower) return;

  const nextPlacements = placedFlowers.filter(
    (flower) =>
      !(
        flower.shelfIndex === selectedPlacedFlower.shelfIndex &&
        flower.slotIndex === selectedPlacedFlower.slotIndex &&
        flower.year === selectedPlacedFlower.year
      )
  );

  await savePlacements(nextPlacements);

  if (selectedPlacedFlower.bookId) {
    const updatedBlooms = unclaimedBlooms.filter(
      (bloom) => bloom.bookId !== selectedPlacedFlower.bookId
    );

    await saveUnclaimedBlooms(updatedBlooms);
  }

  setSelectedPlacedFlower(null);
};

const renderFlowerPickerModal = () => (
  <Modal
    visible={flowerModalVisible}
    transparent
    animationType="fade"
    onRequestClose={() => setFlowerModalVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>Choose Your Bloom</Text>

        <ScrollView
          style={styles.flowerScroll}
          contentContainerStyle={styles.flowerScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.flowerGrid}>
            {flowerOptions.map((flower) => {
              const selected = pickerSelectedFlower === flower;

              return (
                <TouchableOpacity
                  key={flower}
                  style={[
                    styles.flowerOption,
                    selected && styles.modalOptionSelected,
                  ]}
                  onPress={() => setPickerSelectedFlower(flower)}
                >
                  <Image
                    source={flowerPreviewAssets[flower]}
                    style={styles.flowerPreview}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.flowerLabel,
                      selected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {flower}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.flowerActionRow}>
  <TouchableOpacity
    style={styles.flowerCancelButton}
    onPress={() => {
      setFlowerModalVisible(false);
      setPickerSelectedFlower(null);
      setChangingPlacedFlower(null);
    }}
  >
    <Text style={styles.flowerCancelText}>Cancel</Text>
  </TouchableOpacity>

  <TouchableOpacity
    disabled={
  !pickerSelectedFlower ||
  (!currentUnclaimedBloom && !pendingPlacement && !changingPlacedFlower)
}
    style={[
      styles.flowerClaimButton,
      (
  !pickerSelectedFlower ||
  (!currentUnclaimedBloom && !pendingPlacement && !changingPlacedFlower)
) && styles.modalDoneButtonDisabled
    ]}
    onPress={() => {
      if (changingPlacedFlower && pickerSelectedFlower) {
  const nextPlacements = placedFlowers.map((flower) => {
    const isTargetFlower =
      flower.shelfIndex === changingPlacedFlower.shelfIndex &&
      flower.slotIndex === changingPlacedFlower.slotIndex &&
      flower.year === changingPlacedFlower.year;

    if (!isTargetFlower) return flower;

    return {
      ...flower,
      flower: pickerSelectedFlower,
    };
  });

  savePlacements(nextPlacements);

  setFlowerModalVisible(false);
  setPickerSelectedFlower(null);
  setChangingPlacedFlower(null);
  return;
}
      if (!pickerSelectedFlower || (!currentUnclaimedBloom && !pendingPlacement)) return;

      setPendingPlacement({
  flower: pickerSelectedFlower,
  year:
    pendingPlacement?.year ??
    getYearFromDate(currentUnclaimedBloom?.finishedAt),
  bookId: pendingPlacement?.bookId ?? currentUnclaimedBloom?.bookId,
  bookTitle: pendingPlacement?.bookTitle ?? currentUnclaimedBloom?.title,
  author: pendingPlacement?.author ?? currentUnclaimedBloom?.author,
  finishedAt: pendingPlacement?.finishedAt ?? currentUnclaimedBloom?.finishedAt,
  coverUrl: pendingPlacement?.coverUrl ?? currentUnclaimedBloom?.coverUrl,
});

      setFlowerModalVisible(false);
      setPickerSelectedFlower(null);
    }}
  >
    <Text style={styles.flowerClaimText}>Claim Bloom</Text>
  </TouchableOpacity>
</View>
</View>
    </View>
  </Modal>
);

const renderFlowerInfoModal = () => (
  <Modal
    visible={!!selectedPlacedFlower}
    transparent
    animationType="fade"
    onRequestClose={() => setSelectedPlacedFlower(null)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.infoCard}>
        <Text style={styles.infoKicker}>Bloomed From</Text>

        {selectedPlacedFlower?.coverUrl && (
          <Image
            source={{ uri: selectedPlacedFlower.coverUrl }}
            style={styles.infoCover}
            resizeMode="cover"
          />
        )}

        <Text style={styles.infoTitle}>
          {selectedPlacedFlower?.bookTitle ?? "Untitled Book"}
        </Text>

        {!!selectedPlacedFlower?.author && (
          <Text style={styles.infoAuthor}>{selectedPlacedFlower.author}</Text>
        )}

        <Text style={styles.infoDate}>
          Finished {formatDate(selectedPlacedFlower?.finishedAt)}
        </Text>

        <Text style={styles.infoFlower}>
          Bloom: {selectedPlacedFlower?.flower}
        </Text>

        <View style={styles.infoButtonGrid}>
          <TouchableOpacity
            style={styles.infoActionButton}
            onPress={movePlacedFlower}
          >
            <Text style={styles.infoActionText}>Move Bloom</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoActionButton}
            onPress={changePlacedFlower}
          >
            <Text style={styles.infoActionText}>Change Bloom</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.infoActionButton, styles.deleteActionButton]}
            onPress={deletePlacedFlowerReward}
          >
            <Text style={styles.infoActionText}>Delete Bloom</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoActionButton}
            onPress={() => setSelectedPlacedFlower(null)}
          >
            <Text style={styles.infoActionText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/conservatory/conservatory-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {renderFlowerPickerModal()}
        {renderFlowerInfoModal()}

        <View style={styles.yearSelector}>
          <TouchableOpacity
  style={styles.yearArrowButton}
  disabled={isPlacingFlower}
  onPress={() => {
    if (isPlacingFlower) return;
    setSelectedYear((year) => year - 1);
  }}
>
  <Text style={styles.yearArrowText}>‹</Text>
</TouchableOpacity>

          <Text style={styles.yearText}>{selectedYear}</Text>

          <TouchableOpacity
  style={styles.yearArrowButton}
  disabled={isPlacingFlower}
  onPress={() => {
    if (isPlacingFlower) return;
    setSelectedYear((year) => year + 1);
  }}
>
  <Text style={styles.yearArrowText}>›</Text>
</TouchableOpacity>
        </View>

        {currentUnclaimedBloom && !isPlacingFlower && (
          <TouchableOpacity
            style={styles.claimBloomButton}
            onPress={() => {
              setPickerSelectedFlower(null);
              setFlowerModalVisible(true);
            }}
          >
            <Image
              source={require("../../assets/images/save-leaf.png")}
              style={styles.claimBloomIcon}
              resizeMode="contain"
            />
            <Text style={styles.claimBloomText}>Claim Your Bloom</Text>
          </TouchableOpacity>
        )}

        {shelves.map((shelf, shelfIndex) => {
          return slotLefts.map((left, slotIndex) => {
            const placedFlower = visiblePlacedFlowers.find(
              (item) =>
                item.shelfIndex === shelfIndex && item.slotIndex === slotIndex
            );

            const perspective = getShelfPerspective(shelfIndex);

            const flowerKey = placedFlower
              ? perspective === "upper"
                ? `upper-${placedFlower.flower}`
                : perspective === "mid"
                ? `mid-${placedFlower.flower}`
                : placedFlower.flower
              : null;

            const adjustment = placedFlower
              ? flowerAdjustments[placedFlower.flower]?.[perspective] ?? {
                  scale: 1,
                  y: 0,
                  x: 0,
                }
              : { scale: 1, y: 0, x: 0 };

            return (
              <Pressable
                key={`${selectedYear}-${shelf.id}-${slotIndex}`}
                style={[
                  styles.slot,
                  {
                    top: shelf.top as any,
                    left: left as any,
                  },
                ]}
                onPress={async () => {
                  if (placedFlower && !isPlacingFlower) {
                    setSelectedPlacedFlower(placedFlower);
                    return;
                  }

                  if (
                    isPlacingFlower &&
                    !isSlotOccupied(shelfIndex, slotIndex) &&
                    pendingPlacement
                  ) {
                    const nextPlacements = [
                      ...placedFlowers,
                      {
                        shelfIndex,
                        slotIndex,
                        flower: pendingPlacement.flower,
                        year: pendingPlacement.year,
                        bookId: pendingPlacement.bookId,
                        bookTitle: pendingPlacement.bookTitle,
                        author: pendingPlacement.author,
                        finishedAt: pendingPlacement.finishedAt,
                        coverUrl: pendingPlacement.coverUrl,
                      },
                    ];

                    await savePlacements(nextPlacements);
                    await removeClaimedBloom(pendingPlacement.bookId);
                    setPendingPlacement(null);
                  }
                }}
              >
                {placedFlower && (
                  <Image
                    source={flowerAssets[flowerKey!]}
                    style={[
                      perspective === "upper"
                        ? styles.upperPlant
                        : perspective === "mid"
                        ? styles.midPlant
                        : styles.plant,
                      {
                        transform: [
                          { translateX: adjustment.x ?? 0 },
                          { translateY: adjustment.y },
                          { scale: adjustment.scale },
                        ],
                      },
                    ]}
                    resizeMode="contain"
                  />
                )}

                {!placedFlower && isPlacingFlower && (
                  <Image
                    source={
                      perspective === "upper"
                        ? flowerAssets["upper-ghostpot"]
                        : perspective === "mid"
                        ? flowerAssets["mid-ghostpot"]
                        : flowerAssets.ghostpot
                    }
                    style={
                      perspective === "upper"
                        ? styles.upperGhostPot
                        : perspective === "mid"
                        ? styles.midGhostPot
                        : styles.ghostPot
                    }
                    resizeMode="contain"
                  />
                )}
              </Pressable>
            );
          });
        })}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efe8d7",
  },

  background: {
    flex: 0,
    width: "100%",
    height: "100%",
  },

  yearSelector: {
    position: "absolute",
    top: 48,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(253, 248, 236, 0.92)",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 25,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  yearArrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  yearArrowText: {
    fontSize: 26,
    lineHeight: 28,
    fontFamily: "CormorantGaramond_500Medium",
    color: "#234028",
  },

  yearText: {
    minWidth: 54,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "CormorantGaramond_500Medium",
    color: "#234028",
  },

  slot: {
    position: "absolute",
    width: 68,
    height: 92,
    marginLeft: -34,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  plant: {
    width: 72,
    height: 86,
  },

  midPlant: {
    width: 66,
    height: 86,
  },

  upperPlant: {
    width: 60,
    height: 86,
  },

  ghostPot: {
    width: 63,
    height: 63,
    opacity: 0.4,
  },

  midGhostPot: {
    width: 60,
    height: 60,
    opacity: 0.4,
  },

  upperGhostPot: {
    width: 60,
    height: 60,
    opacity: 0.4,
  },

  claimBloomButton: {
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "58%",
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "#FDF8EC",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    zIndex: 20,
  },

  claimBloomIcon: {
    width: 22,
    height: 22,
    marginRight: 5,
  },

  claimBloomText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "CormorantGaramond_500Medium",
    color: "#234028",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    maxHeight: "82%",
    borderRadius: 28,
    backgroundColor: "#FDF8EC",
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#234028",
    textAlign: "center",
    marginBottom: 16,
  },

  flowerScroll: {
    maxHeight: 320,
    marginBottom: 20,
  },

  flowerScrollContent: {
    paddingBottom: 8,
  },

  flowerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },

  flowerOption: {
    width: "47%",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#F8F4EA",
  },

  flowerPreview: {
    width: 82,
    height: 82,
    marginBottom: 6,
  },

  flowerLabel: {
    fontSize: 13,
    color: "#234028",
    textAlign: "center",
    textTransform: "capitalize",
  },

  modalOptionSelected: {
    backgroundColor: "#D9E6D0",
  },

  modalOptionTextSelected: {
    fontWeight: "700",
  },

  modalBackButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#E7E0CF",
    marginBottom: 10,
  },

  modalBackText: {
    color: "#234028",
    fontSize: 15,
    fontWeight: "700",
  },

  modalDoneButton: {
    backgroundColor: "#234028",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },

  modalDoneButtonDisabled: {
    opacity: 0.45,
  },

  modalDoneText: {
    color: "#FDF8EC",
    fontSize: 15,
    fontWeight: "700",
  },

  infoCard: {
    width: "100%",
    borderRadius: 28,
    backgroundColor: "#FDF8EC",
    padding: 24,
    alignItems: "center",
  },

  infoKicker: {
    fontSize: 14,
    color: "#657A5B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  infoCover: {
    width: 96,
    height: 142,
    borderRadius: 10,
    marginBottom: 12,
  },

  infoTitle: {
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "CormorantGaramond_500Medium",
    color: "#234028",
    textAlign: "center",
    marginBottom: 6,
  },

  infoAuthor: {
    fontSize: 15,
    color: "#4A5F42",
    textAlign: "center",
    marginBottom: 12,
  },

  infoDate: {
    fontSize: 14,
    color: "#657A5B",
    textAlign: "center",
    marginBottom: 10,
  },

  infoFlower: {
    fontSize: 13,
    color: "#234028",
    textTransform: "capitalize",
    marginBottom: 18,
  },

  infoButtonGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 4,
  },

  infoActionButton: {
    width: "48%",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#234028",
  },

  deleteActionButton: {
    backgroundColor: "#234028",
  },

  infoActionText: {
    color: "#FDF8EC",
    fontSize: 17,
    fontWeight: "500",
    fontFamily: "CormorantGaramond_500Medium",
  },

  flowerActionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 4,
},

flowerCancelButton: {
  flex: 1,
  borderRadius: 14,
  paddingVertical: 11,
  alignItems: "center",
  backgroundColor: "#E7E0CF",
},

flowerCancelText: {
  color: "#234028",
  fontSize: 17,
  fontWeight: "500",
  fontFamily: "CormorantGaramond_500Medium",
},

flowerClaimButton: {
  flex: 1,
  backgroundColor: "#234028",
  borderRadius: 14,
  paddingVertical: 11,
  alignItems: "center",
},

flowerClaimText: {
  color: "#FDF8EC",
  fontSize: 17,
  fontWeight: "500",
  fontFamily: "CormorantGaramond_500Medium",
},
});