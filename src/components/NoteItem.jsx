/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import Speech, { HighlightedText } from "react-text-to-speech";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import parse from "html-react-parser";
import Textarea from "react-textarea-autosize";
import { FaRegTrashAlt, FaRegEdit, FaRegSave, FaRegCopy, FaExpand, FaCompress } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { GrVolume, GrVolumeMute, GrShareOption } from "react-icons/gr";
import { useNoteContext } from "../contexts/NoteProvider";
import { charLimit } from "../constants";
import useStorage from "../hooks/useStorage";
import { copy } from "../modules/utilities";

const { maxTitle, maxDescription, maxTag } = charLimit;

export default function NoteItem({ note: { _id, description, updatedAt, tag, title }, router, expanded = false, children }) {
  const { fetchApp, setModal, progress, setProgress, getTagColor, setTagColor } = useNoteContext();
  const tagColor = getTagColor(tag);
  const [markdown, setMarkdown] = useState("");
  const [edit, setEdit] = useStorage("edit" + _id, false);

  const handleEdit = (obj) => setEdit((prev) => ({ ...prev, ...obj }));
  const cancelEdit = () => setEdit(false);

  const text = useMemo(
    () => (
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
        <div className="mb-10 w-full whitespace-pre-line text-left text-sm text-gray-600" style={{ wordBreak: "break-word" }}>
          <span className="hidden">. The description is</span>
          {markdown ? (
            <div className="markdown">{parse(markdown)}</div>
          ) : (
            <Markdown className={`markdown-${_id} markdown`} remarkPlugins={[remarkGfm]}>
              {description}
            </Markdown>
          )}
        </div>
      </>
    ),
    [title, description, tag, children, markdown],
  );

  useEffect(() => {
    setMarkdown(document.querySelector(`.markdown-${_id}`)?.innerHTML || "");
    if (edit?.flag) {
      window.addEventListener("beforeunload", cancelEdit);
      return () => {
        cancelEdit();
        window.removeEventListener("beforeunload", cancelEdit);
      };
    }
  }, [edit?.flag]);

  async function editNote(event) {
    event.preventDefault();
    const editTag = edit.tag || "General";
    if (title === edit.title && description === edit.description && tag === edit.tag) setProgress(100);
    else var { success } = await fetchApp({ url: `api/notes/update/${_id}`, method: "PUT", body: { title: edit.title, description: edit.description, tag: editTag, lastUpdatedAt: updatedAt } });
    if (success === false) return;
    cancelEdit();
    setTagColor(editTag, edit.tagColor);
  }

  return (
    <form className={`border-grey-600 relative flex h-full flex-col items-center rounded border px-4 py-4 ${expanded ? "mx-auto w-max min-w-60 max-w-full" : ""}`} onSubmit={editNote}>
      {edit?.flag ? (
        <>
          <div className="absolute top-0 flex -translate-y-1/2">
            <input
              type="text"
              list="tagList"
              value={edit.tag}
              className="rounded-l-2xl bg-gray-200 py-px pl-1.5 text-center text-xs text-black placeholder:text-gray-600 focus:outline-0 sm:pl-2"
              placeholder="Add tag"
              maxLength={maxTag}
              autoComplete="off"
              onChange={(e) => {
                const tag = e.target.value;
                handleEdit({ tag, tagColor: getTagColor(tag, false) });
              }}
            />
            <input type="color" value={edit.tagColor} list="tag-colors" className="rounded-r-2xl bg-gray-200 focus:outline-0" onChange={(e) => handleEdit({ tagColor: e.target.value })} />
          </div>
          <div className="relative flex w-full items-center justify-center">
            <input type="text" value={edit.title} className="text-bold w-full px-5 text-center text-lg placeholder:text-gray-600 focus:outline-0" placeholder="Add title" required maxLength={maxTitle} onChange={(e) => handleEdit({ title: e.target.value })} />
            <span className="absolute right-0">{children}</span>
          </div>
          <hr className="my-2 w-full" />
          <Textarea placeholder="Add description" minRows={5} maxRows={20} required maxLength={maxDescription} className="mx-2 mb-1 w-full px-2 text-sm text-gray-600 focus:outline-0" value={edit.description} onChange={(e) => handleEdit({ description: e.target.value })} />
          <div className="mb-10 w-full pr-1 text-right text-xs">
            {edit.description.length}/{maxDescription}
          </div>
          <div className="absolute bottom-6 flex space-x-4">
            <button className="scale-110 cursor-pointer">
              <FaRegSave />
            </button>
            <FaXmark className="scale-x-[1.2] scale-y-125 cursor-pointer" onClick={cancelEdit} />
          </div>
        </>
      ) : (
        <>
          <HighlightedText id={_id} className="mb-5 flex w-full flex-col items-center">
            {text}
          </HighlightedText>
          <div className="absolute bottom-1.5">
            <div className="mb-1 flex justify-center space-x-4">
              <button type="button" title="Edit note" className="scale-125 disabled:opacity-60" disabled={progress} onClick={() => setEdit({ flag: true, title, description, tag, tagColor })}>
                <FaRegEdit />
              </button>
              {expanded ? (
                <button type="button" title="Minimize note" className="scale-110 disabled:opacity-60" disabled={progress} onClick={() => router.push("/")}>
                  <FaCompress />
                </button>
              ) : (
                <button type="button" title="Maximize note" className="scale-110 disabled:opacity-60" disabled={progress} onClick={() => router.push(`/note/${_id}`)}>
                  <FaExpand />
                </button>
              )}
              <button type="button" title="Copy note" className="scale-110 disabled:opacity-60" disabled={progress} onClick={() => copy(description)}>
                <FaRegCopy />
              </button>
              <button type="button" title="Share note" className="scale-110 disabled:opacity-60" disabled={progress} onClick={() => setModal({ active: true, type: "shareNote", note: _id })}>
                <GrShareOption />
              </button>
              <button type="button" title="Listen note" className="scale-110 disabled:opacity-60" disabled={progress}>
                <Speech id={_id} text={text} useStopOverPause startBtn={<GrVolume />} stopBtn={<GrVolumeMute />} highlightText highlightProps={{ style: { backgroundColor: "yellow", color: "black" } }} />
              </button>
              <button type="button" title="Delete note" className="scale-110 disabled:opacity-60" disabled={progress} onClick={() => setModal({ active: true, type: "deleteNote", note: _id })}>
                <FaRegTrashAlt />
              </button>
            </div>
            <p className="self-end text-2xs text-gray-600">Last Updated: {new Date(updatedAt).toLocaleString()}</p>
          </div>
        </>
      )}
    </form>
  );
}
