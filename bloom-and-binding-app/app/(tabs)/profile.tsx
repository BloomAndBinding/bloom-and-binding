import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { getSavedBooks, SavedBook } from "../../services/libraryStorage";

const avatarOptions = [
  {
    key: "fae-dreamer",
    label: "Fae Dreamer",
    subtitle: "Fae Book Lover",
    image: require("../../assets/avatars/fae-dreamer.png"),
  },
  {
    key: "dragon-rider",
    label: "Dragon Rider",
    subtitle: "Fantasy Book Adventurer",
    image: require("../../assets/avatars/dragon-rider.png"),
  },
  {
    key: "cottage-bloom",
    label: "Cottage Bloom",
    subtitle: "Cozy Garden Reader",
    image: require("../../assets/avatars/cottage-bloom.png"),
  },
  {
    key: "dark-scholar",
    label: "Dark Scholar",
    subtitle: "Candlelit Chapter Seeker",
    image: require("../../assets/avatars/dark-scholar.png"),
  },
  {
    key: "crimson-romantic",
    label: "Crimson Romantic",
    subtitle: "Romance Reader",
    image: require("../../assets/avatars/crimson-romantic.png"),
  },
  {
    key: "cherry-blossom-muse",
    label: "Cherry Blossom Muse",
    subtitle: "Soft Story Seeker",
    image: require("../../assets/avatars/cherry-blossom-muse.png"),
  },
  {
    key: "golden-romance",
    label: "Golden Romance",
    subtitle: "Love Story Collector",
    image: require("../../assets/avatars/golden-romance.png"),
  },
  {
    key: "sunlit-storykeeper",
    label: "Sunlit Storykeeper",
    subtitle: "Garden Library Dreamer",
    image: require("../../assets/avatars/sunlit-storykeeper.png"),
  },
  {
    key: "moonlit-oracle",
    label: "Moonlit Oracle",
    subtitle: "Mystical Book Lover",
    image: require("../../assets/avatars/moonlit-oracle.png"),
  },
  {
    key: "cozy-chapter-keeper",
    label: "Cozy Chapter Keeper",
    subtitle: "Tea & Chapter Devotee",
    image: require("../../assets/avatars/cozy-chapter-keeper.png"),
  },
  {
    key: "velvet-scholar",
    label: "Velvet Scholar",
    subtitle: "Dark Academia Reader",
    image: require("../../assets/avatars/velvet-scholar.png"),
  },

  {
    key: "celestial-reader",
    label: "Celestial Reader",
    subtitle: "Starlit Story Seeker",
    image: require("../../assets/avatars/celestial-reader.png"),
  },
  {
    key: "regency-darling",
    label: "Regency Darling",
    subtitle: "Historical Romance Reader",
    image: require("../../assets/avatars/regency-darling.png"),
  },
  {
    key: "spring-poet",
    label: "Spring Poet",
    subtitle: "Bloom & Verse Lover",
    image: require("../../assets/avatars/spring-poet.png"),
  },
];

export default function ProfileScreen() {
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);

  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
const [selectedAvatarKey, setSelectedAvatarKey] = useState("fae-dreamer");
const [goalEditorOpen, setGoalEditorOpen] = useState(false);
const [yearlyGoal, setYearlyGoal] = useState(24);
const [goalInput, setGoalInput] = useState("24");
const selectedAvatar =
  avatarOptions.find((avatar) => avatar.key === selectedAvatarKey) ||
  avatarOptions[0];

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const books = await getSavedBooks();
    setSavedBooks(books);
  };

  const booksOwned = savedBooks.length;

const booksRead = savedBooks.filter(
  (book) => book.status === "Finished"
).length;

const currentlyReading = savedBooks.filter(
  (book) => book.status === "Currently Reading"
).length;

const wantToRead = savedBooks.filter(
  (book) => book.status === "Want to Read"
).length;

const currentYear = new Date().getFullYear();

const booksFinishedThisYear = savedBooks.filter((book) => {
  if (book.status !== "Finished" || !book.finishedAt) return false;

  return new Date(book.finishedAt).getFullYear() === currentYear;
}).length;

