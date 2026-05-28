import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Bloom & Binding Community Page v1 — functional local test version
// Replace local state with Firestore/Supabase once the flow feels right.

const BACKGROUND_IMAGE = require("../../assets/images/community-bg.png");
const HEADER_IMAGE = require("../../assets/images/header.png");
const FONT_HEAD = "CormorantGaramond-Bold";
const FONT_BODY = "CormorantGaramond-Regular";
const CLUB_THEMES = [
  {
    id: "dragon-library",
    name: "Dragon Library",
    image: require("../../assets/images/club-themes/dragon-library.png"),
  },
  {
    id: "tea-nook",
    name: "Tea Nook",
    image: require("../../assets/images/club-themes/tea-nook.png"),
  },
  {
    id: "enchanted-forest",
    name: "Enchanted Forest",
    image: require("../../assets/images/club-themes/enchanted-forest.png"),
  },
  {
    id: "celestial-study",
    name: "Celestial Study",
    image: require("../../assets/images/club-themes/celestial-study.png"),
  },
];
const CURRENT_USER = {
  id: "user-brittany",
  displayName: "Brittany",
  username: "@dragonqueen",
};
function getClubTheme(themeId?: string) {
  return CLUB_THEMES.find((theme) => theme.id === themeId) || CLUB_THEMES[0];
}
const starterDiscoverClubs: any[] = [];
const CLUBS_STORAGE_KEY = "bloom_binding_your_clubs";
const REQUESTS_STORAGE_KEY = "bloom_binding_club_requests";
const COMMENTS_STORAGE_KEY = "bloom_binding_club_comments";
export default function CommunityScreen() {
  const [yourClubs, setYourClubs] = useState<any[]>([]);
  const [createVisible, setCreateVisible] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [currentBook, setCurrentBook] = useState("");
  const [currentAuthor, setCurrentAuthor] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState("dragon-library");
  const [approvedClubIds, setApprovedClubIds] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<
  Record<string, { id: string; displayName: string; username: string }[]>
>({});
  const hasClubs = yourClubs.length > 0;
  const discoverClubs = yourClubs;
  useEffect(() => {
  loadClubs();
}, []);

async function loadClubs() {
  try {
    const saved = await AsyncStorage.getItem(CLUBS_STORAGE_KEY);
    if (saved) {
      setYourClubs(JSON.parse(saved));
      const savedRequests = await AsyncStorage.getItem(REQUESTS_STORAGE_KEY);
if (savedRequests) {
  setPendingRequests(JSON.parse(savedRequests));
}
    }
  } catch (error) {
    console.log("Could not load clubs", error);
  }
}

async function saveClubs(nextClubs: any[]) {
  setYourClubs(nextClubs);
  await AsyncStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(nextClubs));
}
async function savePendingRequests(nextRequests: any) {
  setPendingRequests(nextRequests);
  await AsyncStorage.setItem(
    REQUESTS_STORAGE_KEY,
    JSON.stringify(nextRequests)
  );
}
function resetClubForm() {
  setEditingClubId(null);
  setClubName("");
  setClubDescription("");
  setCurrentBook("");
  setCurrentAuthor("");
  setSelectedThemeId("dragon-library");
}

function openCreateClub() {
  resetClubForm();
  setCreateVisible(true);
}

function startEditClub(club: any) {
  setEditingClubId(club.id);
  setClubName(club.name || "");
  setClubDescription(club.description || "");
  setCurrentBook(
    club.currentBook === "No current read yet" ? "" : club.currentBook || ""
  );
  setCurrentAuthor(club.author || "");
  setSelectedThemeId(club.themeId || "dragon-library");
  setCreateVisible(true);
}

