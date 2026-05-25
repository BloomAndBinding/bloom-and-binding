import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveBook } from "../services/libraryStorage";

type StatusOption = {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
};

type FormatOption = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

const UNCLAIMED_BLOOMS_KEY = "bloom-and-binding-unclaimed-blooms";

export default function BookDetailsScreen() {
    const formatDisplayDate = (dateString?: string) => {
  if (!dateString) return "Select date";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Select date";

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const toIsoDate = (date: Date) => date.toISOString();
  const router = useRouter();
  const { title, author, coverUrl } = useLocalSearchParams();

  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [finishedAt, setFinishedAt] = useState("");
  const [activeDateField, setActiveDateField] = useState<
  "startedAt" | "finishedAt" | null
>(null);
  const [progressType, setProgressType] = useState<"percentage" | "page">(
    "percentage"
  );
  const [progressValue, setProgressValue] = useState("0");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteDraft, setNoteDraft] = useState("");
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);

  const [formatModalVisible, setFormatModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [flowerModalVisible, setFlowerModalVisible] = useState(false);
const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
const [pendingFinishedBook, setPendingFinishedBook] = useState<{
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  finishedAt?: string;
} | null>(null);

  const formats: FormatOption[] = [
    { label: "Hardcover", icon: "book" },
    { label: "Paperback", icon: "book-open" },
    { label: "Kindle/e-Book", icon: "tablet" },
    { label: "Audiobook", icon: "headphones" },
    { label: "Borrowed", icon: "star" },
  ];

  const statuses: StatusOption[] = [
    { label: "TBR", value: "Want to Read", icon: "bookmark" },
    { label: "Reading", value: "Currently Reading", icon: "book-open" },
    { label: "DNF", value: "DNF", icon: "x-circle" },
    { label: "Finished", value: "Finished", icon: "check-circle" },
  ];

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

const flowerPreviewAssets: Record<string, any> = {
  hydrangea: require("../assets/conservatory/hydrangea.png"),
  peony: require("../assets/conservatory/peony.png"),
  rose: require("../assets/conservatory/rose.png"),
  tulip: require("../assets/conservatory/tulip.png"),
  lavender: require("../assets/conservatory/lavender.png"),
  sunflower: require("../assets/conservatory/sunflower.png"),
  daisy: require("../assets/conservatory/daisy.png"),
  wildflowers: require("../assets/conservatory/wildflowers.png"),
  ranunculus: require("../assets/conservatory/ranunculus.png"),
  cosmos: require("../assets/conservatory/cosmos.png"),
};

  const getStatusLabel = () => {
    const foundStatus = statuses.find((item) => item.value === status);
    return foundStatus ? foundStatus.label : "Choose status";
  };

  const getFormatLabel = () => {
    if (selectedFormats.length === 0) return "Choose format";
    if (selectedFormats.length === 1) return selectedFormats[0];
    return selectedFormats.join(", ");
  };

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter((item) => item !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const handleAddOrUpdateNote = () => {
    const cleanedNote = noteDraft.trim();
    if (!cleanedNote) return;

    if (editingNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editingNoteIndex] = cleanedNote;
      setNotes(updatedNotes);
      setEditingNoteIndex(null);
    } else {
      setNotes([...notes, cleanedNote]);
    }

    setNoteDraft("");
    Keyboard.dismiss();
  };

  const handleEditNote = (index: number) => {
    setNoteDraft(notes[index]);
    setEditingNoteIndex(index);
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, noteIndex) => noteIndex !== index);
    setNotes(updatedNotes);

    if (editingNoteIndex === index) {
      setEditingNoteIndex(null);
      setNoteDraft("");
    }
  };

  const handleSave = async () => {
    if (selectedFormats.length === 0) {
      Alert.alert(
        "Choose a format",
        "Please select at least one format before adding this book."
      );
      return;
    }

    if (status === "Finished" && !finishedAt) {
  Alert.alert(
    "Finished date required",
    "Please add a finished date before marking this book as finished."
  );
  return;
}

    const newBookId = `${String(title)}-${Date.now()}`;

const newBook = {
  id: newBookId,
  title: String(title),
  author: String(author),
  coverUrl: coverUrl ? String(coverUrl) : undefined,
  formats: selectedFormats,
  notes,
  quickNotes: undefined,
  status: status || undefined,
  startedAt: startedAt || undefined,
  finishedAt: status === "Finished" ? finishedAt : undefined,
  progressType: status === "Currently Reading" ? progressType : undefined,
  progressValue: status === "Currently Reading" ? progressValue : undefined,
  rating,
};

await saveBook(newBook);

if (status === "Finished") {
  const existing = await AsyncStorage.getItem(UNCLAIMED_BLOOMS_KEY);
  const blooms = existing ? JSON.parse(existing) : [];

  blooms.push({
    bookId: newBook.id,
    title: newBook.title,
    author: newBook.author,
    finishedAt: newBook.finishedAt,
    coverUrl: newBook.coverUrl,
  });

  await AsyncStorage.setItem(
    UNCLAIMED_BLOOMS_KEY,
    JSON.stringify(blooms)
  );

  setPendingFinishedBook({
    id: newBook.id,
    title: newBook.title,
    author: newBook.author,
    coverUrl: newBook.coverUrl,
    finishedAt: newBook.finishedAt,
  });

  setSelectedFlower(null);
  setFlowerModalVisible(true);
  return;
}

router.push("/(tabs)/library");
  };

  const renderFormatModal = () => (
    <Modal
      visible={formatModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setFormatModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Choose Format</Text>

          {formats.map((item) => {
            const selected = selectedFormats.includes(item.label);

            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.modalOption,
                  selected && styles.modalOptionSelected,
                ]}
                onPress={() => toggleFormat(item.label)}
                activeOpacity={0.8}
              >
                <View style={styles.modalOptionLeft}>
                  <Feather
                    name={item.icon}
                    size={18}
                    color={selected ? "#F7F0E4" : "#234028"}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      selected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>

                {selected && (
                  <Feather name="check" size={18} color="#F7F0E4" />
                )}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.modalDoneButton}
            onPress={() => setFormatModalVisible(false)}
          >
            <Text style={styles.modalDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderStatusModal = () => (
    <Modal
      visible={statusModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setStatusModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Choose Status</Text>

          {statuses.map((item) => {
            const selected = status === item.value;

            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalOption,
                  selected && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setStatus(item.value);
                  setStatusModalVisible(false);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.modalOptionLeft}>
                  <Feather
                    name={item.icon}
                    size={18}
                    color={selected ? "#F7F0E4" : "#234028"}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      selected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>

                {selected && (
                  <Feather name="check" size={18} color="#F7F0E4" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );

  const renderFlowerModal = () => (
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
              const selected = selectedFlower === flower;

              return (
                <TouchableOpacity
                  key={flower}
                  style={[
                    styles.flowerOption,
                    selected && styles.modalOptionSelected,
                  ]}
                  onPress={() => setSelectedFlower(flower)}
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

        <View style={styles.modalActionRow}>
  <TouchableOpacity
    style={styles.modalCancelButton}
    onPress={() => {
      setFlowerModalVisible(false);
      setSelectedFlower(null);
      router.push("/(tabs)/library");
    }}
  >
    <Text style={styles.modalCancelText}>Cancel</Text>
  </TouchableOpacity>

  <TouchableOpacity
    disabled={!selectedFlower || !pendingFinishedBook}
    style={[
      styles.flowerClaimButton,
      (!selectedFlower || !pendingFinishedBook) &&
        styles.modalDoneButtonDisabled,
    ]}
    onPress={async () => {
  if (!selectedFlower || !pendingFinishedBook) return;

  const existing = await AsyncStorage.getItem(UNCLAIMED_BLOOMS_KEY);
  const blooms = existing ? JSON.parse(existing) : [];

  const updatedBlooms = blooms.filter(
    (bloom: any) => bloom.bookId !== pendingFinishedBook.id
  );

  await AsyncStorage.setItem(
    UNCLAIMED_BLOOMS_KEY,
    JSON.stringify(updatedBlooms)
  );

  setFlowerModalVisible(false);

  router.push({
    pathname: "/conservatory",
    params: {
      placingFlower: "true",
      selectedFlower,
      bookId: pendingFinishedBook.id,
      bookTitle: pendingFinishedBook.title,
      author: pendingFinishedBook.author,
      finishedAt: pendingFinishedBook.finishedAt,
      coverUrl: pendingFinishedBook.coverUrl,
    },
  });
}}
  >
    <Text style={styles.flowerClaimText}>Claim Bloom</Text>
  </TouchableOpacity>
</View>
      </View>
    </View>
  </Modal>
);

  return (
    <View style={styles.background}>
      <Image
        source={require("../assets/images/save-leaf.png")}
        style={styles.cornerLeaf}
      />

      {renderFormatModal()}
      {renderStatusModal()}
      {renderFlowerModal()}

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/add-book")}
          >
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>

          <View style={styles.heroRow}>
            {coverUrl ? (
              <Image source={{ uri: String(coverUrl) }} style={styles.cover} />
            ) : (
              <View style={styles.coverPlaceholder} />
            )}

            <View style={styles.selectorColumn}>
              <TouchableOpacity
                style={styles.selectorCard}
                onPress={() => setFormatModalVisible(true)}
                activeOpacity={0.85}
              >
                <View>
                  <Text style={styles.selectorLabel}>Format</Text>
                  <Text style={styles.selectorValue} numberOfLines={3}>
                    {getFormatLabel()}
                  </Text>
                </View>

                <Feather name="chevron-right" size={20} color="#234028" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.selectorCard}
                onPress={() => setStatusModalVisible(true)}
                activeOpacity={0.85}
              >
                <View>
                  <Text style={styles.selectorLabel}>Status</Text>
                  <Text style={styles.selectorValue}>{getStatusLabel()}</Text>
                </View>

                <Feather name="chevron-right" size={20} color="#234028" />
              </TouchableOpacity>
              <View style={styles.ratingSection}>
  <Text style={styles.selectorLabel}>Rating</Text>

  <View style={styles.ratingRow}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => setRating(rating === star ? 0 : star)}
      >
        <Text style={[styles.star, star <= rating && styles.starFilled]}>
          ★
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
            </View>
          </View>

{(status === "Currently Reading" || status === "Finished") && (
  <View style={styles.dateSection}>
  <TouchableOpacity
    style={styles.dateRow}
    onPress={() => setActiveDateField("startedAt")}
    activeOpacity={0.75}
  >
    <View>
      <Text style={styles.dateLabel}>Started Reading</Text>
      <Text style={styles.dateValue}>{formatDisplayDate(startedAt)}</Text>
    </View>

    <Feather name="calendar" size={22} color="#234028" />
  </TouchableOpacity>

  {status === "Finished" && (
    <TouchableOpacity
      style={styles.dateRow}
      onPress={() => setActiveDateField("finishedAt")}
      activeOpacity={0.75}
    >
      <View>
        <Text style={styles.dateLabel}>Finished Reading</Text>
        <Text style={styles.dateValue}>{formatDisplayDate(finishedAt)}</Text>
      </View>
    

      <Feather name="calendar" size={22} color="#234028" />
    </TouchableOpacity>
  )}

  <Modal
  visible={activeDateField !== null}
  transparent
  animationType="fade"
  onRequestClose={() => setActiveDateField(null)}
>
  <TouchableOpacity
    style={styles.dateModalOverlay}
    activeOpacity={1}
    onPress={() => setActiveDateField(null)}
  >
    <TouchableOpacity
      style={styles.dateModalCard}
      activeOpacity={1}
      onPress={(event) => event.stopPropagation()}
    >
      <Text style={styles.dateModalTitle}>
        {activeDateField === "startedAt"
          ? "Started Reading"
          : "Finished Reading"}
      </Text>

      <DateTimePicker
        value={
          activeDateField === "startedAt" && startedAt
            ? new Date(startedAt)
            : activeDateField === "finishedAt" && finishedAt
              ? new Date(finishedAt)
              : new Date()
        }
        mode="date"
        display="spinner"
        themeVariant="light"
        onChange={(event, selectedDate) => {
          if (!selectedDate) return;

          if (activeDateField === "startedAt") {
            setStartedAt(toIsoDate(selectedDate));
          }

          if (activeDateField === "finishedAt") {
            setFinishedAt(toIsoDate(selectedDate));
          }
        }}
      />

      <TouchableOpacity
        style={styles.dateModalDoneButton}
        onPress={() => setActiveDateField(null)}
      >
        <Text style={styles.dateModalDoneText}>Done</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>

</View>
)}

          {status === "Currently Reading" && (
            <View style={styles.progressSection}>
              {progressType === "percentage" ? (
                <>
                  <Text style={styles.progressNumber}>{progressValue}%</Text>

                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={Number(progressValue)}
                    minimumTrackTintColor="#234028"
                    maximumTrackTintColor="#DDD4C5"
                    thumbTintColor="#234028"
                    onValueChange={(value) =>
                      setProgressValue(String(Math.round(value)))
                    }
                  />
                </>
              ) : (
                <TextInput
                  style={styles.pageInput}
                  placeholder="Current page"
                  placeholderTextColor="#8A8A8A"
                  keyboardType="numeric"
                  value={progressValue}
                  onChangeText={setProgressValue}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit
                />
              )}

              <View style={styles.progressTypeRow}>
                <TouchableOpacity
                  style={[
                    styles.progressTypeButton,
                    progressType === "percentage" && styles.selectedButton,
                  ]}
                  onPress={() => setProgressType("percentage")}
                >
                  <Text
                    style={[
                      styles.progressTypeText,
                      progressType === "percentage" && styles.selectedText,
                    ]}
                  >
                    Percentage
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.progressTypeButton,
                    progressType === "page" && styles.selectedButton,
                  ]}
                  onPress={() => setProgressType("page")}
                >
                  <Text
                    style={[
                      styles.progressTypeText,
                      progressType === "page" && styles.selectedText,
                    ]}
                  >
                    Page #
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.notesHeader}>
            <Image
              source={require("../assets/images/leaf-sprig.png")}
              style={styles.notesDecorLeft}
            />

            <Text style={styles.notesTitle}>Quick Notes</Text>

            <Image
              source={require("../assets/images/leaf-sprig.png")}
              style={styles.notesDecorRight}
            />
          </View>

          <View style={styles.noteInputRow}>
            <TextInput
              style={styles.noteInput}
              placeholder=""
              value={noteDraft}
              onChangeText={setNoteDraft}
              returnKeyType="done"
              onSubmitEditing={handleAddOrUpdateNote}
              blurOnSubmit
            />

            <TouchableOpacity
              style={styles.addNoteButton}
              onPress={handleAddOrUpdateNote}
              activeOpacity={0.85}
            >
              <Text style={styles.addNoteText}>
                {editingNoteIndex !== null ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>

          {notes.length > 0 && (
            <View style={styles.notesList}>
              {notes.map((note, index) => (
                <View key={`${note}-${index}`} style={styles.noteItem}>
                  <View style={styles.noteTextWrap}>
                    <Image
                      source={require("../assets/images/leaf-sprig.png")}
                      style={styles.noteLeaf}
                    />
                    <Text style={styles.noteText}>{note}</Text>
                  </View>

                  <View style={styles.noteActions}>
                    <TouchableOpacity onPress={() => handleEditNote(index)}>
                      <Feather name="edit-3" size={17} color="#234028" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDeleteNote(index)}>
                      <Feather name="trash-2" size={17} color="#A14A4A" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Image
              source={require("../assets/images/save-leaf.png")}
              style={styles.saveLeaf}
            />
            <Text style={styles.saveText}>Add to My Library</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#EEE4D2",
  },

  screen: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#EEE4D2",
    justifyContent: "center",
    alignItems: "center",
  },

  cornerLeaf: {
    position: "absolute",
    top: 20,
    right: -12,
    width: 170,
    height: 170,
    resizeMode: "contain",
    transform: [{ rotate: "180deg" }],
    opacity: 0.18,
  },

  container: {
    padding: 22,
    paddingTop: 68,
    paddingBottom: 110,
  },

  backButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },

  backText: {
  color: "#234028",
  fontSize: 22,
  fontFamily: "CormorantGaramond_600SemiBold",
},

  heroRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  cover: {
    width: 170,
    height: 260,
    borderRadius: 18,
  },

  coverPlaceholder: {
    width: 164,
    height: 246,
    borderRadius: 18,
    backgroundColor: "#DDD",
  },

  selectorColumn: {
    flex: 1,
    gap: 14,
  },

  selectorCard: {
    minHeight: 90,
    backgroundColor: "rgba(255, 248, 238, 0.55)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D8CDBB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectorLabel: {
    color: "#6D745F",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  selectorValue: {
    color: "#234028",
    fontSize: 19,
    lineHeight: 25,
    maxWidth: 130,
    fontFamily: "CormorantGaramond_500Medium",
  },

  progressSection: {
    marginTop: 22,
    backgroundColor: "rgba(255, 248, 238, 0.58)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D8CDBB",
  },

  progressNumber: {
    color: "#234028",
    fontSize: 42,
    textAlign: "center",
    marginBottom: 2,
    fontFamily: "CormorantGaramond_600SemiBold",
  },

  slider: {
    width: "100%",
    height: 40,
  },

  pageInput: {
    width: "100%",
    backgroundColor: "rgba(255, 253, 248, 0.65)",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: "#234028",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#D8CDBB",
  },

  progressTypeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  progressTypeButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "rgba(255, 253, 248, 0.65)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8CDBB",
  },

  selectedButton: {
    backgroundColor: "#234028",
    borderColor: "#234028",
  },

  progressTypeText: {
    color: "#234028",
    fontWeight: "800",
    fontSize: 13,
  },

  selectedText: {
    color: "#F7F0E4",
  },

  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 14,
  },

  notesDecorLeft: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 8,
    transform: [{ rotate: "18deg" }],
  },

  notesDecorRight: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginLeft: 8,
    transform: [{ scaleX: -1 }, { rotate: "18deg" }],
  },

  notesTitle: {
    color: "#234028",
    fontSize: 30,
    letterSpacing: 0.3,
    fontFamily: "CormorantGaramond_600SemiBold",
  },

  noteInputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  noteInput: {
    flex: 1,
    backgroundColor: "rgba(255, 248, 238, 0.58)",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: "#234028",
    borderWidth: 1,
    borderColor: "#D8CDBB",
  },

  addNoteButton: {
    backgroundColor: "#234028",
    borderRadius: 14,
    paddingHorizontal: 20,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  addNoteText: {
    color: "#F7F0E4",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 18,
  },

  notesList: {
    marginTop: 12,
    gap: 10,
  },

  noteItem: {
    backgroundColor: "rgba(255, 248, 238, 0.58)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D8CDBB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  noteTextWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  noteLeaf: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  noteText: {
    flex: 1,
    color: "#234028",
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "CormorantGaramond_500Medium",
  },

  noteActions: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },

  saveButton: {
    marginTop: 20,
    backgroundColor: "#234028",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
  },

  saveLeaf: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    tintColor: "#F7F0E4",
  },

  saveText: {
    color: "#F7F0E4",
    fontSize: 20,
    letterSpacing: 0.2,
    fontFamily: "CormorantGaramond_600SemiBold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(35, 64, 40, 0.35)",
    justifyContent: "center",
    padding: 28,
  },

  modalCard: {
    backgroundColor: "#F7EFE2",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#D8CDBB",
  },

  modalTitle: {
    color: "#234028",
    fontSize: 34,
    fontFamily: "CormorantGaramond_600SemiBold",
    marginBottom: 16,
    textAlign: "center",
  },

  modalOption: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#D8CDBB",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalOptionSelected: {
    backgroundColor: "#234028",
    borderColor: "#234028",
  },

  modalOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  modalOptionText: {
    color: "#234028",
    fontFamily: "CormorantGaramond_500Medium",
    fontSize: 24,
  },

  modalOptionTextSelected: {
    color: "#F7F0E4",
  },

  modalDoneButton: {
    marginTop: 8,
    backgroundColor: "#234028",
    borderRadius: 18,
    paddingHorizontal: 34,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 150,
  },

  modalDoneText: {
    color: "#F7F0E4",
    fontSize: 28,
    letterSpacing: 0.3,
    fontFamily: "CormorantGaramond_600SemiBold",
  },

  dateSection: {
  marginTop: 20,
  marginBottom: -10,
},

dateRow: {
  backgroundColor: "rgba(255, 253, 248, 0.72)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  borderRadius: 18,
  paddingHorizontal: 18,
  paddingVertical: 14,
  marginBottom: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

dateLabel: {
  fontSize: 16,
  letterSpacing: 1.2,
  color: "#6D745F",
  fontFamily: "CormorantGaramond_600SemiBold",
  marginBottom: 4,
},

dateValue: {
  fontSize: 24,
  color: "#234028",
  fontFamily: "CormorantGaramond_500Medium",
},

dateModalOverlay: {
  flex: 1,
  backgroundColor: "rgba(31, 51, 36, 0.25)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
},

dateModalCard: {
  width: "90%",
  borderRadius: 28,
  backgroundColor: "rgba(255, 248, 238, 0.98)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  padding: 20,
},

dateModalTitle: {
  fontSize: 28,
  color: "#234028",
  textAlign: "center",
  fontFamily: "CormorantGaramond_600SemiBold",
  marginBottom: 8,
},

dateModalDoneButton: {
  alignSelf: "center",
  marginTop: 10,
  paddingHorizontal: 24,
  paddingVertical: 8,
  borderRadius: 16,
  backgroundColor: "rgba(185, 190, 167, 0.55)",
},

dateModalDoneText: {
  color: "#1f3324",
  fontSize: 20,
  fontFamily: "CormorantGaramond_600SemiBold",
},

ratingSection: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 6,
},

ratingRow: {
  flexDirection: "row",
  alignItems: "center",
},

star: {
  fontSize: 18,
  color: "#CFC7B6",
  marginHorizontal: 3,
},

starFilled: {
  color: "#A67C52",
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

modalActionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 12,
},

modalCancelButton: {
  flex: 1,
  borderRadius: 999,
  paddingVertical: 14,
  alignItems: "center",
  backgroundColor: "#E7E0CF",
},

modalCancelText: {
  color: "#234028",
  fontSize: 15,
  fontWeight: "700",
},

modalDoneButtonDisabled: {
  opacity: 0.45,
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