const goalProgress = Math.min(booksFinishedThisYear / yearlyGoal, 1);

  return (
    <ImageBackground
      source={require("../../assets/images/profile-background-1.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>My Profile</Text>

        <View style={styles.profileCard}>
  <View style={styles.avatarColumn}>
  <TouchableOpacity
    style={styles.avatarFrameWrap}
    activeOpacity={0.85}
    onPress={() => setAvatarPickerOpen(true)}
  >
    <Image source={selectedAvatar.image} style={styles.avatarPortrait} />

    <Image
  source={require("../../assets/avatars/avatar-frame.png")}
  style={styles.avatarFrame}
  resizeMode="contain"
/>

    <View style={styles.avatarEditButton}>
      <Feather name="edit-2" size={14} color="#234028" />
    </View>
  </TouchableOpacity>
</View>

<View style={styles.profileInfo}>
  <Text style={styles.name}>Brittany</Text>
  <Text style={styles.subtitle}>{selectedAvatar.subtitle}</Text>
  <Text style={styles.memberSince}>
    Bloom & Binding member{"\n"}since May 2026
  </Text>
</View>
</View>

        <View style={styles.statsCard}>
  <Image
    source={require("../../assets/images/profile-stats.png")}
    style={styles.statsImage}
    resizeMode="contain"
  />

  <View style={styles.statsOverlay}>
  <View style={[styles.statItem, styles.stat1]}>
    <Text style={styles.statLabel}>OWNED</Text>
    <Text style={styles.statNumber}>{booksOwned}</Text>
  </View>

  <View style={[styles.statItem, styles.stat2]}>
    <Text style={styles.statLabel}>READ</Text>
    <Text style={styles.statNumber}>{booksRead}</Text>
  </View>

  <View style={[styles.statItem, styles.stat3]}>
    <Text style={styles.statLabel}>WANT</Text>
    <Text style={styles.statNumber}>{wantToRead}</Text>
  </View>

  <View style={[styles.statItem, styles.stat4]}>
    <Text style={styles.statLabel}>READING</Text>
    <Text style={styles.statNumber}>{currentlyReading}</Text>
  </View>
</View>
</View>
<View style={styles.goalCard}>
  <View style={styles.goalHeader}>
    <Text style={styles.goalTitle}>
      {currentYear} Reading Goal
    </Text>

    <TouchableOpacity
  style={styles.goalEditButton}
  onPress={() => {
    setGoalInput(String(yearlyGoal));
    setGoalEditorOpen(true);
  }}
>
  <Text style={styles.goalCount}>
    {booksFinishedThisYear} / {yearlyGoal}
  </Text>
  <Feather name="edit-2" size={14} color="#234028" />
</TouchableOpacity>
  </View>

  <View style={styles.progressTrack}>
    <View
      style={[
        styles.progressFill,
        { width: `${goalProgress * 100}%` },
      ]}
    />
  </View>

  <Text style={styles.goalSubtext}>
    books completed this year
  </Text>
</View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Settings</Text>

          <ProfileRow icon="user" label="Account" />
          <ProfileRow icon="bell" label="Notifications" />
          <ProfileRow icon="book-open" label="Reading Preferences" />
          <ProfileRow icon="lock" label="Privacy" />
          <ProfileRow icon="help-circle" label="Help & Support" />
        </View>

        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementTitle}>
            Your reading sanctuary is blooming.
          </Text>
          <Text style={styles.encouragementText}>
            Every saved book adds another little root to your garden.
          </Text>
        </View>

        <View style={{ height: 90 }} />
        <Modal
  visible={avatarPickerOpen}
  transparent
  animationType="fade"
  onRequestClose={() => setAvatarPickerOpen(false)}
>
  <TouchableOpacity
  style={styles.avatarModalOverlay}
  activeOpacity={1}
  onPress={() => setAvatarPickerOpen(false)}
>
  <TouchableOpacity
    style={styles.avatarModalCard}
    activeOpacity={1}
    onPress={(event) => event.stopPropagation()}
  >
      <View style={styles.avatarTitleRow}>
  <Image
    source={require("../../assets//images/leaf-sprig.png")}
    style={styles.avatarTitleLeafLeft}
    resizeMode="contain"
  />

  <Text style={styles.avatarModalTitle}>
    Choose Your Reading Persona
  </Text>

  <Image
    source={require("../../assets/images/leaf-sprig.png")}
    style={styles.avatarTitleLeafRight}
    resizeMode="contain"
  />
</View>

</TouchableOpacity>
</TouchableOpacity>
</Modal>

<Modal
  visible={goalEditorOpen}
  transparent
  animationType="fade"
  onRequestClose={() => setGoalEditorOpen(false)}
>
  <TouchableOpacity
    style={styles.goalModalOverlay}
    activeOpacity={1}
    onPress={() => setGoalEditorOpen(false)}
  >
    <TouchableOpacity
      style={styles.goalModalCard}
      activeOpacity={1}
      onPress={(event) => event.stopPropagation()}
    >
      <Text style={styles.goalModalTitle}>Edit Reading Goal</Text>

      <TextInput
        style={styles.goalInput}
        keyboardType="number-pad"
        value={goalInput}
        onChangeText={setGoalInput}
        placeholder="24"
        placeholderTextColor="#8A7D6F"
      />

      <TouchableOpacity
        style={styles.goalSaveButton}
        onPress={() => {
          const nextGoal = Number(goalInput);

          if (!Number.isNaN(nextGoal) && nextGoal > 0) {
            setYearlyGoal(nextGoal);
          }

          setGoalEditorOpen(false);
        }}
      >
        <Text style={styles.goalSaveText}>Save Goal</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>

      <ScrollView
  style={styles.avatarScroll}
  showsVerticalScrollIndicator={false}
>
  <View style={styles.avatarGrid}>
    {avatarOptions.map((avatar) => (
          <TouchableOpacity
            key={avatar.key}
            style={[
              styles.avatarChoice,
              selectedAvatarKey === avatar.key && styles.avatarChoiceActive,
            ]}
            onPress={() => {
              setSelectedAvatarKey(avatar.key);
              setAvatarPickerOpen(false);
            }}
          >
            <Image source={avatar.image} style={styles.avatarOptionImage} />
            <Text style={styles.avatarChoiceLabel}>{avatar.label}</Text>
          </TouchableOpacity>
        ))}
        </View>
</ScrollView>

<TouchableOpacity
  style={styles.avatarDoneButton}
        onPress={() => setAvatarPickerOpen(false)}
      >
        <Text style={styles.avatarDoneText}>Done</Text>
      </TouchableOpacity>
      
      </ScrollView>
    </ImageBackground>
  );
}

