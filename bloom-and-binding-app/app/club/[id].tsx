import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Share,
  Modal,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  searchGoogleBooks,
  GoogleBookResult,
} from "../../services/googleBooks";

const CLUBS_STORAGE_KEY = "bloom_binding_your_clubs";
const COMMENTS_STORAGE_KEY = "bloom_binding_club_comments";
const REQUESTS_STORAGE_KEY = "bloom_binding_club_requests";
const BACKGROUND_IMAGE = require("../../assets/images/community-bg.png");
const FONT_HEAD = "CormorantGaramond-Bold";
const CURRENT_USER = {
  id: "user-brittany",
  displayName: "Brittany",
  username: "@dragonqueen",
};
const CLUB_THEMES = {
  "dragon-library": require("../../assets/images/club-themes/dragon-library.png"),
  "tea-nook": require("../../assets/images/club-themes/tea-nook.png"),
  "enchanted-forest": require("../../assets/images/club-themes/enchanted-forest.png"),
  "celestial-study": require("../../assets/images/club-themes/celestial-study.png"),
};
export default function ClubDetailScreen() {
    const [editVisible, setEditVisible] = useState(false);
const [editName, setEditName] = useState("");
const [editDescription, setEditDescription] = useState("");
const [editBook, setEditBook] = useState("");
const [editAuthor, setEditAuthor] = useState("");
const [editThemeId, setEditThemeId] = useState("dragon-library");
const [bookSearchVisible, setBookSearchVisible] = useState(false);
const [bookSearchText, setBookSearchText] = useState("");
const [bookSearchResults, setBookSearchResults] = useState<any[]>([]);
const [selectedBook, setSelectedBook] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const clubId = Array.isArray(id) ? id[0] : String(id);

  const [club, setClub] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [spoilerMode, setSpoilerMode] = useState(false);
  const [spoilerChapter, setSpoilerChapter] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [manageVisible, setManageVisible] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);

  useEffect(() => {
    loadClub();

    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [clubId]);

  async function loadClub() {
    try {
      const saved = await AsyncStorage.getItem(CLUBS_STORAGE_KEY);
      const clubs = saved ? JSON.parse(saved) : [];
      const foundClub = clubs.find((item: any) => item.id === clubId);
      setClub(foundClub || null);

      const savedComments = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
      const allComments = savedComments ? JSON.parse(savedComments) : {};
      setMessages(allComments[clubId] || []);
      const savedRequests = await AsyncStorage.getItem(REQUESTS_STORAGE_KEY);
const allRequests = savedRequests ? JSON.parse(savedRequests) : {};
setPendingRequests(allRequests[clubId] || []);
    } catch (error) {
      console.log("Could not load club", error);
    }
  }

  async function saveClubs(nextClubs: any[]) {
  await AsyncStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(nextClubs));
}
async function savePendingRequests(nextRequests: any[]) {
  setPendingRequests(nextRequests);

  const savedRequests = await AsyncStorage.getItem(REQUESTS_STORAGE_KEY);
  const allRequests = savedRequests ? JSON.parse(savedRequests) : {};

  allRequests[clubId] = nextRequests;

  await AsyncStorage.setItem(
    REQUESTS_STORAGE_KEY,
    JSON.stringify(allRequests)
  );
}

