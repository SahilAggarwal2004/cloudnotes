/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import { useNoteContext } from "../../contexts/NoteProvider";
import NoteItem from "../../components/notes/NoteItem";

export default function Note({ router }) {
  const { noteId } = router.query;
  const { notes } = useNoteContext();
  const note = useMemo(() => notes.find(({ _id }) => _id === noteId), [notes, noteId]);

  useEffect(() => {
    if (!note) router.push("/");
  }, [note]);

  return (
    note && (
      <div className="mt-3 flex w-full justify-center">
        <NoteItem note={note} mode="expanded" />
      </div>
    )
  );
}
