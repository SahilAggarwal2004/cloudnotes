import { useState, useContext, useRef, createContext } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { setStorage, getStorage, resetStorage } from "../modules/storage";
import { useToggleContext } from "./ToggleProvider";
import { queryKey } from "../constants";
import { useQueryClient } from "@tanstack/react-query";

// Below is the boiler plate(basic structure) for the function to be created inside which we will pass some value (can be state or a function to update the state or anything else):
// const Function = (props) => {
//     const value = something
//     return (
//         <Context.Provider value={value}>
//             {props.children}
//         </Context.Provider>
//     )
// }

axios.defaults.baseURL = process.env.NEXT_PUBLIC_HOST

const dimensions = typeof screen !== 'undefined' && screen.width + screen.height

const NoteContext = createContext(); // creating a new context. In a context, we will add states related to a particular thing which we want to become accessible to all our components.
export const useNoteContext = () => useContext(NoteContext); // now the value that NoteContext.Provider provides has been stored inside this variable using useContext(Context)

export default function NoteProvider({ children, router }) { // props parameter will store every component(even their children components) which will be closed inside the tag of this function imported in a component(ideally that component will be App.js as it contains all the components and we usually want our context to be accessed by all components). All these components will be able to access our context using the useContext hook(useContext and the context we created are to be imported in the every component which needs to use the context).

    const client = useQueryClient();
    const { setProgress, setSpinner, setModal, setNewNote } = useToggleContext()

    // Defining things to be stored in value below:
    const [noteToDelete, setNoteToDelete] = useState('');
    const [noteToEdit, setNoteToEdit] = useState([{}, false]);
    const tagColor = useRef();
    const editTagColor = useRef();

    async function fetchApp(api, method = 'GET', body = null, token) {
        // Previously we saw that how we can fetch some data using fetch(url) but fetch method has a second optional parameter which is an object which takes some other values for fetching the data.
        let json = {};
        try {
            const response = await axios({
                url: api,
                method: method, // takes the method, default is 'GET'
                headers: { token: token || getStorage('token'), dimensions, 'Content-Type': 'application/json' }, // takes an object of headers
                data: body // takes body
            })
            json = response.data;
        } catch (error) {
            json = error.response?.data;
            if (!json) json = { success: false, error: "Server Down! Please try again later..." }
            toast.error(json.error)
            if (json.error.toLowerCase().includes('session expired')) {
                resetStorage()
                router.replace('/account/login')
            }
        }
        return json
    }

    function updateNotes({ success, notes, msg, local }) {
        const color = (!success || local) ? '' : 'green'
        setSpinner(false)
        if (!success) return
        client.setQueryData(queryKey, notes)
        setStorage(queryKey, notes)
        if (success && local) {
            if (msg?.includes('added')) msg = "Server Down! Couldn't add note!"
            else if (msg?.includes('deleted')) msg = "Server Down! Couldn't delete note!"
            else if (msg?.includes('updated')) msg = "Server Down! Couldn't update note!"
            else msg = undefined
        }
        if (color === 'green') toast.success(msg)
        else toast.error(msg)
    }

    // Add a note
    async function addNote(title, description, tag) {
        setProgress(33)
        const json = await fetchApp('api/notes/add', 'POST', { title, description, tag })
        setProgress(100)
        updateNotes(json)
        if (!json.success) return
        setNewNote(false)
        setStorage('tagColors', { ...getStorage('tagColors'), [tag]: tagColor.current?.value })
        tagColor.current.value = '#e5e7eb';
    }

    // Delete a note
    async function deleteNote(id) {
        setProgress(33)
        setModal({ active: false })
        setNoteToDelete('')
        const json = await fetchApp(`api/notes/delete/${id}`, 'DELETE', {})
        setProgress(100)
        updateNotes(json)
    }

    // Edit a note
    async function editNote(note) {
        const { _id, title, description, tag, editTitle, editDescription } = note
        const editTag = note.editTag || 'General'
        if (title !== editTitle || description !== editDescription || tag !== editTag) {
            setProgress(33)
            const json = await fetchApp(`api/notes/update/${_id}`, 'PUT', { title: editTitle, description: editDescription, tag: editTag })
            setProgress(100)
            updateNotes(json)
            if (!json.success) return
            setNoteToEdit([{}, false])
            setStorage('tagColors', { ...getStorage('tagColors'), [editTag]: editTagColor.current?.value })
        } else {
            setProgress(100)
            setStorage('tagColors', { ...getStorage('tagColors'), [editTag]: editTagColor.current?.value })
            toast.success('Note updated!')
            setNoteToEdit([{}, false])
        }
    }

    async function queryFn() {
        setProgress(33)
        const { data: { notes } } = await axios('api/notes/fetch', { headers: { token: getStorage('token'), dimensions, 'Content-Type': 'application/json' } })
        setProgress(100)
        setSpinner(false)
        return notes
    }

    function onError(error) {
        setProgress(100)
        const json = error.response?.data;
        if (json?.error?.toLowerCase().includes('session expired')) {
            toast.error(json.error)
            resetStorage();
            router.replace('/account/login')
        } else setSpinner(false)
    }

    // Context.Provider provides the context to the components using useContext().
    // value attribute stores the value(can be anything) to be passed to the components using the context.
    return <NoteContext.Provider value={{ fetchApp, addNote, deleteNote, editNote, noteToDelete, setNoteToDelete, noteToEdit, setNoteToEdit, tagColor, editTagColor, queryFn, onError }}>
        {/* passing the notes and well as note functions(to perform operations on notes) as value in a js object */}
        {children}
    </NoteContext.Provider>
}