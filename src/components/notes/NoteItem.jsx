/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { Activity, useEffect, useRef, useState } from "react";
import { FaCompress, FaExpand, FaRegCopy, FaRegEdit, FaRegFilePdf, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdFileDownload, MdFileUpload, MdRefresh, MdSync } from "react-icons/md";
import { GrVolume, GrVolumeMute, GrShareOption, GrUndo } from "react-icons/gr";
import { TbDots, TbMarkdown, TbMarkdownOff, TbSparkles } from "react-icons/tb";
import { useRemark } from "react-remarkify";
import { useSpeech } from "react-text-to-speech";
import Textarea from "react-textarea-autosize";
import generatePDF, { Margin } from "react-to-pdf";
import { toast } from "react-toastify";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { charLimit, tagColorsKey } from "../../constants";
import { useNoteContext } from "../../contexts/NoteProvider";
import useBeautify from "../../hooks/useBeautify";
import useUpsert from "../../hooks/useUpsert";
import useStorage from "../../hooks/useStorage";
import { useStorageListener } from "../../hooks/useStorageListener";
import { copy } from "../../lib/utilities";
import Loading from "../Loading";
import Expandable from "../navbar/Expandable";
import { deleteLocalNote, isNewNote } from "../../lib/notes";
import { validateClosestForm } from "../../lib/dom";

const {
  note: {
    title: { max: maxTitle },
    description: { max: maxDescription },
    tag: { max: maxTag },
  },
} = charLimit;

