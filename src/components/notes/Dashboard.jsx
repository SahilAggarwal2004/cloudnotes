/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { Activity, useEffect, useMemo, useState } from "react";
import ReorderList, { ReorderIcon } from "react-reorder-list";
import { FaPlus as FaPlusBold } from "react-icons/fa";
import NoteItem from "./NoteItem";
import { useNoteContext } from "../../contexts/NoteProvider";
import useURLState from "../../hooks/useURLState";
import Loading from "../Loading";

export default function Dashboard() {
  const { fetchApp, isFetching, newNote, notes, progress, setNewNote, tags } = useNoteContext();
  const [selTag, setSelTag] = useState("");
  const [search, setSearch] = useURLState("search", "");

  const show = useMemo(() => {
    let filteredNotes = notes;
    if (selTag) filteredNotes = filteredNotes.filter(({ tag }) => tag === selTag);
    if (search) filteredNotes = filteredNotes.filter(({ title, description, tag }) => [tag, title, description].some((str) => str.toLowerCase().includes(search)));
    return filteredNotes;
  }, [notes, search, selTag]);

  const hasFilter = Boolean(selTag || search);
  const disableReordering = isFetching || hasFilter;

  useEffect(() => {
    if (newNote) window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [newNote]);

  async function handlePositionChange({ oldItems, newItems, revert }) {
    const order = newItems.slice(0, -1).map(({ key }) => key);
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
            <input
              className="border-grey-600 my-1 border px-1 text-center"
              placeholder="Search Notes"
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
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
              Notes: <strong>{notes.length}</strong>/25
            </div>
          </div>
          {show.length || newNote ? (
            <ReorderList
              useOnlyIconToDrag
              watchChildrenUpdates
              preserveOrder={!isFetching}
              disabled={disableReordering}
              props={{ className: "grid grid-cols-1 gap-x-5 gap-y-7 px-2 py-5 xs:px-5 sm:grid-cols-2 lg:grid-cols-3" }}
              onPositionChange={handlePositionChange}
            >
              {show.map((note) => (
                <NoteItem key={note._id} propNote={note}>
                  <Activity mode={disableReordering || progress ? "hidden" : "visible"}>
                    <ReorderIcon />
                  </Activity>
                </NoteItem>
              ))}
              <Activity mode={newNote ? "visible" : "hidden"}>
                <NoteItem propNote={{ _id: "new" }} data-disable-reorder />
              </Activity>
            </ReorderList>
          ) : isFetching ? (
            <Loading />
          ) : (
            <h4 className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">No Notes To Display!</h4>
          )}
        </div>
        <button
          className="fixed bottom-[2.625rem] right-[4vw] z-20 cursor-pointer rounded-full bg-purple-700 px-4 py-3 text-center text-white disabled:opacity-60 sm:right-[3vw]"
          disabled={progress}
          onClick={() => setNewNote(true)}
        >
          <FaPlusBold className="scale-110" />
        </button>
      </div>
    </>
  );
}
