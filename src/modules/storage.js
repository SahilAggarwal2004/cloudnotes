import { queryKey } from "../constants";

export const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const removeStorage = (key) => localStorage.removeItem(key);

export const getStorage = (key, fallbackValue) => {
  if (typeof localStorage === "undefined") return fallbackValue;
  let value = localStorage.getItem(key);
  try {
    if (!value) throw new Error("Value doesn't exist");
    value = JSON.parse(value);
  } catch {
    if (fallbackValue !== undefined) {
      value = fallbackValue;
      setStorage(key, value);
    } else {
      value = null;
      removeStorage(key);
    }
  }
  return value;
};

export const resetStorage = () => {
  removeStorage("name");
  removeStorage("token");
  removeStorage(queryKey);
};