function ProfileRow({
  icon,
  label,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.profileRow} activeOpacity={0.85}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Feather name={icon} size={18} color="#234028" />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>

      <Feather name="chevron-right" size={20} color="#6D745F" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#EEE4D2",
  },

  container: {
    paddingHorizontal: 22,
    paddingTop: 72,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 52,
    color: "#234028",
    fontFamily: "CormorantGaramond_600SemiBold",
    marginBottom: 18,
  },

  profileCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255, 248, 238, 0.62)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  borderRadius: 28,
  paddingVertical: 26,
  paddingHorizontal: 18,
  marginBottom: -18,
  gap: 16,
},

avatarColumn: {
  alignItems: "center",
  justifyContent: "flex-start",
  alignSelf: "flex-start",
  marginTop: -14,
},

avatarFrameWrap: {
  width: 158,
  height: 196,
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
},

avatarPortrait: {
  width: 105,
  height: 166,
  borderRadius: 48,
  marginTop: 24,
  position: "absolute",
},

selectedAvatarOption: {
  borderWidth: 2,
  borderColor: "#D8C28A",
  shadowColor: "#D8C28A",
  shadowOpacity: 0.18,
  shadowRadius: 8,
  elevation: 4,
},

avatarFrame: {
  width: 190,
  height: 230,
  marginTop: 13,
  position: "absolute", 
},

avatarEditButton: {
  position: "absolute",
  right: 10,
  bottom: 4,
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: "rgba(255, 248, 238, 0.96)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  alignItems: "center",
  justifyContent: "center",
},

profileInfo: {
  flex: 1,
},

name: {
  fontSize: 38,
  color: "#234028",
  fontFamily: "CormorantGaramond_600SemiBold",
},

subtitle: {
  marginTop: 2,
  fontSize: 20,
  lineHeight: 23,
  color: "#4A5A46",
  fontFamily: "CormorantGaramond_500Medium",
},

memberSince: {
  marginTop: 6,
  fontSize: 15,
  lineHeight: 18,
  color: "#6D745F",
  fontFamily: "CormorantGaramond_500Medium",
},

  statsCard: {
  marginBottom: -14,
  position: "relative",
},

  statItem: {
  position: "absolute",
  width: 70,
  height: 70,
  alignItems: "center",
},

statLabel: {
  position: "absolute",
  top: 60,
  fontSize: 10,
  letterSpacing: 1.1,
  color: "#6D745F",
  fontFamily: "CormorantGaramond_600SemiBold",
},

