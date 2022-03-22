import { createContext } from "react";

const NoteContext = createContext(); // creating a new context. In a context, we will add states related to a particular thing which we want to become accessible to all our components.

export default NoteContext; // To add state to this context, we are reffering to some other file(here, NoteState.js) and for that we need to export our context.