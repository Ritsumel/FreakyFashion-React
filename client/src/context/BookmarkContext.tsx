import { createContext, useContext, useEffect, useState } from 'react';

type BookmarkContextType = {
  bookmarked: Set<number>;
  toggleBookmark: (id: number) => void;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'freaky-fashion-bookmarks';

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
    const [bookmarked, setBookmarked] = useState<Set<number>>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return new Set();
        return new Set<number>(JSON.parse(stored));
    });

  // Save to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(bookmarked))
    );
  }, [bookmarked]);

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });
    };

  return (
    <BookmarkContext.Provider value={{ bookmarked, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) {
    throw new Error('useBookmarks must be used inside BookmarkProvider');
  }
  return ctx;
};
