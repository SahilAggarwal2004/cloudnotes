import React from "react";
import { useNoteContext } from "../../contexts/NoteProvider";
import NoteItem from "../../components/NoteItem";

export default function Note({ router }) {
  const { noteId } = router.query;
  const { notes } = useNoteContext();
  const note = notes.find(({ _id }) => _id === noteId);

  return (
    <div className="mt-5 px-3">
      <NoteItem key={note._id} note={note} router={router} expanded />
    </div>
  );
}
