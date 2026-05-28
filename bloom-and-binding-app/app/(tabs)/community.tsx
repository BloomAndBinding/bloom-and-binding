import React, { useCallback, useEffect, useState } from "react";
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
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  searchGoogleBooks,
  GoogleBookResult,
} from "../../services/googleBooks";

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
const starterFriendUpdates = [
  {
    id: "update-1",
    text: "started reading Fourth Wing",
    timeAgo: "12m ago",
    hearts: 3,
    hearted: false,

    reader: {
      id: "reader-amanda",
      displayName: "Amanda",
      username: "@cozyreader",
      avatar: require("../../assets/avatars/cozy-chapter-keeper.png"),
      booksRead: 18,
      goal: 40,
      currentBook: "Fourth Wing",
      currentAuthor: "Rebecca Yarros",
      coverUrl:
        "https://books.google.com/books/content?id=5pPNEAAAQBAJ&printsec=frontcover&img=1&zoom=1",
      recentUpdates: [
  {
    text: "started reading Fourth Wing",
    hearts: 2,
    hearted: false,
  },
  {
    text: "joined Tea Nook Book Club",
    hearts: 1,
    hearted: true,
  },
  {
    text: "finished Iron Flame",
    hearts: 4,
    hearted: false,
  },
],
    },
  },

  {
    id: "update-2",
    text: "is reading Onyx Storm",
    timeAgo: "34m ago",
    hearts: 5,
    hearted: true,

    reader: {
      id: "reader-brittany",
      displayName: "Brittany",
      username: "@dragonqueen",
      avatar: require("../../assets/avatars/dragon-rider.png"),
      booksRead: 27,
      goal: 50,
      currentBook: "Onyx Storm",
      currentAuthor: "Rebecca Yarros",
      coverUrl:
        "https://books.google.com/books/content?id=5pPNEAAAQBAJ&printsec=frontcover&img=1&zoom=1",
      recentUpdates: [
  {
    text: "started reading Fourth Wing",
    hearts: 2,
    hearted: false,
  },
  {
    text: "joined Tea Nook Book Club",
    hearts: 1,
    hearted: true,
  },
  {
    text: "finished Iron Flame",
    hearts: 4,
    hearted: false,
  },
],
    },
  },

  {
    id: "update-3",
    text: "finished The Women",
    timeAgo: "1h ago",
    hearts: 2,
    hearted: false,

    reader: {
      id: "reader-sarah",
      displayName: "Sarah",
      username: "@midnightpages",
      avatar: require("../../assets/avatars/moonlit-oracle.png"),
      booksRead: 11,
      goal: 24,
      currentBook: "The Women",
      currentAuthor: "Kristin Hannah",
      coverUrl:
        "https://books.google.com/books/content?id=5pPNEAAAQBAJ&printsec=frontcover&img=1&zoom=1",
      recentUpdates: [
  {
    text: "started reading Fourth Wing",
    hearts: 2,
    hearted: false,
  },
  {
    text: "joined Tea Nook Book Club",
    hearts: 1,
    hearted: true,
  },
  {
    text: "finished Iron Flame",
    hearts: 4,
    hearted: false,
  },
],
    },
  },
];
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
  const [coverUrl, setCoverUrl] = useState("");
  const [bookSearch, setBookSearch] = useState("");
