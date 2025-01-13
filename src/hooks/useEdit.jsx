import { useEffect } from "react";
import useStorage from "./useStorage";
import { useNoteContext } from "../contexts/NoteProvider";

export default function useEdit({ _id, title, description, tag, updatedAt }) {
  const { fetchApp, setProgress, getTagColor, setTagColor } = useNoteContext();
  const [edit, setEdit] = useStorage("edit" + _id, false);

  const handleEdit = (obj) =>
    setEdit((prev) => {
      if (obj.tag) obj.tagColor = getTagColor(obj.tag);
      return { ...prev, ...obj };
    });
  const cancelEdit = () => setEdit(false);

  async function editNote(event) {
    event.preventDefault();
    const editTag = edit.tag || "General";
    if (title === edit.title && description === edit.description && tag === edit.tag) setProgress(100);
    else
      var { success } = await fetchApp({
        url: `api/notes/update/${_id}`,
        method: "PUT",
        body: { title: edit.title, description: edit.description, tag: editTag, lastUpdatedAt: updatedAt },
      });
    if (success === false) return;
    cancelEdit();
    setTagColor(editTag, edit.tagColor);
  }

  useEffect(() => {
    if (edit?.flag) {
      window.addEventListener("beforeunload", cancelEdit);
      return () => {
        cancelEdit();
        window.removeEventListener("beforeunload", cancelEdit);
      };
    }
  }, [edit?.flag]);

  return { edit, handleEdit, cancelEdit, editNote };
}
