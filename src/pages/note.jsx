/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { useNoteContext } from "../contexts/NoteProvider";
import NoteItem from "../components/notes/NoteItem";

export default function Note({ router }) {
  const { id, conflict } = router.query;
  const { notes } = useNoteContext();
  const note = useMemo(() => notes.find(({ _id }) => _id === id), [notes, id]);

  useEffect(() => {
    if (!note) router.push("/");
  }, [note]);

  return (
    note && (
      <div className="flex w-full justify-center">
        <NoteItem key={id} propNote={note} mode={conflict ? "conflict" : "expanded"} />
      </div>
    )
  );
}
