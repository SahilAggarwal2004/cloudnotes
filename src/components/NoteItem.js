/* eslint-disable react-hooks/exhaustive-deps */
import Speech, { HighlightedText } from 'react-text-to-speech';
import { useLayoutEffect, useRef, useState } from 'react';
import { FaRegTrashAlt, FaRegEdit, FaRegSave } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6';
import { GrVolume, GrVolumeMute } from 'react-icons/gr';
import { useNoteContext } from '../contexts/NoteProvider';

export default function NoteItem({ note: { _id, description, updatedAt, tag, title }, getTagColor, setTagColor, children }) {
    const { fetchApp, setModal, progress, setProgress } = useNoteContext()
    const tagColor = getTagColor(tag)
    const [edit, setEdit] = useState(false)
    const editTitleRef = useRef()
    const [editDescription, setEditDescription] = useState()
    const editTagRef = useRef()
    const [editTagColor, setEditTagColor] = useState()

    const text = <>
        <div className='bg-gray-200 rounded-2xl absolute top-0 translate-y-[-50%] text-xs text-black px-2 py-px border' style={{ backgroundColor: tagColor }}>
            <span className='hidden'>The tag is</span>
            {tag}
        </div>
        <div className='flex items-center justify-center w-full relative'>
            <h3 className='text-lg text-bold px-4' style={{ wordBreak: 'break-word' }}>
                <span className='hidden'>. The title is</span>
                {title}
            </h3>
            <span className='absolute right-0'>{children}</span>
        </div>
        <hr className='w-full my-2' />
        <p className='text-sm text-gray-600 mb-10 whitespace-pre-line' style={{ wordBreak: 'break-word' }}>
            <span className='hidden'>. The description is</span>
            {description}
        </p>
    </>

    useLayoutEffect(() => {
        if (edit) return
        setEditDescription(description)
        setEditTagColor(tagColor)
    }, [edit])

    async function editNote(event) {
        event.preventDefault()
        const editTitle = editTitleRef.current.value
        const editTag = editTagRef.current.value || 'General'
        if (title === editTitle && description === editDescription && tag === editTag) setProgress(100)
        else var { success } = await fetchApp({ url: `api/notes/update/${_id}`, method: 'PUT', body: { title: editTitle, description: editDescription, tag: editTag } })
        if (success === false) return
        setEdit(false)
        setTagColor(editTag, editTagColor)
    }

    return <form className='flex flex-col items-center h-full border border-grey-600 rounded px-2 py-4 relative' onSubmit={editNote}>
        {edit ? <>
            <div className='absolute top-0 -translate-y-1/2 flex'>
                <input type='text' list='tagList' ref={editTagRef} className='bg-gray-200 text-xs text-center rounded-l-2xl text-black pl-1.5 sm:pl-2 py-px focus:outline-0 placeholder:text-gray-600' placeholder='Add tag' maxLength={12} defaultValue={tag} autoComplete='off' onChange={e => {
                    const tagColor = getTagColor(e.target.value, false)
                    if (tagColor) setEditTagColor(tagColor)
                }} />
                <input type='color' value={editTagColor} list='tag-colors' className='bg-gray-200 text-xs text-center rounded-r-2xl text-black focus:outline-0' onChange={e => setEditTagColor(e.target.value)} />
            </div>
            <div className='flex items-center justify-center w-full relative'>
                <input type='text' ref={editTitleRef} className='text-lg text-bold text-center w-full pl-1 pr-5 focus:outline-0 placeholder:text-gray-600' placeholder='Add title' required maxLength={20} defaultValue={title} />
                <span className='absolute right-0'>{children}</span>
            </div>
            <hr className='w-full my-2' />
            <textarea placeholder='Add description' rows='5' required maxLength={1000} className='text-sm text-center text-gray-600 mb-1 mx-2 w-full focus:outline-0' value={editDescription} onChange={e => setEditDescription(e.target.value)} />
            <div className='text-xs text-right w-full mb-10 pr-1'>{editDescription.length}/1000</div>
            <div className='space-x-4 absolute bottom-[1.375rem] flex'>
                <button className="cursor-pointer scale-110"><FaRegSave /></button>
                <FaXmark className="cursor-pointer scale-x-[1.2] scale-y-125" onClick={() => setEdit(false)} />
            </div>
        </> : <>
            <HighlightedText id={_id} className='flex flex-col items-center w-full'>{text}</HighlightedText>
            <div className='absolute bottom-1.5'>
                <div className='space-x-5 flex justify-center mb-1'>
                    <button type='button' className="scale-110 cursor-pointer disabled:opacity-60" disabled={progress} onClick={() => setModal({ active: true, type: 'deleteNote', note: _id })}>
                        <FaRegTrashAlt />
                    </button>
                    <button className="scale-125 cursor-pointer disabled:opacity-60" disabled={progress} onClick={() => setEdit(true)}>
                        <FaRegEdit />
                    </button>
                    <button type='button' className='cursor-pointer font-bold scale-110 disabled:opacity-60' disabled={progress}>
                        <Speech id={_id} text={text} useStopOverPause highlightText startBtn={<GrVolume />} stopBtn={<GrVolumeMute />} />
                    </button>
                </div>
                <p className='text-2xs text-gray-600 self-end'>Last Updated: {new Date(Date.parse(updatedAt)).toLocaleString()}</p>
            </div>
        </>}
    </form>
}
