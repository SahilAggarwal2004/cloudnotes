import { useNoteContext } from "../../contexts/NoteProvider";

export default function UndoNote({ id, localUpdatedAt }) {
  const { closeModal, fetchApi } = useNoteContext();

  function undoNote() {
    closeModal();
    fetchApi({ url: `api/notes/undo/${id}`, method: "PUT", body: { localUpdatedAt } });
  }

  return (
    <div>
      <h3 className="font-bold">Undo Note?</h3>
      <p className="pb-2 text-sm">This will revert the note to its previous state</p>
      <div className="space-x-2">
        <button className="btn" onClick={undoNote}>
          Yes
        </button>
        <button className="btn" onClick={closeModal}>
          No
        </button>
      </div>
    </div>
  );
}
