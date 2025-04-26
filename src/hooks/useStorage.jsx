import { useState } from "react";
import { getStorage, removeStorage, setStorage } from "../modules/storage";

export default function useStorage(key, initialValue, local = true) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof initialValue === "function") initialValue = initialValue();
    if (typeof window === "undefined") return initialValue;
    return getStorage(key, initialValue, local);
  });
  function setValue(value) {
    setStoredValue((old) => {
      const updatedValue = typeof value === "function" ? value(old) : value;
      setStorage(key, updatedValue, local);
      return updatedValue;
    });
  }

  function clearValue() {
    removeStorage(key, local);
    setStoredValue(initialValue);
  }

  return [storedValue, setValue, clearValue];
}