const [bookResults, setBookResults] = useState<any[]>([]);
const [bookSearching, setBookSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
const [friendUpdates, setFriendUpdates] = useState(starterFriendUpdates);
const [selectedReader, setSelectedReader] = useState<any | null>(null);
const [readerProfileVisible, setReaderProfileVisible] = useState(false);
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState("dragon-library");
  const [approvedClubIds, setApprovedClubIds] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<
  Record<string, { id: string; displayName: string; username: string }[]>
>({});
  const visibleClubs = yourClubs.filter(
  (club) => club?.id && club?.name?.trim() && !club.deleted
);

const hasClubs = visibleClubs.length > 0;
const discoverClubs = visibleClubs.filter((club) => {
  const search = searchText.trim().toLowerCase();

  if (!search) return true;

  return (
    club.name?.toLowerCase().includes(search) ||
    club.description?.toLowerCase().includes(search) ||
    club.currentBook?.toLowerCase().includes(search) ||
    club.author?.toLowerCase().includes(search)
  );
});

async function loadClubs() {
  try {
    const saved = await AsyncStorage.getItem(CLUBS_STORAGE_KEY);
    if (saved) {
      const parsedClubs = JSON.parse(saved);
      setYourClubs(
        parsedClubs.filter(
          (club: any) => club?.id && club?.name?.trim() && !club.deleted
        )
      );
    }

    const savedRequests = await AsyncStorage.getItem(REQUESTS_STORAGE_KEY);
    if (savedRequests) {
      setPendingRequests(JSON.parse(savedRequests));
    }
  } catch (error) {
    console.log("Error loading clubs", error);
  }
}

async function saveClubs(nextClubs: any[]) {
  const cleanClubs = nextClubs.filter(
    (club) => club?.id && club?.name?.trim() && !club.deleted
  );

  setYourClubs(cleanClubs);
  await AsyncStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(cleanClubs));
}
async function savePendingRequests(nextRequests: any) {
  setPendingRequests(nextRequests);
  await AsyncStorage.setItem(
    REQUESTS_STORAGE_KEY,
    JSON.stringify(nextRequests)
  );
}

function toggleHeartUpdate(updateId: string) {
  setFriendUpdates((prev) =>
    prev.map((update) =>
      update.id === updateId
        ? {
            ...update,
            hearted: !update.hearted,
            hearts: update.hearted ? update.hearts - 1 : update.hearts + 1,
          }
        : update
    )
  );
}

function resetClubForm() {
  setEditingClubId(null);
  setClubName("");
  setClubDescription("");
  setCurrentBook("");
  setCurrentAuthor("");
  setCoverUrl("");
  setBookSearch("");
  setBookResults([]);
  setBookSearching(false);
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
  setBookSearch(
  club.currentBook && club.currentBook !== "No current read yet"
    ? club.author
      ? `${club.currentBook} — ${club.author}`
      : club.currentBook
    : ""
);
  setSelectedThemeId(club.themeId || "dragon-library");
  setCreateVisible(true);
  setCoverUrl(club.coverUrl || "");
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
          const saved = await AsyncStorage.getItem(CLUBS_STORAGE_KEY);
          const storedClubs = saved ? JSON.parse(saved) : yourClubs;

          const nextClubs = storedClubs.filter(
            (club: any) => club.id !== clubId
          );

          setYourClubs(nextClubs);
          await AsyncStorage.setItem(
            CLUBS_STORAGE_KEY,
            JSON.stringify(nextClubs)
          );

          const savedComments = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
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
async function searchBooks(query: string) {
  const trimmedQuery = query.trim();
  setBookSearch(query);

  if (trimmedQuery.length < 3) {
    setBookResults([]);
    return;
  }

  try {
    setBookSearching(true);

   const books = await searchGoogleBooks(trimmedQuery);
console.log("Community books:", books.length);
console.log("First result:", books[0]);

    const results = books.map((book: GoogleBookResult) => ({
      key: book.id,
      title: book.title,
      author: book.authors?.join(", ") || "",
      year: "",
      coverUrl: book.coverUrl || "",
    }));

    setBookResults(results);
  } catch (error) {
    console.log("Community book search error:", error);
    setBookResults([]);
    Alert.alert("Book search error", "Something went wrong while searching books.");
  } finally {
    setBookSearching(false);
  }
}

function selectBook(book: any) {
  setCurrentBook(book.title || "");
  setCurrentAuthor(book.author || "");
  setCoverUrl(book.coverUrl || "");
  setBookSearch(book.author ? `${book.title} — ${book.author}` : book.title);
  setBookResults([]);
}
function updateBookSearchText(text: string) {
  setBookSearch(text);
  setBookResults([]);
  setCurrentBook("");
  setCurrentAuthor("");
  setCoverUrl("");
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
coverUrl: coverUrl || "",
          }
        : club
    );

    await saveClubs(nextClubs);
  } else {
    const newClubId = `club-${Date.now()}`;

const newClub = {
  id: newClubId,
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
      coverUrl: coverUrl || "",
    };

    await saveClubs([newClub, ...yourClubs]);

resetClubForm();
setCoverUrl("");
setCreateVisible(false);
router.push(`/club/${newClubId}`);
return;
  }

  resetClubForm();
  setCoverUrl("");
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
          <SectionHeader title="Your Clubs" />

          {hasClubs ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalList}>
              {visibleClubs.map((club) => (
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

          <SectionHeader title="Discover Clubs" />

<View style={styles.searchCard}>
            <Ionicons name="search" size={20} color="#8a725f" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search clubs, books, or authors…"
              placeholderTextColor="#6F655D"
              style={styles.searchInput}
            />
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
<View style={styles.friendUpdatesSection}>
  <SectionHeader title="Friends Reading Updates" />

  <View style={styles.friendUpdatesList}>
  {friendUpdates.map((update) => (
    <TouchableOpacity
  key={update.id}
  style={styles.friendUpdateCard}
  activeOpacity={0.88}
  onPress={() => {
    setSelectedReader(update.reader);
    setReaderProfileVisible(true);
  }}
>
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarText}>
          {update.reader.displayName.charAt(0)}
        </Text>
      </View>

      <View style={styles.friendUpdateBody}>
        <Text style={styles.friendUpdateText}>
          <Text style={styles.friendUpdateName}>{update.reader.displayName}</Text>{" "}
          {update.text}
        </Text>

        <Text style={styles.friendUpdateTime}>
          {update.timeAgo}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => toggleHeartUpdate(update.id)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={update.hearted ? "heart" : "heart-outline"}
          size={20}
          color="#7a5137"
        />

        <Text style={styles.heartCount}>
          {update.hearts}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ))}
</View>
</View>
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
          bookSearch={bookSearch}
          searchBooks={searchBooks}
          bookResults={bookResults}
          bookSearching={bookSearching}
          selectBook={selectBook}
          updateBookSearchText={updateBookSearchText}
        />

        <ReaderProfileModal
  visible={readerProfileVisible}
  reader={selectedReader}
  onClose={() => setReaderProfileVisible(false)}
/>

      </View>
    </ImageBackground>
  );
}

