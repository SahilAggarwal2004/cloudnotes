import { useState, useContext, createContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { setStorage, getStorage, resetStorage } from "../modules/storage";
import { queryKey } from "../constants";

// Below is the boiler plate(basic structure) for the function to be created inside which we will pass some value (can be state or a function to update the state or anything else):
// const Function = (props) => {
//     const value = something
//     return (
//         <Context.Provider value={value}>
//             {props.children}
//         </Context.Provider>
//     )
// }

axios.defaults.baseURL = process.env.NEXT_PUBLIC_HOST;

const dimensions = typeof screen !== "undefined" && screen.width + screen.height;

const NoteContext = createContext(); // creating a new context. In a context, we will add states related to a particular thing which we want to become accessible to all our components.
export const useNoteContext = () => useContext(NoteContext); // now the value that NoteContext.Provider provides has been stored inside this variable using useContext(Context)

export default function NoteProvider({ children, router }) {
  // props parameter will store every component(even their children components) which will be closed inside the tag of this function imported in a component(ideally that component will be App.js as it contains all the components and we usually want our context to be accessed by all components). All these components will be able to access our context using the useContext hook(useContext and the context we created are to be imported in the every component which needs to use the context).

  const client = useQueryClient();

  // Defining things to be stored in value below:
  const [modal, setModal] = useState({ active: false });
  const [progress, setProgress] = useState(0);

  async function fetchApp({ url, method = "GET", body, token = getStorage("token"), showToast = true }) {
    // Previously we saw that how we can fetch some data using fetch(url) but fetch method has a second optional parameter which is an object which takes some other values for fetching the data.
    setProgress(33);
    try {
      var { data } = await axios({ url, method, data: body, headers: { token, dimensions } });
      if (showToast) toast.success(data.msg);
      if (url.startsWith("api/notes/")) {
        client.setQueryData(queryKey, data.notes);
        setStorage(queryKey, data.notes);
      }
    } catch (error) {
      data = error.response?.data || { success: false, error: "Server Down! Please try again later..." };
      const authenticationError = data.error.toLowerCase().includes("session expired");
      if (authenticationError) {
        resetStorage();
        router.replace("/account/login");
      }
      if (showToast || authenticationError) toast.error(data.error);
    }
    setProgress(100);
    return data;
  }

  // Context.Provider provides the context to the components using useContext().
  // value attribute stores the value(can be anything) to be passed to the components using the context.
  return <NoteContext.Provider value={{ fetchApp, modal, setModal, progress, setProgress }}>{children}</NoteContext.Provider>;
}
