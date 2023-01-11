import axios from "axios";
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import { setStorage, getStorage, resetStorage } from "../../modules/storage";
import ToggleContext from "../toggle/ToggleContext";
import NoteContext from "./NoteContext"; // importing our context to add the state in it

// Below is the boiler plate(basic structure) for the function to be created inside which we will pass some value (can be state or a function to update the state or anything else):
// const Function = (props) => {
//     const value = something
//     return (
//         <Context.Provider value={value}>
//             {props.children}
//         </Context.Provider>
//     )
// }

const NoteState = (props) => { // props parameter will store every component(even their children components) which will be closed inside the tag of this function imported in a component(ideally that component will be App.js as it contains all the components and we usually want our context to be accessed by all components). All these components will be able to access our context using the useContext hook(useContext and the context we created are to be imported in the every component which needs to use the context).

    axios.defaults.baseURL = process.env.REACT_APP_HOST
    const { REACT_APP_FETCH: fetchAPI, REACT_APP_ADD: addAPI, REACT_APP_DELETE: deleteAPI, REACT_APP_UPDATE: updateAPI } = process.env

    const { alert, showAlert, setLoadbar, setSpinner, setModal, setNewNote } = useContext(ToggleContext)

    // Defining things to be stored in value below:
    const [notes, setNotes] = useState([])
    const [noteToDelete, setNoteToDelete] = useState('');
    const [noteToEdit, setNoteToEdit] = useState([{}, false]);
    const tagColor = useRef();
    const editTagColor = useRef();
    const redirect = useNavigate();

    async function fetchApp(api, method = 'GET', body = null, authtoken) {
        // Previously we saw that how we can fetch some data using fetch(url) but fetch method has a second optional parameter which is an object which takes some other values for fetching the data.
        let json = {};
        try {
            const response = await axios({
                url: api,
                method: method, // takes the method, default is 'GET'
                withCredentials: true,
                headers: { authtoken, csrf: getStorage('csrf'), 'Content-Type': 'application/json' }, // takes an object of headers
                data: body // takes body
            })
            json = response.data;

            if (api === fetchAPI && json.success) setStorage('notes', { ...json, local: true })
        } catch (error) {
            json = api === fetchAPI ? getStorage('notes') : error.response?.data;
            if (!json) json = { success: false, error: "Server Down! Please try again later..." }
            showAlert(json.error, '')
            if (json.error.includes('authenticate')) {
                resetStorage()
                mutate(fetchAPI, [], false)
                setNotes([])
                redirect('/signup')
            }
        }
        return json
    }

    function updateNotes(json) {
        let { success, notes, msg, local } = json
        let color = !success ? '' : local ? '' : 'green'
        setTimeout(() => {
            setLoadbar([0, false])
            setSpinner(false)
            if (!success) return
            setNotes(notes)
            if (success && local) {
                if (msg?.includes('added')) msg = "Server Down! Couldn't add note!"
                else if (msg?.includes('deleted')) msg = "Server Down! Couldn't delete note!"
                else if (msg?.includes('updated')) msg = "Server Down! Couldn't update note!"
                else msg = undefined
            }
            if (!alert[2]) showAlert(msg, color);
        }, 300);
    }

    // Add a note
    async function addNote(title, description, tag) {
        setLoadbar([1 / 3, true])
        const json = await fetchApp(addAPI, 'POST', { title, description, tag })
        setLoadbar([1, true])
        updateNotes(json)
        if (!json.success) return
        setTimeout(() => {
            setNewNote(false)
            setStorage('tagColors', { ...getStorage('tagColors'), [tag]: tagColor.current?.value })
            tagColor.current.value = '#e5e7eb';
        }, 300);
    }

    // Delete a note
    async function deleteNote(id) {
        setNoteToDelete('')
        setModal([{}, false, ''])
        setLoadbar([1 / 3, true])
        const json = await fetchApp(`${deleteAPI}/${id}`, 'DELETE', {})
        setLoadbar([1, true])
        updateNotes(json)
    }

    // Edit a note
    async function editNote(note) {
        const { _id, title, description, tag, editTitle, editDescription } = note
        const editTag = note.editTag || 'General'
        if (title !== editTitle || description !== editDescription || tag !== editTag) {
            setLoadbar([1 / 3, true])
            const json = await fetchApp(`${updateAPI}/${_id}`, 'PUT', { title: editTitle, description: editDescription, tag: editTag })
            setLoadbar([1, true])
            updateNotes(json)
            if (!json.success) return
            setTimeout(() => {
                setNoteToEdit([{}, false])
                setStorage('tagColors', { ...getStorage('tagColors'), [editTag]: editTagColor.current?.value })
            }, 300);
        } else {
            setLoadbar([1, true])
            setTimeout(() => {
                setStorage('tagColors', { ...getStorage('tagColors'), [editTag]: editTagColor.current?.value })
                showAlert('Note updated!', 'green')
                setLoadbar([0, false])
                setNoteToEdit([{}, false])
            }, 300);
        }
    }

    // Context.Provider provides the context to the components using useContext().
    // value attribute stores the value(can be anything) to be passed to the components using the context.
    return <NoteContext.Provider value={{ fetchApp, addNote, deleteNote, editNote, noteToDelete, setNoteToDelete, noteToEdit, setNoteToEdit, tagColor, editTagColor, notes, setNotes, fetchAPI }}>
        {/* passing the notes and well as note functions(to perform operations on notes) as value in a js object */}
        {props.children}
    </NoteContext.Provider>
}

export default NoteState;