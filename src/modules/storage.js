const getStorageInstance = (local = true) => (local ? localStorage : sessionStorage);

export const setStorage = (key, value, local = true) => getStorageInstance(local).setItem(key, JSON.stringify(value));

export const removeStorage = (key, local = true) => getStorageInstance(local).removeItem(key);

export const getStorage = (key, fallbackValue, local = true) => {
  if (typeof window === "undefined") return fallbackValue;
  const value = getStorageInstance(local).getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch {
      removeStorage(key, local); // Remove corrupted data
    }
  }
  if (fallbackValue !== null && fallbackValue !== undefined) setStorage(key, fallbackValue, local);
  return fallbackValue;
};

export function clearSessionStorage(prefix = "") {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key.startsWith(prefix)) removeStorage(key, false);
  }
}
