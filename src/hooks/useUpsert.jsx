import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import useStorage from "./useStorage";
import { useNoteContext } from "../contexts/NoteProvider";
import { defaultColor, queryKey } from "../constants";
import { getStorage, removeStorage, setStorage } from "../modules/storage";

export default function useUpsert({ _id, title, description, tag }) {
  const client = useQueryClient();
  const router = useRouter();
  const { fetchApp, getTagColor, lastSyncedAt, setNewNote, setProgress, setTagColor } = useNoteContext();
  const newNote = _id === "new";
  const [upsertState, setUpsertState, clearUpsertState] = useStorage(`upsert${_id}`, { flag: newNote, description: "", tagColor: defaultColor }, false);

  const updateUpsertState = (obj) =>
    setUpsertState((prev) => {
      if (obj.tag) obj.tagColor = getTagColor(obj.tag);
      return { ...prev, ...obj };
    });
  const cancelUpsert = (ignoreNewNote = false) => {
    if (newNote) {
      if (ignoreNewNote) return;
      setNewNote(false);
    }
    clearUpsertState();
  };

  async function handleUpsert({ save, sync, force }) {
    const upsertTag = upsertState.tag || "General";
    const editKey = `edit${_id}`;
    if (save) {
      setStorage(editKey, {
        title: upsertState.title,
        description: upsertState.description,
        tag: upsertTag,
        updatedAt: upsertState.updatedAt,
        localUpdatedAt: new Date().toISOString(),
      });
      setTagColor(upsertTag, upsertState.tagColor);
    }
    if (sync) {
      const editState = getStorage(editKey);
      if (title === editState.title && description === editState.description && tag === editState.tag) setProgress(100);
      else {
        const { success, status, updatedAt } = await fetchApp({
          url: newNote ? "api/notes/add" : `api/notes/update/${_id}${force ? "?force=true" : ""}`,
          method: newNote ? "POST" : "PUT",
          body: editState,
        });
        if (!success) {
          if (status === 409) {
            if (Date.parse(updatedAt) > lastSyncedAt) await client.refetchQueries({ queryKey });
            router.push(`/note/${_id}?conflict=true`);
          }
          return;
        }
      }
      removeStorage(editKey);
    }
    cancelUpsert();
  }

  return { upsertState, updateUpsertState, cancelUpsert, handleUpsert };
}
