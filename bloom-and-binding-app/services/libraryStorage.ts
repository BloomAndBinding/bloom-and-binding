import AsyncStorage from "@react-native-async-storage/async-storage";
const YEARLY_GOAL_KEY = "yearly_reading_goal";
const LIBRARY_KEY = "my_library_books";
const SELECTED_AVATAR_KEY = "selected_avatar_key";
export type SavedBook = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  formats: string[];
  rating?: number;
  quickNotes?: string;
  notes?: string[];
    status?: string;

  addedAt?: string;
  startedAt?: string;
  finishedAt?: string;

  progressType?: "percentage" | "page";
  progressValue?: string;
};

export async function saveBook(book: SavedBook) {
  try {
    const existing = await AsyncStorage.getItem(LIBRARY_KEY);
    const books: SavedBook[] = existing ? JSON.parse(existing) : [];

        books.push({
      ...book,
      addedAt: book.addedAt ?? new Date().toISOString(),
    });

    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(books));
  } catch (error) {
    console.error("Failed to save book:", error);
  }
}

export async function getSavedBooks(): Promise<SavedBook[]> {
  try {
    const existing = await AsyncStorage.getItem(LIBRARY_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error("Failed to load books:", error);
    return [];
  }
}

export async function updateSavedBook(updatedBook: SavedBook) {
  try {
    const existing = await AsyncStorage.getItem(LIBRARY_KEY);
    const books: SavedBook[] = existing ? JSON.parse(existing) : [];

    const updatedBooks = books.map((book) =>
      book.id === updatedBook.id ? updatedBook : book
    );

    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedBooks));
  } catch (error) {
    console.error("Failed to update book:", error);
  }
}

export async function deleteSavedBook(bookId: string) {
  try {
    const existing = await AsyncStorage.getItem(LIBRARY_KEY);
    const books: SavedBook[] = existing ? JSON.parse(existing) : [];

    const filteredBooks = books.filter((book) => book.id !== bookId);

    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(filteredBooks));
  } catch (error) {
    console.error("Failed to delete book:", error);
  }
}
export async function saveReadingGoal(goal: number) {
  try {
    const savedGoal = await AsyncStorage.getItem(YEARLY_GOAL_KEY);
    return savedGoal ? Number(savedGoal) : 24;
  } catch (error) {
    console.error("Failed to load yearly goal:", error);
    return 24;
  }
}

export async function saveYearlyGoal(goal: number) {
  try {
    await AsyncStorage.setItem(YEARLY_GOAL_KEY, String(goal));
  } catch (error) {
    console.error("Failed to save yearly goal:", error);
  }
}

export async function getYearlyGoal(): Promise<number> {
  try {
    const savedGoal = await AsyncStorage.getItem(YEARLY_GOAL_KEY);
    return savedGoal ? Number(savedGoal) : 24;
  } catch (error) {
    console.error("Failed to load yearly goal:", error);
    return 24;
  }
}

export async function getSelectedAvatarKey(): Promise<string> {
  try {
    const savedAvatar = await AsyncStorage.getItem(SELECTED_AVATAR_KEY);
    return savedAvatar || "fae-dreamer";
  } catch (error) {
    console.error("Failed to load selected avatar:", error);
    return "fae-dreamer";
  }
}

export async function saveSelectedAvatarKey(avatarKey: string) {
  try {
    await AsyncStorage.setItem(SELECTED_AVATAR_KEY, avatarKey);
  } catch (error) {
    console.error("Failed to save selected avatar:", error);
  }
}