async function deleteClub(clubId: string) {
  Alert.alert(
    "Delete club?",
    "This will remove the club and its comments from your Community page.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const nextClubs = yourClubs.filter((club) => club.id !== clubId);
          await saveClubs(nextClubs);

          const savedComments = await AsyncStorage.getItem(
            COMMENTS_STORAGE_KEY
          );
          const allComments = savedComments ? JSON.parse(savedComments) : {};

          delete allComments[clubId];

          await AsyncStorage.setItem(
            COMMENTS_STORAGE_KEY,
            JSON.stringify(allComments)
          );
        },
      },
    ]
  );
}
async function requestToJoinClub(clubId: string) {
  const existingRequests = pendingRequests[clubId] || [];

  const alreadyRequested = existingRequests.some(
    (person: any) => person.id === CURRENT_USER.id
  );

  const nextRequests = {
    ...pendingRequests,
    [clubId]: alreadyRequested
      ? existingRequests
      : [...existingRequests, CURRENT_USER],
  };

  await savePendingRequests(nextRequests);

  Alert.alert(
    "Request sent",
    "Your request to join this cozy club has been sent to the club host."
  );
}
async function approveRequest(clubId: string) {
  const existingRequests = pendingRequests[clubId] || [];
  const nextPendingForClub = existingRequests.slice(1);

  const nextRequests = {
    ...pendingRequests,
    [clubId]: nextPendingForClub,
  };

  await savePendingRequests(nextRequests);

  const nextClubs = yourClubs.map((club) =>
    club.id === clubId
      ? {
          ...club,
          members: Math.min((club.members || 1) + 1, club.maxMembers || 50),
        }
      : club
  );

  await saveClubs(nextClubs);
}
async function saveClubForm() {
  const trimmedName = clubName.trim();

  if (!trimmedName) {
    Alert.alert("Club name needed", "Give your cozy club a name first.");
    return;
  }

  if (editingClubId) {
    const nextClubs = yourClubs.map((club) =>
      club.id === editingClubId
        ? {
            ...club,
            name: trimmedName,
            description:
              clubDescription.trim() ||
              "A cozy reading nook for bookish friends.",
            currentBook: currentBook.trim() || "No current read yet",
            author: currentAuthor.trim() || "",
themeId: selectedThemeId,
          }
        : club
    );

    await saveClubs(nextClubs);
  } else {
    const newClub = {
      id: `club-${Date.now()}`,
      name: trimmedName,
      description:
        clubDescription.trim() || "A cozy reading nook for bookish friends.",
      members: 1,
      maxMembers: 50,
      unreadCount: 0,
      currentBook: currentBook.trim() || "No current read yet",
      author: currentAuthor.trim() || "",
themeId: selectedThemeId,
roomTheme: selectedThemeId,
      approvalRequired: true,
      owner: true,
    };

    await saveClubs([newClub, ...yourClubs]);
  }

  resetClubForm();
  setCreateVisible(false);
}

  return (
    <ImageBackground source={BACKGROUND_IMAGE as any} style={styles.background} imageStyle={styles.backgroundImage}>
      <View style={styles.overlay}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
  <Image source={HEADER_IMAGE} style={styles.headerPlaque} />

</View>
          <SectionHeader title="Your Clubs" actionText={hasClubs ? "See all" : undefined} />

          {hasClubs ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {yourClubs.map((club) => (
                <YourClubCard
  key={club.id}
  club={club}
  onPress={() => router.push(`/club/${club.id}`)}
  onEdit={() => startEditClub(club)}
  onDelete={() => deleteClub(club.id)}
/>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No cozy corners yet.</Text>
              <Text style={styles.emptyText}>Join a club or start your own reading nook.</Text>
            </View>
          )}

          <TouchableOpacity
  style={styles.createClubCard}
  activeOpacity={0.86}
  onPress={openCreateClub}
>
            <View style={styles.createIconCircle}>
              <Text style={styles.createIcon}>✦</Text>
            </View>
            <View style={styles.createTextWrap}>
              <Text style={styles.createTitle}>Start a Cozy Club</Text>
              <Text style={styles.createText}>Create a private reading nook for your people.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8d715d" />
          </TouchableOpacity>

          <SectionHeader title="Discover Clubs" actionText="Filter" />

<View style={styles.searchCard}>
            <Ionicons name="search" size={20} color="#8a725f" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search clubs, genres, books, dragons…"
              placeholderTextColor="#6F655D"
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filterRow}>
            {["Romantasy", "Romance", "Moms", "Fantasy", "Thriller", "Mystery", "Cozy"].map((filter) => (
              <TouchableOpacity key={filter} style={styles.filterPill}>
                <Text style={styles.filterText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {discoverClubs.length > 0 ? (
  <View style={styles.discoverList}>
    {discoverClubs.map((club) => (
      <DiscoverClubCard
  key={club.id}
  club={club}
  requested={(pendingRequests[club.id] || []).some(
  (person: any) => person.id === CURRENT_USER.id
)}
  approved={approvedClubIds.includes(club.id)}
  onRequestJoin={() => requestToJoinClub(club.id)}
  onOpenClub={() => router.push(`/club/${club.id}`)}
/>
    ))}
  </View>
) : (
  <View style={styles.discoverEmptyCard}>
    <Text style={styles.discoverEmptyTitle}>
      Discoverable clubs will bloom here.
    </Text>
    <Text style={styles.discoverEmptyText}>
      Once clubs are connected to your database, readers can request to join cozy rooms from this section.
    </Text>
  </View>
)}
      </ScrollView>

        <CreateClubModal
          visible={createVisible}
          isEditing={!!editingClubId}
          onClose={() => {
  setEditingClubId(null);
  setCreateVisible(false);
}}
          clubName={clubName}
          setClubName={setClubName}
          clubDescription={clubDescription}
          setClubDescription={setClubDescription}
          currentBook={currentBook}
          setCurrentBook={setCurrentBook}
          currentAuthor={currentAuthor}
          setCurrentAuthor={setCurrentAuthor}
          onCreate={saveClubForm}
          selectedThemeId={selectedThemeId}
          setSelectedThemeId={setSelectedThemeId}
          clubThemes={CLUB_THEMES}
        />
      </View>
    </ImageBackground>
  );
}

function SectionHeader({ title, actionText }: { title: string; actionText?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionText ? <Text style={styles.sectionAction}>{actionText}</Text> : null}
    </View>
  );
}

function YourClubCard({
  club,
  onPress,
  onEdit,
  onDelete,
}: {
  club: any;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {

  const fillPercent = Math.min((club.members / club.maxMembers) * 100, 100);
  return (
    <TouchableOpacity
  style={styles.yourClubCard}
  activeOpacity={0.9}
  onPress={onPress}
  onLongPress={() => {
    Alert.alert("Club options", "What would you like to do?", [
      { text: "Edit Club", onPress: onEdit },
      { text: "Delete Club", style: "destructive", onPress: onDelete },
      { text: "Cancel", style: "cancel" },
    ]);
  }}
>
      <View style={styles.roomArt}>
  <Image
    source={getClubTheme(club.themeId).image}
    style={styles.roomArtImage}
  />

  {club.unreadCount > 0 && (
    <View style={styles.unreadBadge}>
      <Text style={styles.unreadText}>{club.unreadCount}</Text>
    </View>
  )}
        <TouchableOpacity
  style={styles.editClubButton}
  onPress={onEdit}
  activeOpacity={0.8}
>
  <Ionicons name="pencil" size={14} color="#514841" />
</TouchableOpacity>
      </View>

      <View style={styles.clubInfo}>
        <Text style={styles.clubName} numberOfLines={1}>{club.name}</Text>
        <Text style={styles.clubMeta}>{club.members}/{club.maxMembers} members • Approval required</Text>
        <View style={styles.memberBarBg}>
          <View style={[styles.memberBarFill, { width: `${fillPercent}%` }]} />
        </View>
        <Text style={styles.currentReadLabel}>Current Read</Text>
        <Text style={styles.currentRead} numberOfLines={1}>{club.currentBook}</Text>
        {!!club.author && <Text style={styles.authorText} numberOfLines={1}>{club.author}</Text>}
    
      </View>
    </TouchableOpacity>
  );
}

function DiscoverClubCard({
  club,
  requested,
  approved,
  onRequestJoin,
  onOpenClub,
}: {
  club: any;
  requested: boolean;
  approved: boolean;
  onRequestJoin: () => void;
  onOpenClub: () => void;
}) {
  return (
    <TouchableOpacity style={styles.discoverCard} activeOpacity={0.88}>
      <View style={styles.discoverThemeArt}>
  <Image
    source={getClubTheme(club.themeId).image}
    style={styles.discoverThemeImage}
  />
</View>
      <View style={styles.discoverBody}>
        <Text style={styles.discoverName} numberOfLines={1}>{club.name}</Text>
        <Text style={styles.discoverMeta}>{club.members} members • Approval required</Text>
        <Text style={styles.discoverDescription} numberOfLines={2}>{club.description}</Text>
        <TouchableOpacity
  style={[
    styles.requestButton,
    requested && styles.requestButtonRequested,
    approved && styles.requestButtonRequested,
  ]}
  activeOpacity={0.85}
  onPress={approved ? onOpenClub : onRequestJoin}
  disabled={requested}
>
  <Text style={styles.requestButtonText}>
    {approved
  ? "Join Discussion"
  : requested
  ? "Request Sent"
  : "Request Join"}
  </Text>
</TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function CreateClubModal({
  visible,
  isEditing,
  onClose,
  clubName,
  setClubName,
  clubDescription,
  setClubDescription,
  currentBook,
  setCurrentBook,
  currentAuthor,
  setCurrentAuthor,
  onCreate,
  selectedThemeId,
  setSelectedThemeId,
  clubThemes,
}: any) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
  style={styles.modalBackdrop}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
  {isEditing ? "Edit Cozy Club" : "Start a Cozy Club"}
</Text>
              <Text style={styles.modalSubtitle}>Create a private reading nook.</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#5a3d30" />
            </TouchableOpacity>
          </View>
<Text style={styles.inputLabel}>Room Theme</Text>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.themePickerRow}
>
  {clubThemes.map((theme: any) => (
    <TouchableOpacity
      key={theme.id}
      style={[
        styles.themeOption,
        selectedThemeId === theme.id && styles.themeOptionSelected,
      ]}
      onPress={() => setSelectedThemeId(theme.id)}
      activeOpacity={0.85}
    >
      <Image source={theme.image} style={styles.themeOptionImage} />
      <Text style={styles.themeOptionText}>{theme.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
          <Text style={styles.inputLabel}>Club name</Text>
          <TextInput
            value={clubName}
            onChangeText={setClubName}
            placeholder="Moms Reading After Bedtime"
            placeholderTextColor="#a89584"
            style={styles.modalInput}
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            value={clubDescription}
            onChangeText={setClubDescription}
            placeholder="A cozy place to discuss books after bedtime."
            placeholderTextColor="#a89584"
            style={[styles.modalInput, styles.textArea]}
            multiline
          />

          <Text style={styles.inputLabel}>Current book</Text>
          <TextInput
            value={currentBook}
            onChangeText={setCurrentBook}
            placeholder="Fourth Wing"
            placeholderTextColor="#a89584"
            style={styles.modalInput}
          />

          <Text style={styles.inputLabel}>Author</Text>
          <TextInput
            value={currentAuthor}
            onChangeText={setCurrentAuthor}
            placeholder="Rebecca Yarros"
            placeholderTextColor="#a89584"
            style={styles.modalInput}
          />

          <View style={styles.moderationNote}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#7a5137" />
            <Text style={styles.moderationText}>
              Clubs are approval-only. As creator, you’ll moderate your room with AI backup.
            </Text>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={onCreate} activeOpacity={0.85}>
            <Text style={styles.createButtonText}>
  {isEditing ? "Save Changes" : "Create Club"}
</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.35,
  },
  overlay: {
    flex: 1,
   
  },
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 64,
    paddingBottom: 170,
  },

  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,250,243,0.92)",
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#eadcc9",
    shadowColor: "#514841",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 10,
    opacity: 0.8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#514841",
    fontSize: 16,
    opacity: 0.8,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#514841",
    fontFamily: FONT_HEAD,
  },
  sectionAction: {
    fontSize: 20,
    color: "#514841",
    fontWeight: "500",
    fontFamily: FONT_HEAD,
    marginBottom: 2,
  },
  horizontalList: {
    paddingRight: 18,
    gap: 14,
  },
  emptyCard: {
    backgroundColor: "rgba(255,250,243,0.86)",
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eadcc9",
    marginBottom: 4,
  },
  emptyIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#514841",
    fontFamily: FONT_HEAD,
  },
  emptyText: {
    marginTop: 5,
    color: "#8a725f",
    textAlign: "center",
    fontSize: 15,
  },
  emptyButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  primarySmallButton: {
    backgroundColor: "#514841",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  primarySmallButtonText: {
    color: "#fffaf3",
    fontWeight: "500",
    fontSize: 12,
  },
  secondarySmallButton: {
    backgroundColor: "#efe1cf",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  secondarySmallButtonText: {
    color: "#514841",
    fontWeight: "500",
    fontSize: 12,
  },
  createClubCard: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "#eadcc9bb",
    borderRadius: 30,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0cbb4",
  },
  createIconCircle: {
    height: 54,
    width: 54,
    borderRadius: 27,
    backgroundColor: "#fffaf3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  createIcon: {
    color: "#514841",
    fontSize: 28,
  },
  createTextWrap: {
    flex: 1,
  },
  createTitle: {
    fontSize: 25,
    fontWeight: "500",
    color: "#514841",
    fontFamily: FONT_HEAD,
  },
  createText: {
    color: "#514841",
    fontSize: 15,
    marginTop: 1,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    backgroundColor: "rgba(255,250,243,0.84)",
    borderWidth: 1,
    borderColor: "#eadcc9",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterText: {
    fontSize: 15,
    color: "#514841",
    fontWeight: "500",
  },
  yourClubCard: {
    width: 238,
    backgroundColor: "rgba(255,250,243,0.9)",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eadcc9",
    shadowColor: "#514841",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  roomArt: {
    height: 118,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#d9c2ac",
  },
  roomLightCircle: {
    position: "absolute",
    height: 160,
    width: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,250,243,0.28)",
  },
  roomEmoji: {
    fontSize: 48,
    zIndex: 2,
  },
  unreadBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fffaf3",
    borderRadius: 999,
    minWidth: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  unreadText: {
    color: "#514841",
    fontWeight: "500",
    fontSize: 12,
  },
  clubInfo: {
    padding: 14,
  },
  clubName: {
    fontSize: 24,
    fontWeight: "500",
    color: "#514841",
    fontFamily: FONT_HEAD,
  },
  clubMeta: {
    marginTop: 1,
    fontSize: 15,
    color: "#8a725f",
  },
  memberBarBg: {
    height: 6,
    backgroundColor: "#eadcc9",
    borderRadius: 99,
    marginTop: 10,
    overflow: "hidden",
  },
  memberBarFill: {
    height: "100%",
    backgroundColor: "#514841",
    borderRadius: 99,
  },
  currentReadLabel: {
    marginTop: 12,
    fontSize: 14,
    color: "#9d8b7c",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontWeight: "500",
  },
  currentRead: {
    marginTop: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#514841",
  },
  authorText: {
    marginTop: 0,
    fontSize: 15,
    color: "#514841",
  },
  discoverList: {
    gap: 14,
  },
  discoverEmptyCard: {
    backgroundColor: "rgba(255,250,243,0.82)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eadcc9",
  },
  discoverEmptyTitle: {
    fontSize: 23,
    color: "#514841",
    fontWeight: "500",
    fontFamily: FONT_HEAD,
  },
  discoverEmptyText: {
    color: "#514841",
    fontSize: 15,
    marginTop: 6,
    lineHeight: 21,
  },
  discoverCard: {
    backgroundColor: "#fffaf3",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eadcc9",
  },
  discoverRoom: {
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b9c99b",
  },
  discoverEmoji: {
    fontSize: 42,
  },
  discoverBody: {
    padding: 15,
  },
  discoverName: {
    fontSize: 24,
    fontWeight: "500",
    color: "#514841",
    fontFamily: FONT_HEAD,
  },
  discoverMeta: {
    marginTop: 1,
    fontSize: 14,
    color: "#514841",
  },
  discoverDescription: {
    color: "#514841",
    fontSize: 14,
    lineHeight: 19,
    marginTop: 8,
  },
  requestButton: {
    marginTop: 14,
    backgroundColor: "#514841",
    borderRadius: 18,
    paddingVertical: 11,
    alignItems: "center",
  },
  requestButtonText: {
    color: "#fffaf3",
    fontWeight: "500",
    fontSize: 13,
  },
  modalBackdrop: {
  flex: 1,
  justifyContent: "flex-start",
  backgroundColor: "rgba(44,31,24,0.28)",
  paddingTop: 70,
},
  modalCard: {
    backgroundColor: "#fffaf3",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 38,
    borderWidth: 1,
    borderColor: "#eadcc9",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 31,
    color: "#514841",
    fontFamily: FONT_HEAD,
    fontWeight: "500",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#8a725f",
    marginTop: -2,
  },
  closeButton: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: "#f1e6d8",
    alignItems: "center",
    justifyContent: "center",
  },
  inputLabel: {
    marginTop: 10,
    marginBottom: 5,
    color: "#514841",
    fontWeight: "500",
    fontSize: 14,
  },
  modalInput: {
    backgroundColor: "#f8f0e6",
    borderWidth: 1,
    borderColor: "#eadcc9",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#514841",
    fontSize: 15,
  },
  textArea: {
    minHeight: 76,
    textAlignVertical: "top",
  },
  moderationNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#f1e6d8",
    borderRadius: 18,
    padding: 12,
    marginTop: 14,
  },
  moderationText: {
    flex: 1,
    color: "#514841",
    fontSize: 13,
    lineHeight: 18,
  },
  createButton: {
    marginTop: 16,
    backgroundColor: "#514841",
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fffaf3",
    fontSize: 16,
    fontWeight: "500",
  },

header: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: -52,
  marginBottom: -50,
},

headerPlaque: {
  width: 450,
  height: 250,
  resizeMode: "contain",
},

editClubButton: {
  position: "absolute",
  top: 12,
  left: 12,
  height: 28,
  width: 28,
  borderRadius: 14,
  backgroundColor: "rgba(255,250,243,0.92)",
  alignItems: "center",
  justifyContent: "center",
},
requestButtonRequested: {
  backgroundColor: "#8a7d74",
},
themePickerRow: {
  gap: 12,
  paddingBottom: 12,
},

themeOption: {
  width: 118,
},

themeOptionSelected: {
  opacity: 1,
},

themeOptionImage: {
  width: 118,
  height: 150,
  borderRadius: 18,
  borderWidth: 2,
  borderColor: "transparent",
},

themeOptionText: {
  marginTop: 6,
  color: "#514841",
  fontSize: 13,
  fontWeight: "600",
  textAlign: "center",
},

roomArtImage: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},
discoverThemeArt: {
  height: 150,
  overflow: "hidden",
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
},

discoverThemeImage: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},
pendingApprovalButton: {
  backgroundColor: "#8c5b3c",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  alignSelf: "flex-start",
  marginTop: 8,
},

pendingApprovalText: {
  color: "#fff",
  fontSize: 12,
  fontWeight: "700",
},
});
