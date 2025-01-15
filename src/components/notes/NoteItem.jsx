/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useState } from "react";
import { FaCompress, FaExpand, FaRegCopy, FaRegEdit, FaRegFilePdf, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { GrVolume, GrVolumeMute, GrShareOption, GrUndo } from "react-icons/gr";
import { TbMarkdown, TbMarkdownOff, TbMinusVertical } from "react-icons/tb";
import { useRemark } from "react-remarkify";
import { useSpeech } from "react-text-to-speech";
import Textarea from "react-textarea-autosize";
import generatePDF, { Margin } from "react-to-pdf";
import { toast } from "react-toastify";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { charLimit } from "../../constants";
import { useNoteContext } from "../../contexts/NoteProvider";
import useEdit from "../../hooks/useEdit";
import useStorage from "../../hooks/useStorage";
import { copy } from "../../modules/utilities";
import Loading from "../Loading";

const { maxTitle, maxDescription, maxTag } = charLimit;

export default function NoteItem({ note, children, mode = "normal" }) {
  const { _id, title, description, tag, updatedAt } = note;
  const router = useRouter();
  const { getTagColor, setModal, progress } = useNoteContext();
  const tagColor = getTagColor(tag);
  const { edit, handleEdit, cancelEdit, editNote } = useEdit(note);
  const [showMarkdown, setShowMarkdown] = useStorage("markdown", true);
  const [screenShot, setScreenShot] = useState(false);
  const shared = mode === "shared";
  const expanded = mode === "expanded" || shared;
  const showPlainText = shared && !showMarkdown;

  const reactContent = useRemark({
    markdown: description,
    rehypePlugins: [rehypeRaw, rehypeSanitize],
    remarkPlugins: [remarkGfm],
    remarkToRehypeOptions: { allowDangerousHtml: true },
  });
  const { Text, isInQueue, start, stop } = useSpeech({ text: showPlainText ? description : reactContent, highlightText: true });

  return (
    <div className="flex h-full flex-col">
      <form
        id={`form-${_id}`}
        className={`relative flex flex-col items-center rounded px-1 pt-4 text-justify sm:px-4 ${expanded ? "w-[90vw] sm:w-[80vw]" : "border-grey-600 h-full border pb-4"}`}
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
                className={`w-full px-5 text-center placeholder:text-gray-600 focus:outline-0 ${expanded ? "text-2xl" : "text-xl"}`}
                placeholder="Add title"
                required
                maxLength={maxTitle}
                onChange={(e) => handleEdit({ title: e.target.value })}
              />
              <span className="absolute right-0">{children}</span>
            </div>
            <div className={`flex-group my-2 text-gray-800 ${expanded ? "mt-3" : "scale-95"}`}>
              <button className="scale-110 cursor-pointer">
                <FaRegSave />
              </button>
              <FaXmark className="scale-x-[1.2] scale-y-125 cursor-pointer" onClick={cancelEdit} />
            </div>
            <hr className={`my-2 w-full ${expanded ? "invisible" : ""}`} />
            <Textarea
              placeholder="Add description"
              minRows={5}
              required
              maxLength={maxDescription}
              className={`mx-2 mb-1 max-h-[calc(100vh-14rem)] w-full px-2 text-gray-600 focus:outline-0 ${expanded ? "" : "text-sm"}`}
              value={edit.description}
              onChange={(e) => handleEdit({ description: e.target.value })}
            />
            <div className="w-full pr-1 text-right text-xs">
              {edit.description.length}/{maxDescription}
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
              <div className="relative flex w-full items-center justify-center">
                <h3 className={expanded ? "text-3xl font-medium" : "px-2 text-xl"} style={{ wordBreak: "break-word" }}>
                  {title}
                </h3>
                <span className="absolute right-0">{children}</span>
              </div>
              <div className={`my-2 flex items-center justify-center space-x-2 text-gray-800 ${progress ? "opacity-60" : ""} ${expanded ? "mt-3" : "scale-95"}`}>
                <div className="flex-group">
                  {shared ? (
                    <button type="button" className="scale-[1.4]" onClick={() => setShowMarkdown((prev) => !prev)}>
                      {showMarkdown ? <TbMarkdownOff title="Disable markdown" /> : <TbMarkdown title="Enable markdown" />}
                    </button>
                  ) : (
                    <>
                      {expanded ? (
                        <button type="button" title="Minimize note" className="scale-110" disabled={progress} onClick={() => router.push("/")}>
                          <FaCompress />
                        </button>
                      ) : (
                        <button type="button" title="Maximize note" className="scale-110" disabled={progress} onClick={() => router.push(`/note/${_id}`)}>
                          <FaExpand />
                        </button>
                      )}
                      <button type="button" title="Share note" className="scale-110" disabled={progress} onClick={() => setModal({ active: true, type: "shareNote", note: _id })}>
                        <GrShareOption />
                      </button>
                    </>
                  )}
                  <button type="button" title="Copy note" className="scale-110" disabled={progress} onClick={() => copy(description)}>
                    <FaRegCopy />
                  </button>
                  <button type="button" className="scale-110" disabled={progress}>
                    {isInQueue ? <GrVolumeMute title="Stop reading" onClick={stop} /> : <GrVolume title="Start reading" onClick={start} />}
                  </button>
                  {expanded && (
                    <button
                      type="button"
                      title="Download as PDF"
                      className="scale-110"
                      disabled={progress}
                      onClick={() => {
                        setScreenShot(true);
                        const pdf = document.getElementById(`pdf-${_id}`);
                        pdf.classList.remove("hidden");
                        generatePDF(() => pdf, { filename: `${title}.pdf`, page: { margin: Margin.SMALL } })
                          .then(() => toast.success("PDF downloaded successfully!"))
                          .catch(() => toast.error("Failed to generate PDF!"))
                          .finally(() => setTimeout(() => setScreenShot(false), 100));
                      }}
                    >
                      <FaRegFilePdf />
                    </button>
                  )}
                </div>
                {!shared && (
                  <>
                    <TbMinusVertical className="scale-y-[2]" />
                    <div className="flex-group">
                      <button
                        type="button"
                        title="Edit note"
                        className="scale-125"
                        disabled={progress}
                        onClick={() => handleEdit({ flag: true, title, description, tag, tagColor })}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        type="button"
                        title="Undo note"
                        className="scale-125"
                        disabled={progress}
                        onClick={() => setModal({ active: true, type: "undoNote", note: _id, updatedAt })}
                      >
                        <GrUndo />
                      </button>
                      <button type="button" title="Delete note" className="scale-110" disabled={progress} onClick={() => setModal({ active: true, type: "deleteNote", note: _id })}>
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <hr className={`my-2 w-full ${expanded ? "invisible" : ""}`} />
              <div className={`markdown px-2 text-gray-600 ${expanded ? "text-justify" : "max-h-[calc(100vh-14rem)] min-w-full text-left text-sm"}`}>
                <Text />
              </div>
            </div>
            <p className={`bottom-1.5 w-full text-center text-gray-600 ${expanded ? "relative scale-95 pb-3 text-sm" : "absolute text-2xs"}`}>
              Last Updated: {new Date(updatedAt).toLocaleString()}
            </p>
          </>
        )}
      </form>
      {
        <>
          <div id={`screen-${_id}`} className={`fixed left-0 top-0 z-30 h-screen w-screen bg-white ${screenShot ? "block" : "hidden"}`}>
            <Loading text="Generating PDF..." />
          </div>
          <div id={`pdf-${_id}`} className={`w-[896px] flex-col items-center space-y-4 ${screenShot ? "flex" : "hidden"}`}>
            <h3 className="w-full text-center text-3xl font-medium" style={{ wordBreak: "break-word" }}>
              {title}
            </h3>
            <div className="markdown px-2 text-justify text-gray-600">{reactContent}</div>
            <p className="w-full scale-95 pb-3 text-center text-sm text-gray-600">Last Updated: {new Date(updatedAt).toLocaleString()}</p>
          </div>
        </>
      }
    </div>
  );
}
