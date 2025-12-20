import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import useStorage from "./useStorage";
import { useNoteContext } from "../contexts/NoteProvider";
import { defaults, queryKey } from "../constants";
import { deleteLocalNote, isNewNote } from "../lib/notes";
import { getStorage, setStorage } from "../lib/storage";

const { color: defaultColor, description: defaultDescription, tag: defaultTag } = defaults;

export default function useUpsert({ _id, title, description, tag }) {
  const client = useQueryClient();
  const router = useRouter();
  const { fetchApp, getTagColor, lastSyncedAt, setProgress, setTagColor } = useNoteContext();
  const [upsertState, setUpsertState, clearUpsertState] = useStorage(`upsert-${_id}`, { flag: false, description: defaultDescription, tagColor: defaultColor }, false);

  const updateUpsertState = (obj) =>
    setUpsertState((prev) => {
      if (obj.tag) obj.tagColor = getTagColor(obj.tag);
      return { ...prev, ...obj };
    });
  const cancelUpsert = () => clearUpsertState();

  async function handleUpsert({ save, sync, force }) {
    const upsertTag = upsertState.tag || defaultTag;
    const localKey = `local-${_id}`;
    if (save) {
      setStorage(localKey, {
        _id,
        title: upsertState.title,
        description: upsertState.description,
        tag: upsertTag,
        updatedAt: upsertState.updatedAt,
        localUpdatedAt: new Date().toISOString(),
      });
      setTagColor(upsertTag, upsertState.tagColor);
    }
    if (sync) {
      const newNote = isNewNote(_id);
      const localState = getStorage(localKey);
      if (title === localState.title && description === localState.description && tag === localState.tag) {
        deleteLocalNote(_id);
        setProgress(100);
      } else {
        const { success, status, updatedAt } = await fetchApp({
          url: newNote ? "api/notes/add/bulk" : `api/notes/update/${_id}${force ? "?force=true" : ""}`,
          method: newNote ? "POST" : "PUT",
          body: newNote ? { notes: [localState] } : localState,
          onSuccess: () => deleteLocalNote(_id),
        });
        if (!success) {
          if (status === 409) {
            if (Date.parse(updatedAt) > lastSyncedAt) await client.refetchQueries({ queryKey });
            router.push(`/note/${_id}?conflict=true`);
          }
          return;
        }
      }
    }
    cancelUpsert();
  }

  return { upsertState, updateUpsertState, cancelUpsert, handleUpsert };
}
