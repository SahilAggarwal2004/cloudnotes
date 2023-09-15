import React, { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteContext from '../context/notes/NoteContext'
import ToggleContext from '../context/toggle/ToggleContext'
import NoteItem from './NoteItem'
import { FaPlus as FaPlusBold, FaRegSave } from 'react-icons/fa'
import { FaPlus, FaXmark } from 'react-icons/fa6'
import useSWR, { mutate } from 'swr'
import { getStorage, resetStorage, setStorage } from '../modules/storage'

export default function Notes() {
    document.title = 'Dashboard | CloudNotes'

    const context = useContext(NoteContext) // now the value that NoteContext.Provider provides has been stored inside this variable using useContext(Context)
    const { addNote, noteToEdit, setNoteToEdit, editNote, tagColor, editTagColor, notes, setNotes, fetchAPI } = context // now our notes varibale that was stored in value can be accessed normally using as an object item as value of NoteContext was an object.
    const { showAlert, newNote, setNewNote, spinner, setSpinner, loadbar, setLoadbar } = useContext(ToggleContext)
    const redirect = useNavigate()
    const tags = ['All'];
    const title = useRef(); // defining a reference
    const description = useRef();
    const tag = useRef();
    const editTitle = useRef();
    const editDescription = useRef();
    const editTag = useRef();
    const [selTag, setSelTag] = useState('All');
    const [search, setSearch] = useState('');
    const [addDescLength, setAddDescLength] = useState(0);
    const [editDescLength, setEditDescLength] = useState(0);

    let fetchData;
    const { data, error, isValidating } = useSWR(fetchAPI)
    if (isValidating) fetchData = data?.notes || []
    else fetchData = data?.notes || getStorage('notes')?.notes || []

    const show = useMemo(() => notes.filter(({ title, description, tag }) => [title, description, tag].join('~~').toLowerCase().includes(search)), [notes, search])
    notes.forEach(note => { if (!tags.includes(note.tag)) tags.push(note.tag) });
    const showLength = (selTag === 'All' ? show : show.filter(({ tag }) => tag === selTag)).length

    useEffect(() => {
        if (getStorage('name')) {
            if (error && !isValidating) {
                let json = error.response?.data;
                if (json && !json.success && json.error?.toLowerCase().includes('session expired')) {
                    showAlert(json.error, '')
                    setLoadbar([0, false])
                    resetStorage();
                    mutate(fetchAPI, [], false)
                    setNotes([])
                    redirect('/signup')
                } else {
                    setLoadbar([1, true])
                    setTimeout(() => {
                        setLoadbar([0, false])
                        setSpinner(false)
                        setNotes(fetchData)
                    }, 300);
                }
            } else {
                if (!fetchData.length && isValidating) setLoadbar([1 / 3, true])
                else {
                    setLoadbar([1, true])
                    setStorage('notes', { ...data, local: true })
                    setTimeout(() => {
                        setLoadbar([0, false])
                        setSpinner(false)
                        setNotes(fetchData)
                    }, 300);
                }
            }
        } else redirect('/')
        return () => { setLoadbar([0, false]) } // equivalent to componentWillUnmount
        // eslint-disable-next-line
    }, [data, error]);

    useEffect(() => { if (newNote) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }, [newNote])

    function addNewNote() {
        setNewNote(true)
        setAddDescLength(0)
        title.current.value = ''
        description.current.value = ''
        tag.current.value = ''
    }

    function handleAdd() {
        // accessing ref data and performing functions (some are present in current and some outside current)
        if (title.current.value.length < 1) showAlert('Please provide title to the note', '')
        else if (description.current.value.length < 1) showAlert('Please provide description to the note', '')
        else if (!loadbar[1]) addNote(title.current.value, description.current.value, tag.current.value)
    }

    function handleEdit() {
        if (editTitle.current.value.length < 1) showAlert('Please provide title to the note', '')
        else if (editDescription.current.value.length < 1) showAlert('Please provide description to the note', '')
        else if (!loadbar[1]) editNote({ ...noteToEdit[0], editTitle: editTitle.current.value, editDescription: editDescription.current.value, editTag: editTag.current.value })
    }

    return <div className='mb-12'>
        <div className='text-center py-4'>
            <div className='flex flex-col items-center justify-center sm:flex-row sm:justify-end sm:mx-5 sm:space-x-3'>
                <input className='text-center border border-grey-600 my-1' placeholder='Search Notes' defaultValue={search} onChange={event => setSearch(event.target.value.toLowerCase())} />
                <select className='w-min px-1 my-1 border border-grey-600' defaultValue={selTag} onChange={(event) => { setSelTag(event.target.value) }}>
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
            <div className={`grid grid-cols-1 p-5 ${showLength === 0 && !newNote ? '' : 'sm:grid-cols-2 normal:grid-cols-3 gap-x-5 gap-y-7'}`}>

                <div className={`fixed top-[calc(50%-0.6875rem)] left-[calc(50%-0.6875rem)] w-[1.375rem] h-[1.375rem] border-2 border-transparent border-t-black border-b-black rounded-[50%] animate-spin-fast ${spinner ? '' : 'hidden'}`} />

                <h4 className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center ${showLength === 0 && !newNote && !spinner ? '' : 'hidden'}`}>No Notes To Display!</h4>

                {show.map(note => note._id !== noteToEdit[0]._id && (selTag === note.tag || selTag === 'All') ?
                    <NoteItem key={note._id} note={note} editTag={editTag} editTagColor={editTagColor} setEditDescLength={setEditDescLength} /> :
                    note._id === noteToEdit[0]._id && <div key={note._id} className={`flex flex-col items-center border border-grey-600 rounded px-2 py-4 relative ${noteToEdit[1] ? '' : 'hidden'}`} data-aos='fade-right' data-aos-once='true' data-aos-offset={20}>
                        <div className={`absolute top-0 translate-y-[-50%] flex`}>
                            <input type='text' list='tagList' ref={editTag} className={`bg-gray-200 text-xs text-center rounded-l-2xl text-black pl-1.5 sm:pl-2 py-px focus:outline-0 placeholder:text-gray-600`} placeholder='Add tag' maxLength={12} defaultValue={noteToEdit[0].tag} onChange={event => editTagColor.current.value = getStorage('tagColors')?.[event.target.value] || editTagColor.current.value} autoComplete='off' />
                            <input type='color' ref={editTagColor} list='tagColors' className={`bg-gray-200 text-xs text-center rounded-r-2xl text-black focus:outline-0`} defaultValue='#e5e7eb' />
                        </div>
                        <input type='text' ref={editTitle} className='text-lg text-bold text-center w-full focus:outline-0 placeholder:text-gray-600' placeholder='Add title' minLength={1} maxLength={20} defaultValue={noteToEdit[0].title} />
                        <hr className='w-full my-2' />
                        <textarea ref={editDescription} placeholder='Add description' rows='5' maxLength={1000} className='text-sm text-center text-gray-600 mb-1 mx-2 w-full focus:outline-0' defaultValue={noteToEdit[0].description} onChange={() => { setEditDescLength(editDescription.current.value.length) }} />
                        <div className='text-xs text-right w-full mb-10 pr-1'>{editDescLength}/1000</div>
                        <div className='space-x-4 absolute bottom-[1.375rem] flex'>
                            <FaRegSave className="cursor-pointer scale-110" onClick={handleEdit} />
                            <FaXmark className="cursor-pointer scale-x-[1.2] scale-y-125" onClick={() => setNoteToEdit([{}, false])} />
                        </div>
                    </div>
                )}
                <div className={`flex flex-col items-center border border-grey-600 rounded px-2 py-4 relative ${newNote && !spinner ? '' : 'hidden'}`}>
                    <div className={`absolute top-0 translate-y-[-50%] flex`}>
                        <input type='text' list='tagList' ref={tag} className={`bg-gray-200 text-xs text-center rounded-l-2xl text-black pl-1.5 sm:pl-2 py-px focus:outline-0 placeholder:text-gray-600`} placeholder='Add tag' maxLength={12} onChange={event => tagColor.current.value = getStorage('tagColors')?.[event.target.value] || tagColor.current.value} autoComplete='off' />
                        <datalist id='tagList'>
                            {tags.filter(tag => tag !== 'All').map(tag => <option key={tag} value={tag} />)}
                        </datalist>
                        <input type='color' ref={tagColor} list='tagColors' className={`bg-gray-200 text-xs text-center rounded-r-2xl text-black focus:outline-0`} defaultValue='#e5e7eb' />
                        <datalist id='tagColors'>
                            <option value='#e5e7eb' /><option value='#ffffff' />
                            <option value='#ff8080' /><option value='#ffaa80' />
                            <option value='#ffd480' /><option value='#ffff80' />
                            <option value='#d5ff80' /><option value='#aaff80' />
                            <option value='#80ff80' /><option value='#ffaa80' />
                            <option value='#80ffaa' /><option value='#80ffd4' />
                            <option value='#80ffff' /><option value='#80d4ff' />
                            <option value='#80aaff' /><option value='#8080ff' />
                            <option value='#aa80ff' /><option value='#d580ff' />
                            <option value='#ff80d5' /><option value='#ff80aa' />
                        </datalist>
                    </div>
                    <input type='text' ref={title} className='text-lg text-bold text-center w-full focus:outline-0 placeholder:text-gray-600' placeholder='Add title' minLength={1} maxLength={20} />
                    <hr className='w-full my-2' />
                    <textarea ref={description} placeholder='Add description' rows='5' maxLength={1000} className='text-sm text-center text-gray-600 mb-1 mx-2 w-full focus:outline-0' onChange={() => setAddDescLength(description.current.value.length)} />
                    <div className='text-xs text-right w-full mb-10 pr-1'>{addDescLength}/1000</div>
                    <div className='space-x-3 absolute bottom-[1.375rem] flex'>
                        <FaPlus className="cursor-pointer scale-110 font-bold" onClick={handleAdd} />
                        <FaXmark className="cursor-pointer scale-x-[1.2] scale-y-125" onClick={() => {
                            setNewNote(false)
                            tagColor.current.value = '#e5e7eb';
                        }} />
                    </div>
                </div>
            </div>
        </div>
        <div className='z-20 fixed bottom-[2.625rem] right-[4vw] sm:right-[3vw] text-center py-3 px-4 rounded-full text-white bg-purple-700 cursor-pointer' onClick={!spinner ? (newNote ? handleAdd : addNewNote) : null}>
            <FaPlusBold className='scale-110' />
        </div>
    </div>
}
