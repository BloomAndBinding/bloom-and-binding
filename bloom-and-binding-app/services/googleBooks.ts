export type GoogleBookResult = {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  coverUrl?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  isbn10?: string;
  isbn13?: string;
};

const GOOGLE_BOOKS_API_KEY = "AIzaSyD652FEDWqB_PbUHtM-U9FxNSiLmLwQOo0";

function getBestCoverUrl(imageLinks: any): string | undefined {
  if (!imageLinks) return undefined;

  return (
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail
  )?.replace("http://", "https://");
}

export async function searchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
  if (!query.trim()) return [];

  const cleanQuery = query.trim();

  const url =
    "https://www.googleapis.com/books/v1/volumes?q=" +
    encodeURIComponent(`intitle:${cleanQuery}`) +
    "&printType=books" +
    "&orderBy=relevance" +
    "&maxResults=20" +
    "&key=" +
    GOOGLE_BOOKS_API_KEY;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("Google response status:", response.status);
    console.log("Google Books results:", data.items?.length ?? 0);

    if (!response.ok) {
      console.log("Google Books error:", data);
      return [];
    }

    return (data.items ?? []).map((item: any) => {
      const info = item.volumeInfo ?? {};
      const identifiers = info.industryIdentifiers ?? [];

      const isbn10 = identifiers.find((id: any) => id.type === "ISBN_10")?.identifier;
      const isbn13 = identifiers.find((id: any) => id.type === "ISBN_13")?.identifier;

      return {
        id: item.id,
        title: info.title ?? "Untitled",
        authors: info.authors ?? ["Unknown author"],
        description: info.description,
        coverUrl: getBestCoverUrl(info.imageLinks),
        publishedDate: info.publishedDate,
        pageCount: info.pageCount,
        categories: info.categories ?? [],
        isbn10,
        isbn13,
      };
    });
  } catch (error) {
    console.log("Search failed:", error);
    return [];
  }
}
export async function searchGoogleBooksByIsbn(
  isbn: string
): Promise<GoogleBookResult[]> {
  if (!isbn.trim()) return [];

  const url =
    "https://www.googleapis.com/books/v1/volumes?q=" +
    encodeURIComponent(`isbn:${isbn.trim()}`) +
    "&printType=books" +
    "&maxResults=5" +
    "&key=" +
    GOOGLE_BOOKS_API_KEY;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("ISBN searched:", isbn);
    console.log("ISBN results:", data.items?.length ?? 0);

    if (!response.ok) {
      console.log("Google Books ISBN error:", data);
      return [];
    }

    return (data.items ?? []).map((item: any) => {
      const info = item.volumeInfo ?? {};
      const identifiers = info.industryIdentifiers ?? [];

      const isbn10 = identifiers.find((id: any) => id.type === "ISBN_10")?.identifier;
      const isbn13 = identifiers.find((id: any) => id.type === "ISBN_13")?.identifier;

      return {
        id: item.id,
        title: info.title ?? "Untitled",
        authors: info.authors ?? ["Unknown author"],
        description: info.description,
        coverUrl: getBestCoverUrl(info.imageLinks),
        publishedDate: info.publishedDate,
        pageCount: info.pageCount,
        categories: info.categories ?? [],
        isbn10,
        isbn13,
      };
    });
  } catch (error) {
    console.log("ISBN search failed:", error);
    return [];
  }
}