async function approveRequest(personId: string) {
  const approvedPerson = pendingRequests.find(
    (person) => person.id === personId
  );

  const nextPending = pendingRequests.filter(
    (person) => person.id !== personId
  );

  await savePendingRequests(nextPending);

  const saved = await AsyncStorage.getItem(CLUBS_STORAGE_KEY);
  const clubs = saved ? JSON.parse(saved) : [];

  const nextClubs = clubs.map((item: any) => {
    if (item.id !== clubId) return item;

    const existingMembers = item.memberUsers || [
      {
        id: CURRENT_USER.id,
        displayName: CURRENT_USER.displayName,
        username: CURRENT_USER.username,
        role: "host",
      },
    ];

    const alreadyMember = existingMembers.some(
      (member: any) => member.id === personId
    );

    return {
      ...item,
      memberUsers:
        approvedPerson && !alreadyMember
          ? [...existingMembers, { ...approvedPerson, role: "member" }]
          : existingMembers,
      members: Math.min(existingMembers.length + 1, item.maxMembers || 50),
    };
  });

  await saveClubs(nextClubs);
  setClub(nextClubs.find((item: any) => item.id === clubId));
}
async function declineRequest(personId: string) {
  const nextPending = pendingRequests.filter(
    (person) => person.id !== personId
  );

  await savePendingRequests(nextPending);
}
async function removeMember(personId: string) {
  if (personId === CURRENT_USER.id) return;

  Alert.alert(
    "Remove member?",
    "Are you sure you want to remove this member from the club?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const saved = await AsyncStorage.getItem(CLUBS_STORAGE_KEY);
          const clubs = saved ? JSON.parse(saved) : [];

          const nextClubs = clubs.map((item: any) => {
            if (item.id !== clubId) return item;

            const existingMembers = item.memberUsers || [
              {
                id: CURRENT_USER.id,
                displayName: CURRENT_USER.displayName,
                username: CURRENT_USER.username,
                role: "host",
              },
            ];

            const nextMembers = existingMembers.filter(
              (member: any) => member.id !== personId
            );

            return {
              ...item,
              memberUsers: nextMembers,
              members: nextMembers.length,
            };
          });

          await saveClubs(nextClubs);
          setClub(nextClubs.find((item: any) => item.id === clubId));
        },
      },
    ]
  );
}
function openEditClub() {
  setEditName(club?.name || "");
  setEditDescription(club?.description || "");
  setEditBook(
    club?.currentBook === "No current read yet"
      ? ""
      : club?.currentBook || ""
  );
  setEditAuthor(club?.author || "");
  setEditThemeId(club?.themeId || "dragon-library");
  setSelectedBook(
    club?.currentBook
      ? {
          id: club?.googleBooksId || "",
          title: club?.currentBook || "",
          author: club?.author || "",
          coverUrl: club?.coverUrl || "",
        }
      : null
  );
  setEditVisible(true);
}

async function searchBooks() {
  const query = bookSearchText.trim();

  if (!query) {
    Alert.alert("Search needed", "Type a book title or author first.");
    return;
  }

  Keyboard.dismiss();

  try {
    const results: GoogleBookResult[] = await searchGoogleBooks(query);

    const mappedResults = results.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.authors?.join(", ") || "",
      coverUrl: book.coverUrl || "",
    }));

    setBookSearchResults(mappedResults);

    if (mappedResults.length === 0) {
      Alert.alert("No results", "Try a different title or author.");
    }
  } catch (error) {
    console.log("Could not search books", error);
    Alert.alert("Search failed", "Could not search books right now.");
  }
}

async function shareClub() {
  if (!club) return;

  try {
    await Share.share({
      message: `Join my Bloom & Binding club "${club.name}" 📚☕${
        club.currentBook && club.currentBook !== "No current read yet"
          ? `\nCurrently reading: ${club.currentBook}`
          : ""
      }`,
    });
  } catch (error) {
    console.log("Could not share club", error);
  }
}

function chooseBook(book: any) {
  setSelectedBook(book);
  setEditBook(book.title);
  setEditAuthor(book.author);
  setBookSearchVisible(false);
  setTimeout(() => {
    setEditVisible(true);
  }, 250);
}

async function saveEditedClub() {
  const trimmedName = editName.trim();

  if (!trimmedName) {
    Alert.alert("Club name needed", "Give your cozy club a name.");
    return;
  }

  const saved = await AsyncStorage.getItem(CLUBS_STORAGE_KEY);
  const clubs = saved ? JSON.parse(saved) : [];

  const nextClubs = clubs.map((item: any) =>
    item.id === clubId
      ? {
          ...item,
          name: trimmedName,
          description:
            editDescription.trim() ||
            "A cozy reading nook for bookish friends.",
          currentBook: editBook.trim() || "No current read yet",
author: editAuthor.trim() || "",
coverUrl: selectedBook?.coverUrl || club?.coverUrl || "",
googleBooksId: selectedBook?.id || club?.googleBooksId || "",
themeId: editThemeId,
        }
      : item
  );

  await AsyncStorage.setItem(
    CLUBS_STORAGE_KEY,
    JSON.stringify(nextClubs)
  );

  setClub(
    nextClubs.find((item: any) => item.id === clubId)
  );

  setEditVisible(false);
}

async function deleteClub() {
  Alert.alert(
    "Delete club?",
    "This will remove the club and its comments.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const saved = await AsyncStorage.getItem(CLUBS_STORAGE_KEY);
          const clubs = saved ? JSON.parse(saved) : [];
          const nextClubs = clubs.filter((item: any) => item.id !== clubId);

          await saveClubs(nextClubs);

          const savedComments = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
          const allComments = savedComments ? JSON.parse(savedComments) : {};
          delete allComments[clubId];

          await AsyncStorage.setItem(
            COMMENTS_STORAGE_KEY,
            JSON.stringify(allComments)
          );

          router.back();
        },
      },
    ]
  );
}

  async function saveMessages(nextMessages: any[]) {
    setMessages(nextMessages);

    const savedComments = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
    const allComments = savedComments ? JSON.parse(savedComments) : {};

    allComments[clubId] = nextMessages;

    await AsyncStorage.setItem(
      COMMENTS_STORAGE_KEY,
      JSON.stringify(allComments)
    );
  }
