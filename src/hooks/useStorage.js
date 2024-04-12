import { useState } from "react";
import { getStorage, setStorage } from "../modules/storage";

export default function useStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    return getStorage(key, initialValue, false);
  });

  const setValue = (value) => {
    setStoredValue((old) => {
      const updatedValue = typeof value === "function" ? value(old) : value;
      setStorage(key, updatedValue, false);
      return updatedValue;
    });
  };
  return [storedValue, setValue];
}
