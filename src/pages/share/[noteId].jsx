import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import Text from "../../components/Text";
import { queryKey } from "../../constants";
import { useNoteContext } from "../../contexts/NoteProvider";

export default function Id({ router }) {
  const { noteId } = router.query;
  const { fetchApp } = useNoteContext();

  const { data, isFetching } = useQuery({
    queryKey: queryKey.concat(noteId),
    queryFn: async () => {
      const { note } = await fetchApp({ url: `api/notes/fetch/${noteId}`, showToast: false });
      return note;
    },
  });

  return <div className="mt-2 p-4">{data ? <Text title={data.title} value={data.description} /> : isFetching ? <Loading /> : <div className="text-center text-lg font-semibold">Note note found!</div>}</div>;
}
