/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Speech, { HighlightedText } from "react-text-to-speech";
import Markdown from "react-markdown";
import parse from "html-react-parser";
import { FaRegTrashAlt, FaRegEdit, FaRegSave } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { GrVolume, GrVolumeMute } from "react-icons/gr";
import { useNoteContext } from "../contexts/NoteProvider";
import { charLimit } from "../constants";

const { maxTitle, maxDescription, maxTag } = charLimit;

export default function NoteItem({ note: { _id, description, updatedAt, tag, title }, getTagColor, setTagColor, children }) {
  const { fetchApp, setModal, progress, setProgress } = useNoteContext();
  const tagColor = getTagColor(tag);
  const [edit, setEdit] = useState(false);
  const editTitleRef = useRef();
  const [editDescription, setEditDescription] = useState();
  const editTagRef = useRef();
  const [editTagColor, setEditTagColor] = useState();
  const markdown = useMemo(() => document.querySelector(`.markdown-${_id}`)?.outerHTML || "", [description]);

  const text = (
    <>
      <div className="absolute top-0 translate-y-[-50%] rounded-2xl border bg-gray-200 px-2 py-px text-xs text-black" style={{ backgroundColor: tagColor }}>
        <span className="hidden">The tag is</span>
        {tag}
      </div>
      <div className="relative flex w-full items-center justify-center">
        <h3 className="text-bold px-2 text-lg" style={{ wordBreak: "break-word" }}>
          <span className="hidden">. The title is</span>
          {title}
        </h3>
        <span className="absolute right-0">{children}</span>
      </div>
      <hr className="my-2 w-full" />
      <div className="mb-10 w-full whitespace-pre-line px-2 text-justify text-sm text-gray-600" style={{ wordBreak: "break-word" }}>
        <span className="hidden">. The description is</span>
        <div className="prose-sm prose-p:my-0 prose-a:font-semibold prose-a:text-blue-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-ul:my-0 prose-li:my-0 prose-li:list-disc prose-li:text-left">{markdown ? parse(markdown) : <Markdown className={`markdown-${_id}`}>{description}</Markdown>}</div>
      </div>
    </>
  );

  useLayoutEffect(() => {
    if (edit) return;
    setEditDescription(description);
    setEditTagColor(tagColor);
  }, [edit]);

  async function editNote(event) {
    event.preventDefault();
    const editTitle = editTitleRef.current.value;
    const editTag = editTagRef.current.value || "General";
    if (title === editTitle && description === editDescription && tag === editTag) setProgress(100);
    else var { success } = await fetchApp({ url: `api/notes/update/${_id}`, method: "PUT", body: { title: editTitle, description: editDescription, tag: editTag } });
    if (success === false) return;
    setEdit(false);
    setTagColor(editTag, editTagColor);
  }

  return (
    <form className="border-grey-600 relative flex h-full flex-col items-center rounded border px-4 py-4" onSubmit={editNote}>
      {edit ? (
        <>
          <div className="absolute top-0 flex -translate-y-1/2">
            <input
              type="text"
              list="tagList"
              ref={editTagRef}
              className="rounded-l-2xl bg-gray-200 py-px pl-1.5 text-center text-xs text-black placeholder:text-gray-600 focus:outline-0 sm:pl-2"
              placeholder="Add tag"
              maxLength={maxTag}
              defaultValue={tag}
              autoComplete="off"
              onChange={(e) => {
                const tagColor = getTagColor(e.target.value, false);
                if (tagColor) setEditTagColor(tagColor);
              }}
            />
            <input type="color" value={editTagColor} list="tag-colors" className="rounded-r-2xl bg-gray-200 focus:outline-0" onChange={(e) => setEditTagColor(e.target.value)} />
          </div>
          <div className="relative flex w-full items-center justify-center">
            <input type="text" ref={editTitleRef} className="text-bold w-full pl-1 pr-5 text-center text-lg placeholder:text-gray-600 focus:outline-0" placeholder="Add title" required maxLength={maxTitle} defaultValue={title} />
            <span className="absolute right-0">{children}</span>
          </div>
          <hr className="my-2 w-full" />
          <textarea placeholder="Add description" rows="8" required maxLength={maxDescription} className="mx-2 mb-1 w-full px-2 text-sm text-gray-600 focus:outline-0" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
          <div className="mb-10 w-full pr-1 text-right text-xs">
            {editDescription.length}/{maxDescription}
          </div>
          <div className="absolute bottom-[1.375rem] flex space-x-4">
            <button className="scale-110 cursor-pointer">
              <FaRegSave />
            </button>
            <FaXmark className="scale-x-[1.2] scale-y-125 cursor-pointer" onClick={() => setEdit(false)} />
          </div>
        </>
      ) : (
        <>
          <HighlightedText id={_id} className="flex w-full flex-col items-center">
            {text}
          </HighlightedText>
          <div className="absolute bottom-1.5">
            <div className="mb-1 flex justify-center space-x-5">
              <button type="button" className="scale-110 cursor-pointer disabled:opacity-60" disabled={progress} onClick={() => setModal({ active: true, type: "deleteNote", note: _id })}>
                <FaRegTrashAlt />
              </button>
              <button className="scale-125 cursor-pointer disabled:opacity-60" disabled={progress} onClick={() => setEdit(true)}>
                <FaRegEdit />
              </button>
              <button type="button" className="scale-110 cursor-pointer font-bold disabled:opacity-60" disabled={progress}>
                <Speech id={_id} text={text} useStopOverPause highlightText startBtn={<GrVolume />} stopBtn={<GrVolumeMute />} />
              </button>
            </div>
            <p className="self-end text-2xs text-gray-600">Last Updated: {new Date(Date.parse(updatedAt)).toLocaleString()}</p>
          </div>
        </>
      )}
    </form>
  );
}
