/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import { useEffect, useRef, useState, useMemo } from 'react'
import ReorderList, { ReorderIcon } from 'react-reorder-list';
import { FaPlus as FaPlusBold } from 'react-icons/fa'
import { FaPlus, FaXmark } from 'react-icons/fa6'
import { useQuery } from '@tanstack/react-query'
import NoteItem from '../components/NoteItem'
import { getStorage, setStorage } from '../modules/storage'
import { colors, defaultColor, queryKey } from '../constants'
import { useNoteContext } from '../contexts/NoteProvider';
import useURLState from '../hooks/useURLState';
import useTagColors from '../hooks/useTagColors'
import Loading from './Loading';

export default function Dashboard() {
    const { fetchApp, progress } = useNoteContext()
    const { getTagColor, setTagColor } = useTagColors()
    const [newNote, setNewNote] = useState(false)
    const titleRef = useRef();
    const [description, setDescription] = useState('');
    const tagRef = useRef();
    const [tagColor, setColor] = useState(defaultColor);
    const [selTag, setSelTag] = useState('');
    const [search, setSearch] = useURLState('search', '');

    const { data, isFetching } = useQuery({
        queryKey, queryFn: async () => {
            const { notes } = await fetchApp({ url: 'api/notes/fetch', showToast: false })
            return notes || null
        }
    })
    const notes = useMemo(() => {
        if (data) setStorage(queryKey, data)
        return data || getStorage(queryKey, [])
    }, [data])
    const tags = notes.reduce((arr, { tag }) => arr.includes(tag) ? arr : arr.concat(tag), []);
    const show = useMemo(() => {
        return (selTag ? notes.filter(({ tag }) => tag === selTag) : notes).filter(({ title, description, tag }) => [title, description, tag].join('~~').toLowerCase().includes(search))
    }, [notes, search, selTag])

    const disableReordering = progress || selTag || search

    useEffect(() => { if (newNote) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }, [newNote])

    async function addNote(event) {
        event.preventDefault()
        const tag = tagRef.current.value || 'General'
        const { success } = await fetchApp({ url: 'api/notes/add', method: 'POST', body: { title: titleRef.current.value, description, tag } })
        if (!success) return
        setNewNote(false)
        setTagColor(tag, tagColor)
    }

    async function handlePositionChange({ newItems, revert }) {
        const order = newItems.slice(0, -1).map(({ key }) => key)
        const { success } = await fetchApp({ url: 'api/notes/order', method: 'PUT', body: { order } })
        if (!success) revert()
    }

    return <>
        <Head><title>Dashboard | CloudNotes</title></Head>
        <div className='mb-12'>
            <div className='text-center py-4'>
                <div className='flex flex-col items-center justify-center sm:flex-row sm:justify-end sm:mx-5 sm:space-x-3'>
                    <input className='text-center border border-grey-600 px-1 my-1' placeholder='Search Notes' defaultValue={search} onChange={e => setSearch(e.target.value.toLowerCase())} />
                    <select className='w-min px-1 my-1 border border-grey-600' value={selTag} onChange={e => setSelTag(e.target.value)}>
                        <option key='All' value=''>All</option>
                        {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-10 m-5 items-center">
                    <span className='hidden sm:inline sm:col-span-2' />
                    <h2 className='text-xl font-bold col-span-5 sm:col-span-6 text-left sm:text-center'>Your Notes</h2>
                    <div className='text-right col-span-5 sm:col-span-2'>
                        Notes: <strong>{notes.length}</strong>/100
                    </div>
                </div>
                {show.length || newNote ? <ReorderList useOnlyIconToDrag watchChildrenUpdates preserveOrder={!isFetching} disabled={disableReordering} props={{ className: 'grid grid-cols-1 p-5 sm:grid-cols-2 normal:grid-cols-3 gap-x-5 gap-y-7' }} onPositionChange={handlePositionChange}>
                    {show.map(note => <NoteItem key={note._id} note={note} getTagColor={getTagColor} setTagColor={setTagColor}>
                        {!disableReordering && <ReorderIcon />}
                    </NoteItem>)}
                    {newNote && <form className='flex flex-col items-center border border-grey-600 rounded px-2 py-4 relative' onSubmit={addNote}>
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
                            <button className="cursor-pointer scale-110 font-bold disabled:opacity-60" disabled={isFetching}>
                                <FaPlus />
                            </button>
                            <FaXmark className="cursor-pointer scale-x-[1.2] scale-y-125" onClick={() => setNewNote(false)} />
                        </div>
                    </form>}
                </ReorderList> : isFetching ? <Loading /> : <h4 className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>No Notes To Display!</h4>}
            </div>
            <button className='z-20 fixed bottom-[2.625rem] right-[4vw] sm:right-[3vw] text-center py-3 px-4 rounded-full text-white bg-purple-700 cursor-pointer disabled:opacity-60' disabled={isFetching} onClick={() => setNewNote(true)}>
                <FaPlusBold className='scale-110' />
            </button>
        </div>
    </>
}