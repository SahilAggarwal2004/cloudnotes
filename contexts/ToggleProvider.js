import { createContext, useContext, useState } from "react";

const ToggleContext = createContext();
export const useToggleContext = () => useContext(ToggleContext)

export default function ToggleProvider(props) {
    const [modal, setModal] = useState([{}, false, '']);
    const [progress, setProgress] = useState(0);
    const [spinner, setSpinner] = useState(true);
    const [newNote, setNewNote] = useState(false);
    const [hide, setHide] = useState(true);

    return <ToggleContext.Provider value={{ modal, setModal, progress, setProgress, spinner, setSpinner, newNote, setNewNote, hide, setHide }}>
        {props.children}
    </ToggleContext.Provider>
}