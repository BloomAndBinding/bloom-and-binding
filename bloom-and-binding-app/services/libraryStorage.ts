import AsyncStorage from "@react-native-async-storage/async-storage";

const LIBRARY_KEY = "my_library_books";

export type SavedBook = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  formats: string[];
  quickNotes?: string;
  notes?: string[];
  status?: string;
  progressType?: "percentage" | "page";
    progressValue?: string;
};

export async function saveBook(book: SavedBook) {
  try {
    const existing = await AsyncStorage.getItem(LIBRARY_KEY);
    const books: SavedBook[] = existing ? JSON.parse(existing) : [];

    books.push(book);

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