function ReaderProfileModal({ visible, reader, onClose }: any) {
  if (!reader) return null;
const [updates, setUpdates] = useState(reader.recentUpdates || []);
  const progressPercent = Math.min(
    (reader.booksRead / reader.goal) * 100,
    100
  );

function toggleReaderHeart(index: number) {
  setUpdates((prev: any[]) =>
    prev.map((item, i) =>
      i === index
        ? {
            ...item,
            hearted: !item.hearted,
            hearts: item.hearted ? item.hearts - 1 : item.hearts + 1,
          }
        : item
    )
  );
}

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.readerModalBackdrop}>
        <View style={styles.readerModalCard}>
          <View style={styles.readerModalHeader}>
            <Image source={reader.avatar} style={styles.readerAvatarLarge} />

            <View style={styles.readerInfo}>
              <Text style={styles.readerName}>{reader.displayName}</Text>
              <Text style={styles.readerUsername}>{reader.username}</Text>

              <Text style={styles.readerGoalText}>
                {reader.booksRead}/{reader.goal} books this year
              </Text>

              <View style={styles.readerGoalBarBg}>
                <View
                  style={[
                    styles.readerGoalBarFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.readerCloseButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#514841" />
            </TouchableOpacity>
          </View>

          <View style={styles.readerCurrentBookCard}>
            <Image
              source={{ uri: reader.coverUrl }}
              style={styles.readerBookCover}
            />

            <View style={styles.readerCurrentBookInfo}>
              <Text style={styles.readerCurrentLabel}>Current Read</Text>
              <Text style={styles.readerCurrentTitle}>
                {reader.currentBook}
              </Text>
              <Text style={styles.readerCurrentAuthor}>
                {reader.currentAuthor}
              </Text>
            </View>
          </View>

          <Text style={styles.readerUpdatesTitle}>Recent Updates</Text>

          <ScrollView
            style={styles.readerUpdatesScroll}
            showsVerticalScrollIndicator={false}
          >
            {updates.map((item: any, index: number) => (
  <View key={`${item.text}-${index}`} style={styles.readerUpdateRow}>
    <Text style={styles.readerUpdateText}>
      {item.text}
    </Text>

    <TouchableOpacity
      style={styles.readerUpdateHeartButton}
      onPress={() => toggleReaderHeart(index)}
      activeOpacity={0.8}
    >
      <Ionicons
        name={item.hearted ? "heart" : "heart-outline"}
        size={16}
        color="#7a5137"
      />

      <Text style={styles.readerUpdateHeartCount}>
        {item.hearts}
      </Text>
    </TouchableOpacity>
  </View>
))}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
  <View style={styles.themeImageOverlay} />

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
  <View style={styles.themeImageOverlay} />
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
  bookSearch,
  searchBooks,
  bookResults,
  bookSearching,
  selectBook,
  updateBookSearchText,
}: any) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
  style={styles.modalBackdrop}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <View style={styles.modalCard}>
  <ScrollView
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={styles.modalScrollContent}
  >
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
          /><Text style={styles.inputLabel}>Current book</Text>
