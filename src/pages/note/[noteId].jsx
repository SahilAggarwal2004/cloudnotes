/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNoteContext } from "../../contexts/NoteProvider";
import NoteItem from "../../components/notes/NoteItem";

export default function Note({ router }) {
  const { noteId } = router.query;
  const { notes } = useNoteContext();
  const note = notes.find(({ _id }) => _id === noteId);

  useEffect(() => {
    if (!note) router.push("/");
  }, [note]);

  return (
    note && (
      <div className="flex w-full justify-center">
        <NoteItem note={note} mode="expanded" />
      </div>
    )
  );
}
