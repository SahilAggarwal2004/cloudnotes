import { useNoteContext } from "../../contexts/NoteProvider";
import { deleteLocalNote, isNewNote } from "../../lib/notes";

export default function DeleteNote({ id }) {
  const { closeModal, fetchApi } = useNoteContext();

  async function deleteNote() {
    closeModal();
    if (!isNewNote(id)) {
      const { success } = await fetchApi({ url: `api/notes/delete/${id}`, method: "DELETE" });
      if (!success) return;
    }
    deleteLocalNote(id);
  }

  return (
    <div>
      <h3 className="font-bold">Delete Note?</h3>
      <p className="pb-2 text-sm text-red-600">This action is irreversible</p>
      <div className="space-x-2">
        <button className="btn" onClick={deleteNote}>
          Yes
        </button>
        <button className="btn" onClick={closeModal}>
          No
        </button>
      </div>
    </div>
  );
}
