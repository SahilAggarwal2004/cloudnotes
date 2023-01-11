import React, { useContext } from 'react'
import NoteContext from '../context/notes/NoteContext'
import ToggleContext from '../context/toggle/ToggleContext';
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'
import Speech from 'react-text-to-speech';
import { GrVolume, GrVolumeMute } from 'react-icons/gr';
import { getStorage } from '../modules/storage';

export default function NoteItem({ note, editTag, editTagColor, setEditDescLength }) {
    const { _id, date, tag, title, description } = note;
    const showDate = new Date(Date.parse(date)).toLocaleString()
    const { setNoteToDelete, setNoteToEdit } = useContext(NoteContext)
    const { setModal, loadbar } = useContext(ToggleContext)
    const tagColors = getStorage('tagColors')

    return <div className='flex flex-col items-center border border-grey-600 rounded px-2 py-4 relative' data-aos='fade-up' data-aos-once='true' data-aos-offset={20}>
        <div className='bg-gray-200 rounded-2xl absolute top-0 translate-y-[-50%] text-xs text-black px-2 py-px border' style={{ backgroundColor: tagColors && tagColors[tag] === '#000000' ? '#e5e7eb' : tagColors ? tagColors[tag] : '#e5e7eb' }}>{tag}</div>
        <h3 className='text-lg text-bold' style={{ wordBreak: 'break-word' }}>{title}</h3>
        <hr className='w-full my-2' />
        <p className='text-sm text-gray-600 mb-10 whitespace-pre-line' style={{ wordBreak: 'break-word' }}>{description}</p>
        <div className='absolute bottom-1.5'>
            <div className='space-x-5 flex justify-center mb-1'>
                <FaRegTrashAlt className="scale-110 cursor-pointer" onClick={() => {
                    if (loadbar[1]) return
                    setModal([{}, true, 'deleteNote'])
                    setNoteToDelete(_id)
                }} />
                <FaRegEdit className="scale-125 cursor-pointer" onClick={() => {
                    setNoteToEdit([note, true])
                    setEditDescLength(note.description.length)
                    setTimeout(() => {
                        editTagColor.current.value = tagColors ? tagColors[editTag.current.value] : '#e5e7eb'
                        if (editTagColor.current.value === '#000000') editTagColor.current.value = '#e5e7eb'
                    }, 0);
                }} />
                <div className='cursor-pointer font-bold scale-110'>
                    <Speech id={_id} text={`The tag is ${tag}. The title is ${title}. The description is ${description}.`} startBtn={<GrVolume />} stopBtn={<GrVolumeMute />} />
                </div>
            </div>
            <p className='text-2xs text-gray-600 self-end'>Last Updated: {showDate}</p>
        </div>
    </div>
}