async function addReaction(messageId: string, emoji: string) {
  const currentUser = "You";

  const nextMessages = messages.map((item) => {
    if (item.id !== messageId) return item;

    return {
      ...item,
      reactions: {
        ...(item.reactions || {}),
        [currentUser]: emoji,
      },
    };
  });

  await saveMessages(nextMessages);
  setActiveReactionMessageId(null);
}
  async function deleteMessage(messageId: string) {
    const nextMessages = messages.filter((item) => item.id !== messageId);
    await saveMessages(nextMessages);
  }

  function editMessage(item: any) {
    Alert.prompt(
      "Edit comment",
      "Update your comment below.",
      async (updatedText) => {
        if (!updatedText?.trim()) return;

        const nextMessages = messages.map((messageItem) =>
          messageItem.id === item.id
            ? { ...messageItem, text: updatedText.trim(), edited: true }
            : messageItem
        );

        await saveMessages(nextMessages);
      },
      "plain-text",
      item.text
    );
  }

  async function sendMessage() {
    const trimmed = message.trim();

    if (!trimmed) return;

    if (spoilerMode && !spoilerChapter.trim()) {
      Alert.alert("Chapter needed", "Add a chapter number for spoiler comments.");
      return;
    }

    const newMessage = {
      id: `message-${Date.now()}`,
      userId: CURRENT_USER.id,
      displayName: CURRENT_USER.displayName,
      username: CURRENT_USER.username,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      text: trimmed,
      spoiler: spoilerMode,
      chapter: spoilerChapter.trim(),
    };

    const nextMessages = [...messages, newMessage];

    await saveMessages(nextMessages);

    setMessage("");
    setSpoilerMode(false);
    setSpoilerChapter("");
    Keyboard.dismiss();
  }
const memberUsers = club?.memberUsers || [
  {
    id: CURRENT_USER.id,
    displayName: CURRENT_USER.displayName,
    username: CURRENT_USER.username,
    role: "host",
  },
];

