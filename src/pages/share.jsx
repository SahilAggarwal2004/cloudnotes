import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import NoteItem from "../components/notes/NoteItem";
import { queryKey } from "../constants";
import { useNoteContext } from "../contexts/NoteProvider";

export default function Share({ router }) {
  const { id } = router.query;
  const { fetchApi, progress } = useNoteContext();

  const { data } = useQuery({
    queryKey: queryKey.concat(id),
    queryFn: async () => {
      const { note = null } = await fetchApi({ url: `api/notes/fetch/${id}`, showToast: { success: false, error: true } });
      return note;
    },
  });

  return (
    <div className="flex w-full justify-center">
      {data ? (
        <NoteItem key={id} propNote={data} mode="shared" />
      ) : progress ? (
        <Loading />
      ) : (
        <div className="fixed top-0 flex h-full items-center text-lg font-semibold">Note not found!</div>
      )}
    </div>
  );
}