statNumber: {
  position: "absolute",
  top: 20,
  fontSize: 28,
  color: "#234028",
  fontFamily: "Georgia",
  fontWeight: "400",
  lineHeight: 36,
},

cardTitle: {
  fontSize: 32,
  color: "#234028",
  fontFamily: "CormorantGaramond_600SemiBold",
  marginBottom: 14,
},

  settingsCard: {
    backgroundColor: "rgba(255, 248, 238, 0.62)",
    borderWidth: 1,
    borderColor: "#D8CDBB",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
  },

  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "rgba(216, 205, 187, 0.75)",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(35, 64, 40, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  rowLabel: {
    fontSize: 22,
    color: "#234028",
    fontFamily: "CormorantGaramond_500Medium",
  },

  encouragementCard: {
    backgroundColor: "rgba(35, 64, 40, 0.92)",
    borderRadius: 24,
    padding: 20,
  },

  encouragementTitle: {
    color: "#F7F0E4",
    fontSize: 28,
    fontFamily: "CormorantGaramond_600SemiBold",
  },

  encouragementText: {
    marginTop: 6,
    color: "#E5EEE2",
    fontSize: 19,
    lineHeight: 24,
    fontFamily: "CormorantGaramond_500Medium",
  },

  statsImage: {
  width: "110%",
  height: 250,
  alignContent: "center",
  alignSelf: "center",
},

statsOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},

stat1: {
  top: 88,
  left: "4%",
},

stat2: {
  top: 88,
  left: "28.5%",
},

stat3: {
  top: 88,
  left: "53%",
},

stat4: {
  top: 88,
  left: "77%",
},

avatarModalOverlay: {
  flex: 1,
  backgroundColor: "rgba(31, 51, 36, 0.25)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 22,
},

avatarModalCard: {
  width: "100%",
  maxHeight: "82%",
  borderRadius: 30,
  backgroundColor: "rgba(255, 248, 238, 0.97)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  padding: 20,
},

avatarModalTitle: {
  fontSize: 22,
  color: "#234028",
  textAlign: "center",
  fontFamily: "CormorantGaramond_600SemiBold",
},

avatarGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: 12,
},

avatarChoice: {
  width: "47%",
  borderRadius: 22,
  padding: 10,
  alignItems: "center",
  backgroundColor: "rgba(255, 253, 248, 0.72)",
  borderWidth: 1,
  borderColor: "rgba(216, 205, 187, 0.75)",
},

avatarChoiceActive: {
  backgroundColor: "rgba(185, 190, 167, 0.45)",
  borderColor: "#9BA68E",
},

avatarOptionImage: {
  width: 92,
  height: 118,
  borderRadius: 46,
  marginBottom: 8,
},

avatarChoiceLabel: {
  fontSize: 17,
  color: "#234028",
  textAlign: "center",
  fontFamily: "CormorantGaramond_600SemiBold",
},

avatarDoneButton: {
  marginTop: 8,
  backgroundColor: "#b9bea7",
  borderRadius: 18,
  paddingVertical: 12,
  alignItems: "center",
},

avatarDoneText: {
  color: "#1f3324",
  fontSize: 20,
  fontFamily: "CormorantGaramond_600SemiBold",
},

avatarScroll: {
  maxHeight: 430,
},

avatarOption: {
  paddingVertical: 10,
},

avatarTitleRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
},

avatarTitleLeafLeft: {
  width: 42,
  height: 42,
  marginRight: 2,
  opacity: 0.75,
  transform: [{rotate: "20deg"}],
},

avatarTitleLeafRight: {
  width: 42,
  height: 42,
  marginLeft: 2,
  opacity: 0.75,
  transform: [{ scaleX: -1 }, {rotate: "20deg"}],
},

goalCard: {
  backgroundColor: "rgba(255, 248, 238, 0.62)",
  borderWidth: 1,
  borderColor: "#D8CDBB",
  borderRadius: 24,
  padding: 18,
  marginBottom: 18,
},

goalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
},

goalTitle: {
  fontSize: 28,
  color: "#234028",
  fontFamily: "CormorantGaramond_600SemiBold",
},

goalCount: {
  fontSize: 24,
  color: "#234028",
  fontFamily: "CormorantGaramond_600SemiBold",
},

progressTrack: {
  height: 14,
  backgroundColor: "rgba(216, 205, 187, 0.55)",
  borderRadius: 99,
  overflow: "hidden",
},

progressFill: {
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
});