<TextInput
  value={bookSearch}
  onChangeText={updateBookSearchText}
  placeholder="Search by title or author"
  placeholderTextColor="#a89584"
  style={styles.modalInput}
/>
<TouchableOpacity
  style={styles.bookSearchButton}
  onPress={() => searchBooks(bookSearch)}
  activeOpacity={0.85}
>
  <Text style={styles.bookSearchButtonText}>Search books</Text>
</TouchableOpacity>
{bookSearching ? (
  <Text style={styles.bookSearchHint}>Searching books...</Text>
) : null}

{bookResults.length > 0 ? (
  <View style={styles.bookResultsBox}>
    {bookResults.map((book: any) => (
      <TouchableOpacity
  key={book.key}
  style={styles.bookResultRow}
  onPress={() => selectBook(book)}
  activeOpacity={0.8}
>
  <Image
    source={{ uri: book.coverUrl }}
    style={styles.bookResultCover}
  />

  <View style={styles.bookResultInfo}>
    <Text style={styles.bookResultTitle}>{book.title}</Text>

    {!!book.author && (
      <Text style={styles.bookResultAuthor}>
        {book.author}
        {book.year ? ` • ${book.year}` : ""}
      </Text>
    )}
  </View>
</TouchableOpacity>
    ))}
  </View>
) : null}

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
          </ScrollView>
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
    marginBottom: 0,
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
  justifyContent: "flex-end",
  backgroundColor: "rgba(44,31,24,0.28)",
},

modalCard: {
  backgroundColor: "#fffaf3",
  borderTopLeftRadius: 34,
  borderTopRightRadius: 34,
  borderBottomLeftRadius: 34,
  borderBottomRightRadius: 34,
  paddingHorizontal: 20,
  paddingTop: 18,
  paddingBottom: 24,
  borderWidth: 1,
  borderColor: "#eadcc9",
  maxHeight: "88%",
  marginHorizontal: 0,
  marginBottom: 0,
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
themeImageOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(30, 20, 12, 0.18)",
},
modalScrollContent: {
  paddingBottom: 24,
},

themePickerRow: {
  gap: 12,
  paddingBottom: 14,
},

themeOption: {
  width: 110,
  opacity: 0.72,
},

themeOptionSelected: {
  opacity: 1,
  transform: [{ scale: 1.04 }],
},

themeOptionImage: {
  width: 110,
  height: 135,
  borderRadius: 16,
  borderWidth: 3,
  borderColor: "transparent",
},

themeOptionText: {
  marginTop: 6,
  color: "#514841",
  fontSize: 12,
  fontWeight: "600",
  textAlign: "center",
},
bookSearchHint: {
  marginTop: 6,
  color: "#8a725f",
  fontSize: 13,
},

bookResultsBox: {
  marginTop: 8,
  backgroundColor: "#f8f0e6",
  borderWidth: 1,
  borderColor: "#eadcc9",
  borderRadius: 18,
  overflow: "hidden",
},

bookResultRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#eadcc9",
},

bookResultTitle: {
  color: "#514841",
  fontSize: 15,
  fontWeight: "600",
},

bookResultAuthor: {
  marginTop: 2,
  color: "#8a725f",
  fontSize: 13,
},
bookResultCover: {
  width: 44,
  height: 64,
  borderRadius: 6,
  backgroundColor: "#eadcc9",
  marginRight: 10,
},

bookResultInfo: {
  flex: 1,
},
bookSearchButton: {
  marginTop: 8,
  backgroundColor: "#eadcc9",
  borderRadius: 16,
  paddingVertical: 10,
  alignItems: "center",
},

