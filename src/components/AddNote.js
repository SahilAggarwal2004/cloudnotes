import { useRef, useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6"
import { colors, defaultColor } from "../constants";
import { useNoteContext } from "../contexts/NoteProvider";

export default function AddNote({ tags, setNewNote, getTagColor, setTagColor }) {
  const { fetchApp, progress } = useNoteContext();
  const titleRef = useRef();
  const [description, setDescription] = useState('');
  const tagRef = useRef();
  const [tagColor, setColor] = useState(defaultColor);

  async function addNote(event) {
    event.preventDefault()
    const tag = tagRef.current.value || 'General'
    const { success } = await fetchApp({ url: 'api/notes/add', method: 'POST', body: { title: titleRef.current.value, description, tag } })
    if (!success) return
    setNewNote(false)
    setTagColor(tag, tagColor)
  }

  return <form className='flex flex-col items-center border border-grey-600 rounded px-2 py-4 relative' onSubmit={addNote}>
    <div className='absolute top-0 translate-y-[-50%] flex'>
      <input type='text' list='tag-list' ref={tagRef} className='bg-gray-200 text-xs text-center rounded-l-2xl text-black pl-1.5 sm:pl-2 py-px focus:outline-0 placeholder:text-gray-600' placeholder='Add tag' maxLength={12} autoComplete='off' onChange={e => {
        const tagColor = getTagColor(e.target.value, false)
        if (tagColor) setColor(tagColor)
      }} />
      <datalist id='tag-list'>{tags.map(tag => <option key={tag} value={tag} />)}</datalist>
      <input type='color' value={tagColor} list='tag-colors' className='bg-gray-200 text-xs text-center rounded-r-2xl text-black focus:outline-0' onChange={e => setColor(e.target.value)} />
      <datalist id='tag-colors'>
        {colors.map(color => <option key={color} value={color} />)}
      </datalist>
    </div>
    <input type='text' ref={titleRef} className='text-lg text-bold text-center w-full focus:outline-0 placeholder:text-gray-600' placeholder='Add title' required maxLength={20} />
    <hr className='w-full my-2' />
    <textarea value={description} placeholder='Add description' rows='5' required maxLength={1000} className='text-sm text-center text-gray-600 mb-1 mx-2 w-full focus:outline-0' onChange={e => setDescription(e.target.value)} />
    <div className='text-xs text-right w-full mb-10 pr-1'>{description.length}/1000</div>
    <div className='space-x-3 absolute bottom-[1.375rem] flex'>
      <button className="cursor-pointer scale-110 font-bold disabled:opacity-60" disabled={progress}>
        <FaPlus />
      </button>
      <FaXmark className="cursor-pointer scale-x-[1.2] scale-y-125" onClick={() => setNewNote(false)} />
    </div>
  </form>
}
