/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useRouter } from "next/router";
import { Activity, useEffect, useState } from "react";
import ReorderList, { ReorderIcon } from "react-reorder-list";
import { toast } from "react-toastify";
import { FaPlus as FaPlusBold } from "react-icons/fa";
import NoteItem from "./NoteItem";
import { charLimit, maxNotes, newNotePrefix, newNotesKey } from "../../constants";
import { useNoteContext } from "../../contexts/NoteProvider";
import useURLState from "../../hooks/useURLState";
import Loading from "../Loading";
import { setStorage } from "../../lib/storage";

const {
  note: {
    title: { max: maxTitle },
    description: { max: maxDescription },
  },
} = charLimit;

export default function Dashboard() {
  const router = useRouter();
  const { share } = router.query;
  const { fetchApi, newNotes, notes, progress, resetQueryParam, tags } = useNoteContext();
  const [selTag, setSelTag] = useState("");
  const [search, setSearch] = useURLState("search", "");
  const allNotesLength = notes.length + newNotes.length;
  const isFilterActive = Boolean(selTag || search);
  const isInteractionDisabled = progress || isFilterActive;

  function createNewNote(newNote) {
    if (allNotesLength >= maxNotes) return toast.error("You have reached the maximum number of notes!");
    const newNoteId = `${newNotePrefix}${Date.now()}`;
    setStorage(`upsert-${newNoteId}`, { flag: true, updatedAt: new Date().toISOString(), ...newNote }, false);
    setStorage(newNotesKey, newNotes.concat(newNoteId));
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  useEffect(() => {
    if (!share) return;

    const handleMessage = ({ data: { title, text, url } }) => {
      let description = "";
      if (title) description += `# ${title}\n\n`;
      if (text) description += `${text}\n\n`;
      if (url) description += `${url}`;
      createNewNote({ title: title.slice(0, maxTitle), description: description.slice(0, maxDescription) });
      resetQueryParam("share");
    };
    const sendReady = () => navigator.serviceWorker.controller?.postMessage("ready");

    navigator.serviceWorker.addEventListener("message", handleMessage);
    if (navigator.serviceWorker.controller) sendReady();
    else {
      const onControllerChange = () => {
        sendReady();
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      };
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    }
    return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, []);

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
              Notes: <strong>{allNotesLength}</strong>/{maxNotes}
            </div>
          </div>
          {allNotesLength ? (
            <ReorderList
              disabled={isFilterActive}
              useOnlyIconToDrag
              props={{ className: "grid grid-cols-1 gap-x-5 gap-y-7 px-2 py-5 xs:px-5 sm:grid-cols-2 lg:grid-cols-3" }}
              onPositionChange={({ newOrder, revert }) => fetchApi({ url: "api/notes/order", method: "PUT", body: { order: newOrder }, onError: revert })}
            >
              {notes.map((note) => {
                return (
                  <NoteItem key={note._id} propNote={note} filter={{ search, selTag }}>
                    <Activity mode={isInteractionDisabled ? "hidden" : "visible"}>
                      <ReorderIcon />
                    </Activity>
                  </NoteItem>
                );
              })}
              {newNotes.map((_id) => (
                <NoteItem key={_id} propNote={{ _id }} filter={{ search, selTag }} />
              ))}
            </ReorderList>
          ) : progress ? (
            <Loading />
          ) : (
            <h4 className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">No Notes To Display!</h4>
          )}
        </div>
        <button
          className="fixed bottom-[2.625rem] right-[4vw] z-20 cursor-pointer rounded-full bg-purple-700 px-4 py-3 text-center text-white disabled:opacity-60 sm:right-[3vw]"
          disabled={isInteractionDisabled}
          onClick={() => createNewNote()}
        >
          <FaPlusBold className="scale-110" />
        </button>
      </div>
    </>
  );
}