bookSearchButtonText: {
  color: "#514841",
  fontSize: 14,
  fontWeight: "600",
},

friendUpdatesList: {
  gap: 10,
  marginBottom: 24,
  marginTop: 4,
},

friendUpdateCard: {
  backgroundColor: "rgba(255,250,243,0.88)",
  borderRadius: 22,
  borderWidth: 1,
  borderColor: "#eadcc9",
  padding: 12,
  flexDirection: "row",
  alignItems: "center",
},

friendAvatar: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#eadcc9",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 10,
},

friendAvatarText: {
  color: "#514841",
  fontSize: 18,
  fontWeight: "700",
},

friendUpdateBody: {
  flex: 1,
},

friendUpdateText: {
  color: "#514841",
  fontSize: 15,
  lineHeight: 20,
},

friendUpdateName: {
  fontWeight: "700",
},

friendUpdateTime: {
  color: "#8a725f",
  fontSize: 13,
  marginTop: 2,
},

heartButton: {
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 10,
},

heartCount: {
  color: "#7a5137",
  fontSize: 12,
  marginTop: 1,
},
friendUpdatesSection: {
  marginTop: 18,
},
readerModalBackdrop: {
  flex: 1,
  backgroundColor: "rgba(33, 24, 18, 0.42)",
  justifyContent: "center",
  paddingHorizontal: 20,
},

readerModalCard: {
  backgroundColor: "#fffaf3",
  borderRadius: 32,
  padding: 20,
  maxHeight: "82%",
  borderWidth: 1,
  borderColor: "#eadcc9",
},

readerModalHeader: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 18,
},

readerAvatarLarge: {
  width: 120,
  height: 150,
  resizeMode: "contain",
  marginRight: 18,
},

readerInfo: {
  flex: 1,
},

readerName: {
  fontSize: 30,
  color: "#514841",
  fontFamily: FONT_HEAD,
  fontWeight: "600",
},

readerUsername: {
  color: "#8a725f",
  fontSize: 15,
  marginTop: -2,
},

readerGoalText: {
  marginTop: 12,
  color: "#514841",
  fontSize: 14,
  fontWeight: "600",
},

readerGoalBarBg: {
  marginTop: 8,
  height: 8,
  borderRadius: 999,
  backgroundColor: "#eadcc9",
  overflow: "hidden",
},

readerGoalBarFill: {
  height: "100%",
  backgroundColor: "#7a5137",
  borderRadius: 999,
},

readerCloseButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#f1e6d8",
  alignItems: "center",
  justifyContent: "center",
},

readerCurrentBookCard: {
  flexDirection: "row",
  backgroundColor: "#f6efe5",
  borderRadius: 22,
  padding: 12,
  marginBottom: 18,
},

readerBookCover: {
  width: 72,
  height: 108,
  borderRadius: 12,
  marginRight: 14,
  backgroundColor: "#eadcc9",
},

readerCurrentBookInfo: {
  flex: 1,
  justifyContent: "center",
},

readerCurrentLabel: {
  color: "#9d8b7c",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 1.4,
  marginBottom: 6,
},

readerCurrentTitle: {
  color: "#514841",
  fontSize: 22,
  fontFamily: FONT_HEAD,
  fontWeight: "600",
},

readerCurrentAuthor: {
  color: "#8a725f",
  fontSize: 15,
  marginTop: 2,
},

readerUpdatesTitle: {
  color: "#514841",
  fontSize: 24,
  fontFamily: FONT_HEAD,
  fontWeight: "600",
  marginBottom: 10,
},

readerUpdatesScroll: {
  maxHeight: 220,
},

readerUpdateRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 12,
},

readerUpdateBullet: {
  color: "#7a5137",
  fontSize: 14,
  marginRight: 8,
  marginTop: 1,
},

readerUpdateText: {
  flex: 1,
  color: "#514841",
  fontSize: 15,
  lineHeight: 20,
},
readerUpdateHeartButton: {
  flexDirection: "row",
  alignItems: "center",
  marginLeft: 12,
},

readerUpdateHeartCount: {
  color: "#7a5137",
  fontSize: 12,
  marginLeft: 4,
},
});
