import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import NoteItem from "../../components/notes/NoteItem";
import { queryKey } from "../../constants";
import { useNoteContext } from "../../contexts/NoteProvider";

export default function Id({ router }) {
  const { noteId } = router.query;
  const { fetchApp } = useNoteContext();

  const { data, isFetching } = useQuery({
    queryKey: queryKey.concat(noteId),
    queryFn: async () => {
      const { note = null } = await fetchApp({ url: `api/notes/fetch/${noteId}`, showToast: false });
      return note;
    },
  });

  return (
    <div className="flex w-full justify-center">
      {data ? (
        <NoteItem note={data} mode="shared" />
      ) : isFetching ? (
        <Loading />
      ) : (
        <div className="fixed top-0 flex h-full items-center text-lg font-semibold">Note note found!</div>
      )}
    </div>
  );
}
