import { useState } from "react";
import { getStorage, setStorage } from "../lib/storage";

export default function useStorage(key, initialState, local = true) {
  const [storedValue, setStoredValue] = useState(() => {
    const initialValue = typeof initialState === "function" ? initialState() : initialState;
    if (typeof window === "undefined") return initialValue;
    return getStorage(key, initialValue, local);
  });
  const clearValue = () => setValue(initialState);

  function setValue(value) {
    setStoredValue((old) => {
      const updatedValue = typeof value === "function" ? value(old) : value;
      setStorage(key, updatedValue, local);
      return updatedValue;
    });
  }

  return [storedValue, setValue, clearValue];
}
