/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import ReorderList, { ReorderIcon } from "react-reorder-list";
import { FaPlus as FaPlusBold } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import NoteItem from "./NoteItem";
import { getStorage, setStorage } from "../modules/storage";
import { queryKey } from "../constants";
import { useNoteContext } from "../contexts/NoteProvider";
import useURLState from "../hooks/useURLState";
import useTagColors from "../hooks/useTagColors";
import Loading from "./Loading";
import AddNote from "./AddNote";

export default function Dashboard() {
  const { fetchApp, progress } = useNoteContext();
  const { getTagColor, setTagColor } = useTagColors();
  const [newNote, setNewNote] = useState(false);
  const [selTag, setSelTag] = useState("");
  const [search, setSearch] = useURLState("search", "");

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const { notes } = await fetchApp({ url: "api/notes/fetch", showToast: false });
      return notes || null;
    },
  });
  const notes = useMemo(() => {
    if (data) setStorage(queryKey, data);
    return data || getStorage(queryKey, []);
  }, [data]);
  const tags = notes.reduce((arr, { tag }) => (arr.includes(tag) ? arr : arr.concat(tag)), []);
  const show = useMemo(() => {
    return (selTag ? notes.filter(({ tag }) => tag === selTag) : notes).filter(({ title, description, tag }) => [title, description, tag].join("~~").toLowerCase().includes(search));
  }, [notes, search, selTag]);

  const disableReordering = isFetching || selTag || search;

  useEffect(() => {
    if (newNote) window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [newNote]);

  async function handlePositionChange({ newItems, revert }) {
    const order = newItems.flatMap((item) => (item?.key ? [item.key] : []));
    const { success } = await fetchApp({ url: "api/notes/order", method: "PUT", body: { order } });
    if (!success) revert();
  }

  return (
    <>
      <Head>
        <title>Dashboard | CloudNotes</title>
      </Head>
      <div className="mb-12">
        <div className="py-4 text-center">
          <div className="flex flex-col items-center justify-center sm:mx-5 sm:flex-row sm:justify-end sm:space-x-3">
            <input className="border-grey-600 my-1 border px-1 text-center" placeholder="Search Notes" defaultValue={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} />
            <select className="border-grey-600 my-1 w-min border px-1" value={selTag} onChange={(e) => setSelTag(e.target.value)}>
              <option key="All" value="">
                All
              </option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="m-5 grid grid-cols-10 items-center">
            <span className="hidden sm:col-span-2 sm:inline" />
            <h2 className="col-span-5 text-left text-xl font-bold sm:col-span-6 sm:text-center">Your Notes</h2>
            <div className="col-span-5 text-right sm:col-span-2">
              Notes: <strong>{notes.length}</strong>/100
            </div>
          </div>
          {show.length || newNote ? (
            <ReorderList useOnlyIconToDrag watchChildrenUpdates preserveOrder={!isFetching} disabled={disableReordering} props={{ className: "grid grid-cols-1 gap-x-5 gap-y-7 p-5 sm:grid-cols-2 normal:grid-cols-3" }} onPositionChange={handlePositionChange}>
              {show.map((note) => (
                <NoteItem key={note._id} note={note} getTagColor={getTagColor} setTagColor={setTagColor}>
                  {!disableReordering && !progress && <ReorderIcon />}
                </NoteItem>
              ))}
              {newNote && <AddNote tags={tags} setNewNote={setNewNote} getTagColor={getTagColor} setTagColor={setTagColor} />}
            </ReorderList>
          ) : isFetching ? (
            <Loading />
          ) : (
            <h4 className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">No Notes To Display!</h4>
          )}
        </div>
        <button className="fixed bottom-[2.625rem] right-[4vw] z-20 cursor-pointer rounded-full bg-purple-700 px-4 py-3 text-center text-white disabled:opacity-60 sm:right-[3vw]" disabled={progress} onClick={() => setNewNote(true)}>
          <FaPlusBold className="scale-110" />
        </button>
      </div>
    </>
  );
}
