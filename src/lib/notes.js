import { newNotePrefix, newNotesKey } from "../constants";
import { getStorage, removeStorage, setStorage } from "./storage";

export function deleteLocalNote(id) {
  if (isNewNote(id)) setStorage(newNotesKey, (prev) => prev.filter((_id) => _id !== id));
  removeStorage(`local-${id}`);
  removeStorage(`upsert-${id}`, false);
}

export function hasActiveDraft(id) {
  return getStorage(`upsert-${id}`, {}, false).flag;
}

export function isNewNote(id) {
  return id.startsWith(newNotePrefix);
}
