/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { TbMarkdown, TbMarkdownOff } from "react-icons/tb";
import { useSpeech } from "react-text-to-speech";
import { HiVolumeOff, HiVolumeUp } from "react-text-to-speech/icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import useStorage from "../hooks/useStorage";

export default function Text({ title, value }) {
  const [showMarkdown, setShowMarkdown] = useStorage("markdown", false);
  const [markdown, setMarkdown] = useState("");
  const text = useMemo(() => <>{showMarkdown ? parse(markdown) : value}</>, [value, markdown]);
  const { Text, speechStatus, start, stop } = useSpeech({ text, highlightText: true });

  useEffect(() => {
    stop();
    setMarkdown(document.querySelector(".rtts-markdown")?.innerHTML);
  }, [value, showMarkdown]);

  function copy() {
    navigator.clipboard.writeText(value);
    toast.success("Text copied to clipboard!");
  }

  function toggleMarkdown() {
    stop();
    setTimeout(() => setShowMarkdown((prev) => !prev), 1);
  }

  return (
    <div className="flex flex-col items-center space-y-3 px-4 text-justify sm:px-5 md:px-6">
      <div className="flex w-[80vw] flex-col items-center space-y-2.5">
        <span className="text-center text-3xl font-medium" style={{ wordBreak: "break-word" }}>
          {title}
        </span>
        <div className="flex items-center space-x-3">
          <button title="Copy text" onClick={copy}>
            <FaCopy />
          </button>
          <button className="scale-150" onClick={toggleMarkdown}>
            {showMarkdown ? <TbMarkdownOff title="Disable markdown" /> : <TbMarkdown title="Enable markdown" />}
          </button>
          <button>{speechStatus === "started" ? <HiVolumeOff title="Stop speech" onClick={stop} /> : <HiVolumeUp title="Start speech" onClick={start} />}</button>
        </div>
      </div>
      <div className="share-markdown">
        <Text />
      </div>
      {showMarkdown && (
        <Markdown className="rtts-markdown hidden" remarkPlugins={[remarkGfm]}>
          {value}
        </Markdown>
      )}
    </div>
  );
}
