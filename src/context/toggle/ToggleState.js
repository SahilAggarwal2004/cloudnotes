import React, { useState, useRef } from "react";
import ToggleContext from "./ToggleContext";

const ToggleState = (props) => {
    const [alert, setAlert] = useState(['&#8205;', '', false]);
    const [modal, setModal] = useState([{}, false, '']);
    const [loadbar, setLoadbar] = useState([0, false]);
    const [spinner, setSpinner] = useState(true);
    const [selTag, setSelTag] = useState('All');
    const [newNote, setNewNote] = useState(false);
    const [hide, setHide] = useState(true);
    const searchBar = useRef();

    function showAlert(msg, color) {
        setAlert([msg, color, Boolean(msg)])
        setTimeout(() => {
            setAlert(['&#8205;', '', false])
        }, 2000);
    }

    return (
        <ToggleContext.Provider value={{ alert, showAlert, modal, setModal, loadbar, setLoadbar, spinner, setSpinner, selTag, setSelTag, searchBar, newNote, setNewNote, hide, setHide }}>
            {props.children}
        </ToggleContext.Provider>
    )
}

export default ToggleState;