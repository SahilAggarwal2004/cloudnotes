import axios from "axios";
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
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

    const { REACT_APP_HOST: host, REACT_APP_FETCH: fetchAPI, REACT_APP_ADD: addAPI, REACT_APP_DELETE: deleteAPI, REACT_APP_UPDATE: updateAPI } = process.env

    const { alert, showAlert, setLoadbar, setSpinner, setModal, setNewNote } = useContext(ToggleContext)

    // Defining things to be stored in value below:
    const [notes, setNotes] = useState([])
    const [show, setShow] = useState([]);
    const [search, setSearch] = useState('')
    const [noteToDelete, setNoteToDelete] = useState('');
    const [noteToEdit, setNoteToEdit] = useState([{}, false]);
    const tagColor = useRef();
    const editTagColor = useRef();
    const redirect = useNavigate();

    function searchNotes(searchData = notes) {
        const value = search.toLowerCase();
        if (!value) {
            setShow(searchData)
            return
        }
        let result = []
        searchData.forEach(note => {
            if (note.title.toLowerCase().includes(value) || note.description.toLowerCase().includes(value) || note.tag.toLowerCase().includes(value)) {
                result.push(note)
            }
        });
        setShow(result)
    }

    async function fetchApp(api, method = 'GET', body = null, token = null) {
        // Previously we saw that how we can fetch some data using fetch(url) but fetch method has a second optional parameter which is an object which takes some other values for fetching the data.
        let json = {};
        try {
            const fullAPI = host + api
            const authtoken = token || localStorage.getItem('token')
            const response = await axios({
                url: fullAPI,
                method: method, // takes the method, default is 'GET'
                headers: { // takes an object of headers
                    'auth-token': authtoken,
                    'Content-Type': 'application/json'
                },
                data: body // takes body
            })
            json = response.data;

            if (api === fetchAPI && json.success) localStorage.setItem('notes', JSON.stringify({ ...json, local: true }))
        } catch (error) {
            (api === fetchAPI) ? json = JSON.parse(localStorage.getItem('notes')) : json = error.response?.data;
            if (!json) json = { success: false, error: "Server Down! Please try again later..." }
        }
        return json
    }

    // Get notes
    async function getNotes(msg, color) {
        setLoadbar([1 / 3, true])
        let json;
        color ? json = await fetchApp(fetchAPI) : json = { success: false, error: msg }
        setLoadbar([1, true])
        setTimeout(() => {
            setLoadbar([0, false])
            setSpinner(false)
            if (!json.success) {
                showAlert(json.error, '')
                if (json.error.includes('authenticate')) {
                    localStorage.removeItem('name')
                    localStorage.removeItem('token')
                    localStorage.removeItem('notes')
                    redirect('/signup')
                }
                return
            }
            searchNotes(json.notes)
            mutate(host + fetchAPI, json, false)
            if (json.success && json.local) {
                color = ''
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
        setLoadbar([1 / 12, true])
        const json = await fetchApp(addAPI, 'POST', { title, description, tag })
        if (!json.success) {
            await getNotes(json.error, '')
            return
        }
        await getNotes('Note added!', 'green')
        setTimeout(() => {
            setNewNote(false)
            localStorage.setItem('tagColors', JSON.stringify({ ...JSON.parse(localStorage.getItem('tagColors')), [tag]: tagColor.current?.value }))
            tagColor.current.value = '#e5e7eb';
        }, 300);
    }

    // Delete a note
    async function deleteNote(id) {
        setNoteToDelete('')
        setModal([{}, false, ''])
        setLoadbar([1 / 12, true])
        const json = await fetchApp(`${deleteAPI}/${id}`, 'DELETE', {})
        if (!json.success) {
            await getNotes(json.error, '')
            return
        }
        await getNotes('Note deleted!', 'green')
    }

    // Edit a note
    async function editNote(note) {
        let { _id, title, description, tag, editTitle, editDescription } = note
        const editTag = note.editTag || 'General'
        if (title !== editTitle || description !== editDescription || tag !== editTag) {
            setLoadbar([1 / 12, true])
            const json = await fetchApp(`${updateAPI}/${_id}`, 'PUT', { title: editTitle, description: editDescription, tag: editTag })
            if (!json.success) {
                await getNotes(json.error, '')
                return
            }
            await getNotes('Note updated!', 'green')
            setTimeout(() => {
                setNoteToEdit([{}, false])
                localStorage.setItem('tagColors', JSON.stringify({ ...JSON.parse(localStorage.getItem('tagColors')), [editTag]: editTagColor.current?.value }))
            }, 300);
        } else {
            setLoadbar([1, true])
            setTimeout(() => {
                localStorage.setItem('tagColors', JSON.stringify({ ...JSON.parse(localStorage.getItem('tagColors')), [editTag]: editTagColor.current.value }))
                showAlert('Note updated!', 'green')
                setLoadbar([0, false])
                setNoteToEdit([{}, false])
            }, 300);
        }
    }

    return (
        // Context.Provider provides the context to the components using useContext().
        // value attribute stores the value(can be anything) to be passed to the components using the context.
        <NoteContext.Provider value={{ fetchApp, getNotes, addNote, deleteNote, editNote, show, setShow, noteToDelete, setNoteToDelete, noteToEdit, setNoteToEdit, tagColor, editTagColor, notes, setNotes, search, setSearch, searchNotes }}>
            {/* passing the notes and well as note functions(to perform operations on notes) as value in a js object */}
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;