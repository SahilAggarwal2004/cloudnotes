import { useEffect, useState } from "react";
import { getStorage, subscribeToStorage } from "../lib/storage";

export function useStorageListener(key, initialState, local = true) {
  const [value, setValue] = useState(() => {
    const initialValue = typeof initialState === "function" ? initialState() : initialState;
    if (typeof window === "undefined") return initialValue;
    return getStorage(key, initialValue, local);
  });

  useEffect(() => {
    const unsubscribe = subscribeToStorage(key, local, setValue);
    return unsubscribe;
  }, [key, local]);

  return value;
}
