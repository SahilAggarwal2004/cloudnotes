import { useRef, useState } from "react";
import Textarea from "react-textarea-autosize";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { charLimit, colors, defaultColor } from "../constants";
import { useNoteContext } from "../contexts/NoteProvider";

const { maxTitle, maxDescription, maxTag } = charLimit;

export default function AddNote({ tags, setNewNote, getTagColor, setTagColor }) {
  const { fetchApp, progress } = useNoteContext();
  const titleRef = useRef();
  const [description, setDescription] = useState("");
  const tagRef = useRef();
  const [tagColor, setColor] = useState(defaultColor);

  async function addNote(event) {
    event.preventDefault();
    const tag = tagRef.current.value || "General";
    const { success } = await fetchApp({ url: "api/notes/add", method: "POST", body: { title: titleRef.current.value, description, tag } });
    if (!success) return;
    setNewNote(false);
    setTagColor(tag, tagColor);
  }

  return (
    <form className="border-grey-600 relative flex flex-col items-center rounded border px-2 py-4" onSubmit={addNote}>
      <div className="absolute top-0 flex translate-y-[-50%]">
        <input
          type="text"
          list="tag-list"
          ref={tagRef}
          className="rounded-l-2xl bg-gray-200 py-px pl-1.5 text-center text-xs text-black placeholder:text-gray-600 focus:outline-0 sm:pl-2"
          placeholder="Add tag"
          maxLength={maxTag}
          autoComplete="off"
          onChange={(e) => {
            const tagColor = getTagColor(e.target.value, false);
            if (tagColor) setColor(tagColor);
          }}
        />
        <datalist id="tag-list">
          {tags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
        <input type="color" value={tagColor} list="tag-colors" className="rounded-r-2xl bg-gray-200 text-center text-xs text-black focus:outline-0" onChange={(e) => setColor(e.target.value)} />
        <datalist id="tag-colors">
          {colors.map((color) => (
            <option key={color} value={color} />
          ))}
        </datalist>
      </div>
      <input type="text" ref={titleRef} className="text-bold w-full text-center text-lg placeholder:text-gray-600 focus:outline-0" placeholder="Add title" required maxLength={maxTitle} />
      <hr className="my-2 w-full" />
      <Textarea value={description} placeholder="Add description" minRows={5} maxRows={20} required maxLength={maxDescription} className="mx-2 mb-1 w-full text-center text-sm text-gray-600 focus:outline-0" onChange={(e) => setDescription(e.target.value)} />
      <div className="mb-10 w-full pr-1 text-right text-xs">
        {description.length}/{maxDescription}
      </div>
      <div className="absolute bottom-[1.375rem] flex space-x-3">
        <button className="scale-110 cursor-pointer font-bold disabled:opacity-60" disabled={progress}>
          <FaPlus />
        </button>
        <FaXmark className="scale-x-[1.2] scale-y-125 cursor-pointer" onClick={() => setNewNote(false)} />
      </div>
    </form>
  );
}
