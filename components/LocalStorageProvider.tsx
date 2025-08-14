"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type LocalStorageContextType = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  isReady: boolean;
};

const LocalStorageContext = createContext<LocalStorageContextType>({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  isReady: false,
});

export function useLocalStorage() {
  return useContext(LocalStorageContext);
}

export default function LocalStorageProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set isReady to true once we're in the browser
    setIsReady(true);
  }, []);

  const getItem = (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  };

  const setItem = (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  };

  const removeItem = (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  };

  return (
    <LocalStorageContext.Provider value={{ getItem, setItem, removeItem, isReady }}>
      {children}
    </LocalStorageContext.Provider>
  );
} 