export default function NoteItem({ propNote, filter = {}, children, mode = "normal" }) {
  const localNote = useStorageListener(`local-${propNote._id}`);
  const note = { ...propNote, localUpdatedAt: propNote.updatedAt, ...localNote };
  const { _id, title, description, tag, updatedAt, localUpdatedAt } = note;
  const { search, selTag } = filter;
  const router = useRouter();
  const { getTagColor, setModal, progress, resetQueryParam } = useNoteContext();
  const tagColor = getTagColor(tag);
  const { upsertState, updateUpsertState, cancelUpsert, handleUpsert } = useUpsert(propNote);
  const { beautifyActive, beautifiedText, isBeautifying, startBeautify, cancelBeautify, handleAcceptBeautify } = useBeautify(note);
  const [showMarkdown, setShowMarkdown] = useStorage("markdown", true);
  const [showMore, setShowMore] = useState(false);
  const [screenShot, setScreenShot] = useState(false);
  const [showCloudVersion, setShowCloudVersion] = useState(false);
  const moreRef = useRef();
  const newNote = isNewNote(_id);
  const showNote = (!selTag || tag === selTag) && (!search || [tag, title, description].some((str) => str.toLowerCase().includes(search)));
  const expanded = mode !== "normal";
  const conflict = mode === "conflict";
  const shared = mode === "shared";
  const showPlainText = shared && !showMarkdown;

  const reactContent = useRemark({
    markdown: beautifyActive ? beautifiedText : description,
    stableMarkdown: true,
    rehypePlugins: [rehypeRaw, rehypeSanitize],
    remarkPlugins: [remarkGfm],
    remarkToRehypeOptions: { allowDangerousHtml: true },
  });
  const { Text, isInQueue, start, stop } = useSpeech({ text: showPlainText ? description : reactContent, stableText: true, highlightText: true });

  const activateUpsert = () => updateUpsertState({ flag: true, title, description, tag, updatedAt });

  useEffect(() => {
    function handleClick(e) {
      if (!moreRef.current?.contains(e.target)) setShowMore(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (conflict) activateUpsert();
  }, [conflict]);

  return (
    <Activity mode={showNote ? "visible" : "hidden"}>
      <div className="flex h-full min-h-64 flex-col">
        <form
          className={`relative flex flex-col items-center rounded px-1 py-4 xs:px-2 sm:px-4 ${expanded ? "min-h-[calc(100dvh-2.875rem)] w-[90vw] sm:w-[80vw]" : "border-grey-600 h-full border"}`}
        >
          {upsertState.flag ? (
            <>
              {conflict && (
                <div className="mb-4 w-full rounded-lg border border-yellow-300 bg-yellow-50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="mb-1 text-sm font-semibold text-yellow-800">⚠️ Conflict Detected</h3>
                      <p className="text-xs text-yellow-700">This note was modified both locally and in the cloud. You&apos;re editing the local version.</p>
                    </div>
                    <button type="button" className="whitespace-nowrap text-xs text-yellow-700 underline" onClick={() => setShowCloudVersion(!showCloudVersion)}>
                      {showCloudVersion ? "Hide" : "View"} Cloud Version
                    </button>
                  </div>
                  <Expandable expand={showCloudVersion}>
                    <div className="mt-3 rounded border border-yellow-200 bg-white p-3 text-sm">
                      <div className="mb-2 text-xs text-gray-500">Cloud version (last updated: {new Date(propNote.updatedAt).toLocaleString()})</div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-600">Title: </span>
                        <span>{propNote.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Description:</span>
                        <div className="mt-1 max-h-32 overflow-y-auto whitespace-pre-wrap rounded bg-gray-50 p-2 text-gray-600">{propNote.description}</div>
                      </div>
                    </div>
                  </Expandable>
                </div>
              )}
              {!expanded && (
                <div className="absolute top-0 flex -translate-y-1/2 rounded-2xl bg-gray-200 px-2.5">
                  <input
                    type="text"
                    list="tagList"
                    value={upsertState.tag}
                    className="bg-gray-200 py-px text-center text-xs text-black placeholder:text-gray-600 focus:outline-none"
                    placeholder="Add tag"
                    maxLength={maxTag}
                    autoComplete="off"
                    onChange={(e) => updateUpsertState({ tag: e.target.value })}
                  />
                  <input
                    type="color"
                    value={upsertState.tagColor}
                    list={tagColorsKey}
                    className="bg-gray-200 focus:outline-none"
                    onChange={(e) => updateUpsertState({ tagColor: e.target.value })}
                  />
                </div>
              )}
              <div className="relative flex w-full items-center justify-center">
                <input
                  type="text"
                  value={upsertState.title}
                  className={`w-full px-5 text-center placeholder:text-gray-600 focus:outline-none ${expanded ? "text-2xl" : "text-xl"}`}
                  placeholder="Add title"
                  required
                  maxLength={maxTitle}
                  onChange={(e) => updateUpsertState({ title: e.target.value })}
                />
                <span className="absolute right-0 top-1.5 sm:-right-2">{children}</span>
              </div>
              <div className={`flex-group my-2 h-[1.125rem] text-gray-800 ${expanded ? "mt-3" : "scale-95"}`}>
                {conflict ? (
                  <>
                    <button
                      type="button"
                      title="Force save to cloud"
                      className="scale-110 cursor-pointer disabled:opacity-60"
                      disabled={progress}
                      onClick={async (event) => {
                        if (!validateClosestForm(event)) return;
                        await handleUpsert({ save: true, sync: true, force: true });
                        resetQueryParam("conflict");
                      }}
                    >
                      <MdFileUpload />
                    </button>
                    <button
                      type="button"
                      title="Discard local changes"
                      className="scale-110 cursor-pointer disabled:opacity-60"
                      disabled={progress}
                      onClick={() => {
                        toast.success("Accepted cloud version");
                        deleteLocalNote(_id);
                        cancelUpsert();
                        resetQueryParam("conflict");
                      }}
                    >
                      <MdFileDownload />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      title="Save locally"
                      className="scale-110 cursor-pointer disabled:opacity-60"
                      disabled={progress}
                      onClick={(event) => {
                        if (!validateClosestForm(event)) return;
                        handleUpsert({ save: true, sync: false });
                      }}
                    >
                      <FaRegSave />
                    </button>
                    <button
                      type="button"
                      title="Save to cloud"
                      className="relative scale-110 cursor-pointer disabled:opacity-60"
                      disabled={progress}
                      onClick={(event) => {
                        if (!validateClosestForm(event)) return;
                        handleUpsert({ save: true, sync: true });
                      }}
                    >
                      <FaRegSave />
                      <MdSync className="absolute -bottom-1 -right-1 rounded-full bg-black text-[0.7rem] text-white" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="scale-x-[1.2] scale-y-125 cursor-pointer disabled:opacity-60"
                  disabled={progress}
                  onClick={() => {
                    if (newNote && !localNote) deleteLocalNote(_id);
                    cancelUpsert();
                    resetQueryParam("conflict");
                  }}
                >
                  <FaXmark />
                </button>
              </div>
              <hr className={`my-2 w-full ${expanded ? "invisible" : ""}`} />
              <Textarea
                placeholder="Add description"
                minRows={5}
                maxLength={maxDescription}
                className={`mx-2 mb-1 max-h-[calc(100dvh-14rem)] w-full px-2 text-gray-600 focus:outline-none ${expanded ? "" : "text-sm"}`}
                value={upsertState.description}
                onChange={(e) => updateUpsertState({ description: e.target.value })}
              />
              <div className="w-full pr-1 text-right text-xs">
                {upsertState.description.length}/{maxDescription}
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
                  <span className="absolute right-0 top-1.5 sm:-right-2">{children}</span>
                </div>
                <div className={`my-2 h-[1.125rem] text-gray-800 ${expanded ? "mt-3 scale-95 xs:scale-100" : "scale-90 xs:scale-95"}`}>
                  {beautifyActive ? (
                    <div className="flex-group">
                      <button
                        type="button"
                        title="Save locally"
                        className="scale-110 disabled:opacity-60"
                        disabled={progress || isBeautifying}
                        onClick={() => handleAcceptBeautify({ save: true, sync: false })}
                      >
                        <FaRegSave />
                      </button>
                      <button
                        type="button"
                        title="Save to cloud"
                        className="relative scale-110 disabled:opacity-60"
                        disabled={progress || isBeautifying}
                        onClick={() => handleAcceptBeautify({ save: true, sync: true })}
                      >
                        <FaRegSave />
                        <MdSync className="absolute -bottom-1 -right-1 rounded-full bg-black text-[0.7rem] text-white" />
                      </button>
                      <button
                        type="button"
                        title="Retry beautify"
                        className="scale-125 disabled:opacity-60"
                        disabled={progress || isBeautifying}
                        onClick={() => startBeautify(true)}
                      >
                        <MdRefresh />
                      </button>
                      <button type="button" title="Cancel beautify" className="scale-125 disabled:opacity-60" disabled={progress || isBeautifying} onClick={cancelBeautify}>
                        <FaXmark />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-group relative inline-block">
                      {shared ? (
                        <button type="button" className="scale-[1.4]" onClick={() => setShowMarkdown((prev) => !prev)}>
                          {showMarkdown ? <TbMarkdownOff title="Disable markdown" /> : <TbMarkdown title="Enable markdown" />}
                        </button>
                      ) : (
                        <>
                          {expanded ? (
                            <button type="button" title="Minimize note" className="scale-110" onClick={() => router.push("/")}>
                              <FaCompress />
                            </button>
                          ) : (
                            <button type="button" title="Maximize note" className="scale-110" onClick={() => router.push(`/note/${_id}`)}>
                              <FaExpand />
                            </button>
                          )}
                        </>
                      )}
                      <button type="button" title="Copy note" className="scale-110" onClick={() => copy(description)}>
                        <FaRegCopy />
                      </button>
                      <button type="button" className="scale-110 disabled:opacity-60" disabled={progress}>
                        {isInQueue ? <GrVolumeMute title="Stop reading" onClick={stop} /> : <GrVolume title="Start reading" onClick={start} />}
                      </button>
                      {!shared && (
                        <>
                          <button type="button" title="Edit note" className="scale-125 disabled:opacity-60" disabled={progress} onClick={activateUpsert}>
                            <FaRegEdit />
                          </button>
                          <Activity mode={localNote ? "visible" : "hidden"}>
                            <button
                              type="button"
                              title="Sync note"
                              className="scale-125 disabled:opacity-60"
                              disabled={progress}
                              onClick={() => handleUpsert({ save: false, sync: true })}
                            >
                              <MdSync />
                            </button>
                          </Activity>
                        </>
                      )}
                      <button ref={moreRef} type="button" title="More actions" className="scale-110" onClick={() => setShowMore((prev) => !prev)}>
                        <TbDots />
                      </button>
                      <Activity mode={showMore ? "visible" : "hidden"}>
                        <div className="absolute right-0 mt-1 w-max space-y-2.5 rounded border bg-white p-2 text-sm text-gray-700 shadow-md">
                          <button
                            type="button"
                            className="flex items-center space-x-2"
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
                            <FaRegFilePdf className="scale-110" />
                            <span>Download PDF</span>
                          </button>
                          {!shared && (
                            <>
                              {!newNote && (
                                <button
                                  type="button"
                                  className="flex items-center space-x-2 disabled:opacity-60"
                                  disabled={progress}
                                  onClick={() => setModal({ active: true, type: "shareNote", note: _id })}
                                >
                                  <GrShareOption className="scale-110" />
                                  <span>Share Note</span>
                                </button>
                              )}
                              <button type="button" className="flex items-center space-x-2 disabled:opacity-60" disabled={progress} onClick={() => startBeautify()}>
                                <TbSparkles className="scale-110" />
                                <span>Beautify Note</span>
                              </button>
                              {!localNote ? (
                                <button
                                  type="button"
                                  className="flex items-center space-x-2 disabled:opacity-60"
                                  disabled={progress}
                                  onClick={() => setModal({ active: true, type: "undoNote", note: _id, localUpdatedAt })}
                                >
                                  <GrUndo className="scale-110" />
                                  <span>Undo Note</span>
                                </button>
                              ) : (
                                !newNote && (
                                  <button
                                    type="button"
                                    className="flex items-center space-x-2 disabled:opacity-60"
                                    disabled={progress}
                                    onClick={() => {
                                      toast.success("Local changes discarded");
                                      deleteLocalNote(_id);
                                    }}
                                  >
                                    <GrUndo className="scale-110" />
                                    <span>Discard Changes</span>
                                  </button>
                                )
                              )}
                              <button
                                type="button"
                                className="flex items-center space-x-2 disabled:opacity-60"
                                disabled={progress}
                                onClick={() => setModal({ active: true, type: "deleteNote", note: _id })}
                              >
                                <FaRegTrashAlt className="scale-110" />
                                <span>Delete Note</span>
                              </button>
                            </>
                          )}
                        </div>
                      </Activity>
                    </div>
                  )}
                </div>
                <hr className={`my-2 w-full ${expanded ? "invisible" : ""}`} />
                <Activity mode={isBeautifying ? "visible" : "hidden"}>
                  <div className="mb-2 px-2 text-sm text-gray-500">✨ Beautifying your note...</div>
                </Activity>
                <Text className={`markdown max-h-[calc(100dvh-14rem)] px-2 text-gray-600 ${expanded ? "" : "min-w-full text-left text-sm"}`} />
              </div>
              <p className={`w-full text-center text-gray-600 ${expanded ? "mt-auto scale-95 text-sm" : "absolute bottom-1.5 text-2xs"}`}>
                Last Updated: {new Date(localUpdatedAt).toLocaleString()}
              </p>
            </>
          )}
        </form>
        <Loading text="Generating PDF..." className={`z-30 bg-white ${screenShot ? "block" : "hidden"}`} />
        <div id={`pdf-${_id}`} className={`fixed left-0 top-0 w-[896px] flex-col items-center space-y-4 ${screenShot ? "flex" : "hidden"}`}>
          <h3 className="w-full text-center text-3xl font-medium" style={{ wordBreak: "break-word" }}>
            {title}
          </h3>
          <div className="markdown px-2 pb-1 text-gray-600">{reactContent}</div>
          <p className="w-full scale-95 pb-3 text-center text-sm text-gray-600">Last Updated: {new Date(localUpdatedAt).toLocaleString()}</p>
        </div>
      </div>
    </Activity>
  );
}