const uniqueMembers = memberUsers.filter(
  (member: any, index: number, self: any[]) =>
    index === self.findIndex((m: any) => m.id === member.id)
);
  return (
  <ImageBackground
    source={
  club?.themeId
    ? CLUB_THEMES[club.themeId as keyof typeof CLUB_THEMES]
    : BACKGROUND_IMAGE
}
    style={styles.background}
    imageStyle={styles.backgroundImage}
  >
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color="#514841" />
          </TouchableOpacity>

          <View style={styles.topBarActions}>
              <TouchableOpacity
  style={styles.iconButton}
  onPress={shareClub}
>
  <Ionicons name="share-outline" size={20} color="#514841" />
</TouchableOpacity>
  
  <TouchableOpacity
  style={styles.iconButton}
  onPress={openEditClub}
>
  <Ionicons name="pencil" size={19} color="#514841" />
</TouchableOpacity>

  <TouchableOpacity style={styles.iconButton} onPress={deleteClub}>
    <Ionicons name="trash-outline" size={20} color="#514841" />
  </TouchableOpacity>
  <TouchableOpacity
  style={styles.iconButton}
  onPress={() => setManageVisible(true)}
>
  <Ionicons name="people-outline" size={20} color="#514841" />
</TouchableOpacity>
</View>
        </View>

        <View style={styles.heroCard}>
  <View style={styles.heroRow}>
      
    <View style={styles.bookCover}>
  {club?.coverUrl ? (
    <Image
      source={{ uri: club.coverUrl }}
      style={styles.bookCoverImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.bookEmoji}>📖</Text>
  )}
</View>
    <View style={styles.heroInfo}>
      <Text style={styles.clubName}>
        {club?.name || "Club Room"}
      </Text>

      <Text style={styles.members}>
        {club ? `${club.members} / ${club.maxMembers} members` : ""}
      </Text>

      <Text style={styles.currentReadLabel}>CURRENT READ</Text>

      <Text style={styles.bookTitle}>
        {club?.currentBook || "No current read yet"}
      </Text>

      {!!club?.author && (
        <Text style={styles.author}>
          {club.author}
        </Text>
      )}

      {!!club?.description && (
        <Text style={styles.clubDescription}>
          {club.description}
        </Text>
      )}
    </View>
  </View>
</View>

        <View style={styles.discussionCard}>
          <Text style={styles.sectionTitle}>Discussion</Text>

          {messages.length > 0 ? (
            messages.map((item) => (
              <MessageBubble
  key={item.id}
  message={item}
  isReactionPickerOpen={activeReactionMessageId === item.id}
  onToggleReactionPicker={() =>
    setActiveReactionMessageId((current) =>
      current === item.id ? null : item.id
    )
  }
  onEdit={() => editMessage(item)}
  onDelete={() => deleteMessage(item.id)}
  onReact={(emoji) => addReaction(item.id, emoji)}
/>
            ))
          ) : (
            <Text style={styles.emptyDiscussionText}>
              No messages yet. Start the conversation ☕
            </Text>
          )}
        </View>
      </ScrollView>

      {spoilerMode && (
        <View style={styles.chapterWrap}>
          <TextInput
            value={spoilerChapter}
            onChangeText={setSpoilerChapter}
            placeholder="Spoilers from chapter..."
            placeholderTextColor="#8a7d74"
            style={styles.chapterInput}
            keyboardType="number-pad"
          />
        </View>
      )}

      <View
        style={[
          styles.composerWrap,
          {
            marginBottom: keyboardVisible ? -70 : 20,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.spoilerButton,
            spoilerMode && styles.spoilerButtonActive,
          ]}
          onPress={() => setSpoilerMode((prev) => !prev)}
        >
          <Text style={styles.spoilerButtonText}>
            {spoilerMode ? "Spoiler On" : "Spoiler?"}
          </Text>
        </TouchableOpacity>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Say something cozy..."
          placeholderTextColor="#8a7d74"
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="#fffaf3" />
        </TouchableOpacity>
      </View>

      <Modal
  visible={editVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setEditVisible(false)}
>
  <KeyboardAvoidingView
    style={styles.modalOverlay}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView
      contentContainerStyle={styles.modalScrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>Edit Cozy Club</Text>
      <Text style={styles.modalLabel}>Room Theme</Text>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.themePickerRow}
>
  {Object.entries(CLUB_THEMES).map(([themeId, image]) => (
    <TouchableOpacity
      key={themeId}
      style={[
        styles.themeOption,
        editThemeId === themeId && styles.themeOptionSelected,
      ]}
      onPress={() => setEditThemeId(themeId)}
      activeOpacity={0.85}
    >
      <Image source={image} style={styles.themeOptionImage} />
      <Text style={styles.themeOptionText}>
        {themeId
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      <Text style={styles.modalLabel}>Club Name</Text>
<TextInput
  value={editName}
  onChangeText={setEditName}
  placeholder="Club name"
  style={styles.modalInput}
/>

      <Text style={styles.modalLabel}>Description</Text>
<TextInput
  value={editDescription}
  onChangeText={setEditDescription}
  placeholder="Club description"
  style={styles.modalInput}
  multiline
/>

      <Text style={styles.modalLabel}>Current Read</Text>

<TouchableOpacity
  style={styles.chooseBookButton}
  onPress={() => {
    Keyboard.dismiss();
    setEditVisible(false);
    setTimeout(() => {
      setBookSearchVisible(true);
    }, 250);
  }}
>
  <Text style={styles.chooseBookButtonText}>
    {editBook ? "Change Current Read" : "Choose Current Read"}
  </Text>
</TouchableOpacity>

{!!editBook && (
  <View style={styles.selectedBookPreview}>
    {selectedBook?.coverUrl ? (
      <Image
        source={{ uri: selectedBook.coverUrl }}
        style={styles.selectedBookCover}
      />
    ) : null}

    <View style={styles.selectedBookInfo}>
      <Text style={styles.selectedBookTitle}>{editBook}</Text>
      {!!editAuthor && (
        <Text style={styles.selectedBookAuthor}>{editAuthor}</Text>
      )}
    </View>
  </View>
)}

      <View style={styles.modalActions}>
  <TouchableOpacity
    style={styles.modalSecondaryButton}
    onPress={() => setEditVisible(false)}
  >
    <Text style={styles.modalSecondaryText}>Close</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.modalPrimaryButton}
    onPress={saveEditedClub}
  >
    <Text style={styles.modalPrimaryText}>Save</Text>
  </TouchableOpacity>
</View>
         </View>
    </ScrollView>
  </KeyboardAvoidingView>
</Modal>

<Modal
  visible={manageVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setManageVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
        <ScrollView
  contentContainerStyle={{ paddingBottom: 24 }}
  showsVerticalScrollIndicator={false}
>
      <Text style={styles.modalTitle}>Manage Club</Text>

      <Text style={styles.modalLabel}>Pending Requests</Text>

      {pendingRequests.length > 0 ? (
        pendingRequests.map((person, index) => (
          <View key={`${person.id}-${index}`} style={styles.memberRow}>
  <View style={styles.memberTopRow}>
    <View style={styles.memberInfo}>
      <Text style={styles.memberName}>
        {person.displayName || "Reader"}
      </Text>
      <Text style={styles.memberUsername}>
        {person.username || "@reader"}
      </Text>
    </View>
  </View>

  <View style={styles.memberActions}>
    <TouchableOpacity
      style={styles.approveButton}
      onPress={() => approveRequest(person.id)}
    >
      <Text style={styles.memberActionText}>Approve</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.declineButton}
      onPress={() => declineRequest(person.id)}
    >
      <Text style={styles.memberActionText}>Decline</Text>
    </TouchableOpacity>
  </View>
</View>
        ))
      ) : (
        <Text style={styles.emptyManageText}>No pending requests.</Text>
      )}
<View
  style={{
    height: 1,
    backgroundColor: "rgba(122,81,55,0.16)",
    marginVertical: 18,
  }}
/>

<Text style={styles.modalLabel}>Members</Text>

{uniqueMembers.map((member: any) => {
  const isHost =
    member.role === "host" || member.id === CURRENT_USER.id;

  return (
    <View key={member.id} style={styles.memberRow}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {isHost ? "👑 " : ""}
          {member.displayName || "Reader"}
        </Text>

        <Text style={styles.memberUsername}>
          {member.username || "@reader"}
        </Text>
      </View>

      {!isHost && (
        <TouchableOpacity
          style={styles.memberTrashButton}
          onPress={() => removeMember(member.id)}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color="#7a5137"
          />
        </TouchableOpacity>
      )}
    </View>
  );
})}
      <TouchableOpacity
  style={styles.manageCloseButton}
  onPress={() => setManageVisible(false)}
>
  <Text style={styles.manageCloseText}>Close</Text>
</TouchableOpacity>
    </ScrollView>
  </View>
  </View>
</Modal>

<Modal
  visible={bookSearchVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setBookSearchVisible(false)}
>
  <KeyboardAvoidingView
  style={styles.modalOverlay}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <ScrollView
    contentContainerStyle={styles.modalScrollContent}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.bookSearchModalCard}>
      <Text style={styles.modalTitle}>Choose Current Read</Text>

      <View style={styles.bookSearchRow}>
        <TextInput
          value={bookSearchText}
          onChangeText={setBookSearchText}
          placeholder="Search by title or author"
          placeholderTextColor="#8a7d74"
          style={styles.bookSearchInput}
          onSubmitEditing={searchBooks}
        />

        <TouchableOpacity
  style={styles.bookSearchButton}
  onPress={searchBooks}
  activeOpacity={0.8}
>
          <Ionicons name="search" size={18} color="#fffaf3" />
        </TouchableOpacity>
      </View>

     <ScrollView
  style={styles.bookResultsList}
  contentContainerStyle={styles.bookResultsContent}
  keyboardShouldPersistTaps="handled"
>
    {bookSearchResults.length === 0 && (
  <Text style={styles.noResultsText}>
    Search results will appear here.
  </Text>
)}
        {bookSearchResults.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={styles.bookResultRow}
            onPress={() => chooseBook(book)}
          >
            {book.coverUrl ? (
              <Image
                source={{ uri: book.coverUrl }}
                style={styles.bookResultCover}
              />
            ) : (
              <View style={styles.bookResultCoverPlaceholder}>
                <Text>📖</Text>
              </View>
            )}

            <View style={styles.bookResultInfo}>
              <Text style={styles.bookResultTitle}>{book.title}</Text>
              {!!book.author && (
                <Text style={styles.bookResultAuthor}>{book.author}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.modalSecondaryButton}
        onPress={() => {
  setBookSearchVisible(false);
  setTimeout(() => {
    setEditVisible(true);
  }, 250);
}}
      >
        <Text style={styles.modalSecondaryText}>Cancel</Text>
      </TouchableOpacity>
        </View>
  </ScrollView>
</KeyboardAvoidingView>
</Modal> 
        </KeyboardAvoidingView>
  </ImageBackground>
);
}

function MessageBubble({
  message,
  isReactionPickerOpen,
  onToggleReactionPicker,
  onEdit,
  onDelete,
  onReact,
}: {
  message: any;
  isReactionPickerOpen: boolean;
  onToggleReactionPicker: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReact: (emoji: string) => void;
}) {

  const {
  user,
  userId,
  displayName,
  username,
  time,
  text,
  spoiler,
  chapter,
  reactions,
} = message;

const shownName = displayName || user || "Reader";
const shownUsername = username || "";
  const reactionCounts = Object.values(reactions || {}).reduce(
  (acc: Record<string, number>, emoji: any) => {
    acc[emoji] = (acc[emoji] || 0) + 1;
    return acc;
  },
  {}
);

const hasReactions = Object.keys(reactionCounts).length > 0;
  const isOwnComment = userId === CURRENT_USER.id;
  const [revealed, setRevealed] = useState(false);
  const shouldHideSpoiler = spoiler && !revealed;

  return (
    <View style={styles.messageBubble}>
      <View style={styles.messageHeader}>
        <View>
  <Text style={styles.username}>{shownName}</Text>
  {!!shownUsername && (
    <Text style={styles.messageUsernameHandle}>{shownUsername}</Text>
  )}
</View>
        <View style={styles.messageHeaderRight}>
  <Text style={styles.timestamp}>{time}</Text>

  {isOwnComment && (
    <TouchableOpacity
      style={styles.messageOptionsButton}
      onPress={() => {
        Alert.alert("Comment options", "Manage your comment", [
          { text: "Edit", onPress: onEdit },
          { text: "Delete", style: "destructive", onPress: onDelete },
          { text: "Cancel", style: "cancel" },
        ]);
      }}
    >
      <Ionicons name="ellipsis-horizontal" size={18} color="#8a7d74" />
    </TouchableOpacity>
  )}
</View>
      </View>

      {spoiler && (
        <View style={styles.spoilerTag}>
          <Text style={styles.spoilerText}>Spoilers from Chapter {chapter}</Text>
        </View>
      )}

      {shouldHideSpoiler ? (
        <TouchableOpacity
          style={styles.hiddenSpoilerBox}
          onPress={() => setRevealed(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.hiddenSpoilerText}>Tap to reveal spoiler</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.messageText}>{text}</Text>
      )}

      {message.edited && <Text style={styles.editedText}>edited</Text>}

      <View style={styles.messageFooter}>
  <TouchableOpacity
    style={styles.reactButton}
    onPress={onToggleReactionPicker}
    activeOpacity={0.8}
  >
    <Text style={styles.reactButtonText}>React</Text>
  </TouchableOpacity>

  {hasReactions && (
    <View style={styles.reactionSummaryRow}>
      {Object.entries(reactionCounts).map(([emoji, count]) => (
        <Text key={emoji} style={styles.reactionSummaryText}>
          {emoji} {count}
        </Text>
      ))}
    </View>
  )}
</View>

{isReactionPickerOpen && (
  <View style={styles.reactionPopup}>
    {["❤️", "🔥", "😂", "😭", "😱"].map((emoji) => (
      <TouchableOpacity
        key={emoji}
        style={styles.reactionPopupBubble}
        onPress={() => onReact(emoji)}
        activeOpacity={0.8}
      >
        <Text style={styles.reactionPopupEmoji}>{emoji}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
    background: {
  flex: 1,
},

backgroundImage: {
  resizeMode: "cover",
  opacity: 0.8
},
  screen: {
  flex: 1,
  backgroundColor: "rgba(246,239,229,0.18)",
},
  content: {
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  iconButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,250,243,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
  backgroundColor: "rgba(255, 250, 243, 0.7)",
  borderRadius: 32,
  padding: 20,
  marginBottom: 18,
},
heroRow: {
  flexDirection: "row",
  alignItems: "flex-start",
},

heroInfo: {
  flex: 1,
  marginLeft: 18,
},
  bookCover: {
    width: 120,
    height: 200,
    borderRadius: 18,
    backgroundColor: "#d8cec0",
    alignItems: "center",
    justifyContent: "center",
  },
  bookEmoji: {
    fontSize: 48,
  },
  clubName: {
    fontSize: 30,
    color: "#514841",
    fontFamily: FONT_HEAD,
    textAlign: "left",
  },
  members: {
    fontSize: 15,
    color: "#7a6f67",
    marginTop: 4,
  },
  currentReadLabel: {
    marginTop: 18,
    fontSize: 12,
    color: "#8a7d74",
    letterSpacing: 1.5,
    fontWeight: "500",
  },
  bookTitle: {
    fontSize: 20,
    color: "#514841",
    marginTop: 8,
    fontWeight: "500",
  },
  author: {
    fontSize: 16,
    color: "#7a6f67",
    marginTop: 4,
  },
  discussionCard: {
  backgroundColor: "rgba(255,250,243,0.7)",
    borderRadius: 32,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#514841",
    fontFamily: FONT_HEAD,
    marginBottom: 16,
  },
  messageBubble: {
  backgroundColor: "rgba(236,224,210,0.99)",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  username: {
    fontWeight: "600",
    color: "#514841",
  },
  timestamp: {
    fontSize: 12,
    color: "#8a7d74",
  },
  spoilerTag: {
    alignSelf: "flex-start",
    backgroundColor: "#e9d8c5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },
  spoilerText: {
    fontSize: 12,
    color: "#6f655d",
    fontWeight: "500",
  },
  messageText: {
    color: "#514841",
    lineHeight: 22,
  },
  hiddenSpoilerBox: {
    backgroundColor: "#d8c0a8",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  hiddenSpoilerText: {
    color: "#514841",
    fontWeight: "500",
    textAlign: "center",
  },
  editedText: {
    marginTop: 6,
    fontSize: 11,
    color: "#8a7d74",
    fontStyle: "italic",
  },
  emptyDiscussionText: {
    color: "#6F655D",
    fontSize: 16,
    lineHeight: 22,
  },
  composerWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 62,
    backgroundColor: "rgba(246,239,229,0.9)",
  },
  spoilerButton: {
  backgroundColor: "rgba(255,250,243,0.96)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginLeft: 6,
    marginRight: -6,
  },
  spoilerButtonActive: {
    backgroundColor: "#d8c0a8",
  },
  spoilerButtonText: {
    color: "#514841",
    fontWeight: "500",
  },
  input: {
  flex: 1,
  minWidth: 0,
  backgroundColor: "rgba(255,250,243,0.95)",
  borderRadius: 999,
  paddingHorizontal: 18,
  paddingVertical: 14,
  color: "#514841",
},
  sendButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "#6b625a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginLeft: -6,
  },
  chapterWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#f6efe5",
  },
  chapterInput: {
    backgroundColor: "rgba(255,250,243,0.95)",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#514841",
  },
  clubDescription: {
  marginTop: 14,
  fontSize: 14,
  lineHeight: 22,
  color: "#6f655d",
  textAlign: "left",
},

topBarActions: {
  flexDirection: "row",
  gap: 8,
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(44,32,24,0.35)",
  justifyContent: "center",
  paddingHorizontal: 20,
},

modalCard: {
  backgroundColor: "#fffaf3",
  borderRadius: 28,
  padding: 20,
},

modalTitle: {
  fontSize: 30,
  color: "#514841",
  fontFamily: FONT_HEAD,
  textAlign: "center",
  marginBottom: 18,
},

modalInput: {
  backgroundColor: "#f6efe5",
  borderRadius: 18,
  paddingHorizontal: 16,
  paddingVertical: 14,
  marginBottom: 12,
  color: "#514841",
},

modalActions: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 8,
},

modalSecondaryButton: {
  flex: 1,
  marginRight: 8,
  backgroundColor: "#efe1cf",
  borderRadius: 18,
  paddingVertical: 14,
  alignItems: "center",
},

modalPrimaryButton: {
  flex: 1,
  marginLeft: 8,
  backgroundColor: "#7a5137",
  borderRadius: 18,
  paddingVertical: 14,
  alignItems: "center",
},

modalSecondaryText: {
  color: "#514841",
  fontWeight: "600",
},

modalPrimaryText: {
  color: "#fffaf3",
  fontWeight: "600",
},

modalLabel: {
  fontSize: 14,
  color: "#6f655d",
  marginBottom: 6,
  marginLeft: 4,
  fontWeight: "600",
},

chooseBookButton: {
  backgroundColor: "#efe1cf",
  borderRadius: 18,
  paddingVertical: 13,
  alignItems: "center",
  marginBottom: 12,
},

chooseBookButtonText: {
  color: "#514841",
  fontWeight: "600",
},

selectedBookPreview: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f6efe5",
  borderRadius: 18,
  padding: 10,
  marginBottom: 12,
},

selectedBookCover: {
  width: 46,
  height: 68,
  borderRadius: 8,
  marginRight: 12,
},

selectedBookInfo: {
  flex: 1,
},

selectedBookTitle: {
  color: "#514841",
  fontWeight: "600",
  fontSize: 15,
},

selectedBookAuthor: {
  color: "#7a6f67",
  fontSize: 13,
  marginTop: 3,
},

bookSearchRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginBottom: 12,
},

bookSearchInput: {
  flex: 1,
  backgroundColor: "#f6efe5",
  borderRadius: 18,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: "#514841",
},

bookSearchButton: {
  height: 46,
  width: 46,
  borderRadius: 23,
  backgroundColor: "#7a5137",
  alignItems: "center",
  justifyContent: "center",
},

bookResultRow: {
  flexDirection: "row",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "rgba(81,72,65,0.1)",
},

bookResultCover: {
  width: 44,
  height: 66,
  borderRadius: 7,
  marginRight: 12,
},

bookResultCoverPlaceholder: {
  width: 44,
  height: 66,
  borderRadius: 7,
  marginRight: 12,
  backgroundColor: "#e7dccd",
  alignItems: "center",
  justifyContent: "center",
},

bookResultInfo: {
  flex: 1,
  justifyContent: "center",
},

bookResultTitle: {
  color: "#514841",
  fontWeight: "600",
  fontSize: 15,
},

bookResultAuthor: {
  color: "#7a6f67",
  fontSize: 13,
  marginTop: 3,
},
modalScrollContent: {
  flexGrow: 1,
  justifyContent: "center",
  paddingHorizontal: 20,
  paddingVertical: 40,
},
bookSearchModalCard: {
  backgroundColor: "#fffaf3",
  borderRadius: 28,
  padding: 20,
  width: "100%",
  maxHeight: "82%",
},

bookResultsList: {
  flexGrow: 0,
  maxHeight: 360,
  marginBottom: 12,
},

bookResultsContent: {
  paddingBottom: 8,
},

noResultsText: {
  color: "#7a6f67",
  textAlign: "center",
  paddingVertical: 20,
},
bookCoverImage: {
  width: "100%",
  height: "100%",
  borderRadius: 16,
},
reactionRow: {
  flexDirection: "row",
  marginTop: 10,
  gap: 6,
},

reactionEmoji: {
  fontSize: 18,
},
messageHeaderRight: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},

messageOptionsButton: {
  paddingHorizontal: 4,
  paddingVertical: 2,
},

reactionPickerRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 7,
  marginTop: 12,
},

reactionBubble: {
  height: 30,
  width: 30,
  borderRadius: 15,
  backgroundColor: "rgba(255,250,243,0.92)",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "rgba(81,72,65,0.08)",
},

reactionBubbleText: {
  fontSize: 16,
},

reactionSummaryEmoji: {
  fontSize: 15,
},
messageFooter: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 12,
},

reactButton: {
  backgroundColor: "rgba(255,250,243,0.85)",
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 6,
},

reactButtonText: {
  color: "#6f655d",
  fontSize: 13,
  fontWeight: "600",
},

reactionSummaryRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

reactionSummaryText: {
  color: "#6f655d",
  fontSize: 13,
  fontWeight: "600",
},

reactionPopup: {
  flexDirection: "row",
  alignSelf: "flex-start",
  gap: 8,
  backgroundColor: "rgba(255,250,243,0.96)",
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 8,
  marginTop: 8,
  borderWidth: 1,
  borderColor: "rgba(81,72,65,0.08)",
},

reactionPopupBubble: {
  height: 34,
  width: 34,
  borderRadius: 17,
  alignItems: "center",
  justifyContent: "center",
},

reactionPopupEmoji: {
  fontSize: 20,
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
messageUsernameHandle: {
  fontSize: 11,
  color: "#8a7d74",
  marginTop: 1,
},
memberRow: {
  backgroundColor: "#f6efe5",
  borderRadius: 16,
  padding: 12,
  marginBottom: 10,
},

memberName: {
  color: "#514841",
  fontWeight: "700",
},

memberUsername: {
  color: "#8a7d74",
  fontSize: 12,
  marginTop: 2,
},

emptyManageText: {
  color: "#7a6f67",
  marginBottom: 16,
},
memberInfo: {
  flex: 1,
},
memberTrashButton: {
  height: 34,
  width: 34,
  borderRadius: 17,
  backgroundColor: "rgba(122,81,55,0.10)",
  alignItems: "center",
  justifyContent: "center",
},
memberActions: {
  flexDirection: "row",
  gap: 8,
  marginTop: 12,
},

approveButton: {
  backgroundColor: "#7a5137",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

declineButton: {
  backgroundColor: "#8a7d74",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

memberActionText: {
  color: "#fffaf3",
  fontSize: 12,
  fontWeight: "700",
},
manageCloseButton: {
  backgroundColor: "rgba(122,81,55,0.92)",
  borderRadius: 18,
  paddingVertical: 16,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 18,
},
memberTopRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
manageCloseText: {
  color: "#fffaf3",
  fontSize: 16,
  fontFamily: FONT_HEAD,
  letterSpacing: 0.4,
},
});