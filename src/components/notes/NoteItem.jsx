/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FaCompress, FaCopy, FaExpand, FaRegCopy, FaRegEdit, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { TbMarkdown, TbMarkdownOff } from "react-icons/tb";
import { GrVolume, GrVolumeMute, GrShareOption } from "react-icons/gr";
import { useRemark } from "react-remarkify";
import { useSpeech } from "react-text-to-speech";
import { HiVolumeOff, HiVolumeUp } from "react-text-to-speech/icons";
import Textarea from "react-textarea-autosize";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { charLimit } from "../../constants";
import { useNoteContext } from "../../contexts/NoteProvider";
import useEdit from "../../hooks/useEdit";
import useStorage from "../../hooks/useStorage";
import { copy } from "../../modules/utilities";

const { maxTitle, maxDescription, maxTag } = charLimit;

export default function NoteItem({ note, children, mode = "normal" }) {
  const { _id, title, description, tag, updatedAt } = note;
  const router = useRouter();
  const { getTagColor, setModal, progress } = useNoteContext();
  const tagColor = getTagColor(tag);
  const { edit, handleEdit, cancelEdit, editNote } = useEdit(note);
  const [showMarkdown, setShowMarkdown] = useStorage("markdown", true);
  const shared = mode === "shared";
  const expanded = mode === "expanded" || shared;
  const showPlainText = shared && !showMarkdown;

  const reactContent = useRemark({
    markdown: description,
    rehypePlugins: [rehypeRaw, rehypeSanitize],
    remarkPlugins: [remarkGfm],
    remarkToRehypeOptions: { allowDangerousHtml: true },
  });
  const text = useMemo(
    () => (
      <>
        <div className="relative flex w-full items-center justify-center">
          <h3 className={expanded ? "text-3xl font-medium" : "px-2 text-lg"} style={{ wordBreak: "break-word" }}>
            {title}
            <span className="hidden">.</span>
          </h3>
          <span className="absolute right-0">{children}</span>
        </div>
        <hr className={`my-2 w-full ${expanded ? "invisible" : ""}`} />
        <div className={`markdown px-2 text-left text-sm text-gray-600 ${expanded ? "mb-2 max-h-[calc(100vh-12rem)]" : "mb-10 max-h-[calc(100vh-14rem)] min-w-full"}`}>
          {showPlainText ? description : reactContent}
        </div>
      </>
    ),
    [showPlainText, title, description, children, expanded],
  );
  const { Text, isInQueue, start, stop } = useSpeech({ text, highlightText: true });

  const handleCopy = () => copy(description);

  return (
    <form
      className={`relative flex flex-col items-center rounded px-4 py-4 text-justify ${expanded ? "h-[calc(100vh-4.5rem)] w-[90vw] sm:w-[80vw]" : "border-grey-600 h-full border"}`}
      onSubmit={editNote}
    >
      {edit?.flag ? (
        <>
          {!expanded && (
            <div className="absolute top-0 flex -translate-y-1/2">
              <input
                type="text"
                list="tagList"
                value={edit.tag}
                className="rounded-l-2xl bg-gray-200 py-px pl-1.5 text-center text-xs text-black placeholder:text-gray-600 focus:outline-0 sm:pl-2"
                placeholder="Add tag"
                maxLength={maxTag}
                autoComplete="off"
                onChange={(e) => handleEdit({ tag: e.target.value })}
              />
              <input
                type="color"
                value={edit.tagColor}
                list="tag-colors"
                className="rounded-r-2xl bg-gray-200 focus:outline-0"
                onChange={(e) => handleEdit({ tagColor: e.target.value })}
              />
            </div>
          )}
          <div className="relative flex w-full items-center justify-center">
            <input
              type="text"
              value={edit.title}
              className={`w-full px-5 text-center placeholder:text-gray-600 focus:outline-0 ${expanded ? "text-2xl" : "text-lg"}`}
              placeholder="Add title"
              required
              maxLength={maxTitle}
              onChange={(e) => handleEdit({ title: e.target.value })}
            />
            <span className="absolute right-0">{children}</span>
          </div>
          <hr className={`my-2 w-full ${expanded ? "invisible" : ""}`} />
          <Textarea
            placeholder="Add description"
            minRows={5}
            required
            maxLength={maxDescription}
            className={`mx-2 mb-1 w-full px-2 text-sm text-gray-600 focus:outline-0 ${expanded ? "max-h-[calc(100vh-12rem)]" : "max-h-[calc(100vh-14rem)]"}`}
            value={edit.description}
            onChange={(e) => handleEdit({ description: e.target.value })}
          />
          <div className="mb-10 w-full pr-1 text-right text-xs">
            {edit.description.length}/{maxDescription}
          </div>
          <div className="flex-group absolute bottom-6">
            <button className="scale-110 cursor-pointer">
              <FaRegSave />
            </button>
            <FaXmark className="scale-x-[1.2] scale-y-125 cursor-pointer" onClick={cancelEdit} />
          </div>
        </>
      ) : (
        <>
          <div className="mb-5 flex w-full flex-col items-center">
            {!expanded && (
              <div className="absolute top-0 translate-y-[-50%] rounded-2xl border bg-gray-200 px-2 py-px text-xs text-black" style={{ backgroundColor: tagColor }}>
                {tag}
              </div>
            )}
            <Text />
          </div>
          <div className="absolute bottom-1.5 space-y-1">
            {shared ? (
              <div className="flex-group mb-4">
                <button type="button" title="Copy text" onClick={handleCopy}>
                  <FaCopy />
                </button>
                <button type="button" className="scale-150" onClick={() => setShowMarkdown((prev) => !prev)}>
                  {showMarkdown ? <TbMarkdownOff title="Disable markdown" /> : <TbMarkdown title="Enable markdown" />}
                </button>
                <button type="button">{isInQueue ? <HiVolumeOff title="Stop speech" onClick={stop} /> : <HiVolumeUp title="Start speech" onClick={start} />}</button>
              </div>
            ) : (
              <>
                <div className="flex-group">
                  <button
                    type="button"
                    title="Edit note"
                    className="scale-125 disabled:opacity-60"
                    disabled={progress}
                    onClick={() => handleEdit({ flag: true, title, description, tag, tagColor })}
                  >
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
                  <button type="button" title="Copy note" className="scale-110 disabled:opacity-60" disabled={progress} onClick={handleCopy}>
                    <FaRegCopy />
                  </button>
                  <button
                    type="button"
                    title="Share note"
                    className="scale-110 disabled:opacity-60"
                    disabled={progress}
                    onClick={() => setModal({ active: true, type: "shareNote", note: _id })}
                  >
                    <GrShareOption />
                  </button>
                  <button type="button" className="scale-110 disabled:opacity-60" disabled={progress}>
                    {isInQueue ? <GrVolumeMute title="Stop reading" onClick={stop} /> : <GrVolume title="Start reading" onClick={start} />}
                  </button>
                  <button
                    type="button"
                    title="Delete note"
                    className="scale-110 disabled:opacity-60"
                    disabled={progress}
                    onClick={() => setModal({ active: true, type: "deleteNote", note: _id })}
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
                <p className="self-end text-2xs text-gray-600">Last Updated: {new Date(updatedAt).toLocaleString()}</p>
              </>
            )}
          </div>
        </>
      )}
    </form>
  );
}
