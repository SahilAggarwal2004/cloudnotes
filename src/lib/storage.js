const listeners = new Map();

const getNamespacedKey = (key, local = true) => `${local ? "local" : "session"}:${key}`;

function publish(key, local, value) {
  const callbacks = listeners.get(getNamespacedKey(key, local));
  if (callbacks) callbacks.forEach((callback) => callback(value));
}

const getStorageInstance = (local = true) => (local ? localStorage : sessionStorage);

export const setStorage = (key, value, local = true) => {
  if (typeof value === "function") value = value(getStorage(key, undefined, local));
  getStorageInstance(local).setItem(key, JSON.stringify(value));
  publish(key, local, value);
};

export const removeStorage = (key, local = true) => {
  getStorageInstance(local).removeItem(key);
  publish(key, local);
};

export function clearStorage(prefix = "", local = true) {
  const storage = getStorageInstance(local);
  const keysToRemove = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key.startsWith(prefix)) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => removeStorage(key, local));
}

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

export function subscribeToStorage(key, local, callback) {
  key = getNamespacedKey(key, local);
  if (!listeners.has(key)) listeners.set(key, new Set());
  const set = listeners.get(key);
  set.add(callback);

  return () => {
    set.delete(callback);
    if (set.size === 0) listeners.delete(key);
  };
}
