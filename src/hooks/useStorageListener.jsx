import { useEffect, useState } from "react";
import { getStorage, subscribeToStorage } from "../modules/storage";

export function useStorageListener(key, initialValue, local = true) {
  const [value, setValue] = useState(() => {
    if (typeof initialValue === "function") initialValue = initialValue();
    if (typeof window === "undefined") return initialValue;
    return getStorage(key, initialValue, local);
  });

  useEffect(() => {
    const unsubscribe = subscribeToStorage(key, local, setValue);
    return unsubscribe;
  }, [key, local]);

  return value;
}
