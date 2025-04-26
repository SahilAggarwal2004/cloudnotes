import { useEffect } from "react";
import useStorage from "./useStorage";
import { useNoteContext } from "../contexts/NoteProvider";
import { defaultColor } from "../constants";

export default function useUpsert({ _id, title, description = "", tag, updatedAt }) {
  const { fetchApp, getTagColor, setNewNote, setProgress, setTagColor } = useNoteContext();
  const newNote = _id === "new";
  const getInitialState = () => ({ flag: newNote, description, tagColor: defaultColor });
  const [upsertState, setUpsertState] = useStorage("upsert" + _id, getInitialState, false);

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
    setUpsertState(getInitialState);
  };

  async function handleUpsert(event) {
    event.preventDefault();
    const upsertTag = upsertState.tag || "General";
    if (title === upsertState.title && description === upsertState.description && tag === upsertState.tag) setProgress(100);
    else
      var { success } = await fetchApp({
        url: newNote ? "api/notes/add" : `api/notes/update/${_id}`,
        method: newNote ? "POST" : "PUT",
        body: { title: upsertState.title, description: upsertState.description, tag: upsertTag, lastUpdatedAt: updatedAt },
      });
    if (success === false) return;
    cancelUpsert();
    setTagColor(upsertTag, upsertState.tagColor);
  }

  useEffect(() => {
    if (upsertState.flag) {
      const cancelEdit = () => cancelUpsert(true);
      window.addEventListener("beforeunload", cancelEdit);
      return () => {
        cancelEdit();
        window.removeEventListener("beforeunload", cancelEdit);
      };
    }
  }, [upsertState.flag]);

  return { upsertState, updateUpsertState, cancelUpsert, handleUpsert };
}
