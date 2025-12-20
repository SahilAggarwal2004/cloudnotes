import { newNotePrefix, newNotesKey } from "../constants";
import { getStorage, removeStorage, setStorage } from "./storage";

export function deleteLocalNote(noteId) {
  if (isNewNote(noteId)) setStorage(newNotesKey, (prev) => prev.filter((_id) => _id !== noteId));
  removeStorage(`local-${noteId}`);
  removeStorage(`upsert-${noteId}`, false);
}

export function hasActiveDraft(noteId) {
  return getStorage(`upsert-${noteId}`, {}, false).flag;
}

export function isNewNote(noteId) {
  return noteId.startsWith(newNotePrefix);
}
