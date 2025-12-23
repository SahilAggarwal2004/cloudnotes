import { useState, useContext, createContext, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

import { defaults, newNotesKey, queryKey, tagColorsKey, timeouts } from "../constants";
import useStorage from "../hooks/useStorage";
import { useStorageListener } from "../hooks/useStorageListener";
import { deleteLocalNote, hasActiveDraft } from "../lib/notes";
import { clearStorage, getStorage, removeStorage, setStorage } from "../lib/storage";

// Below is the boiler plate(basic structure) for the function to be created inside which we will pass some value (can be state or a function to update the state or anything else):
// const Function = (props) => {
//     const value = something
//     return (
//         <Context.Provider value={value}>
//             {props.children}
//         </Context.Provider>
//     )
// }

const { get: getTimeout, mutation: mutationTimeout } = timeouts;

axios.defaults.baseURL = process.env.NEXT_PUBLIC_HOST;

const dimensions = typeof screen !== "undefined" && screen.width + screen.height;

const NoteContext = createContext(); // creating a new context. In a context, we will add states related to a particular thing which we want to become accessible to all our components.
export const useNoteContext = () => useContext(NoteContext); // now the value that NoteContext.Provider provides has been stored inside this variable using useContext(Context)

export default function NoteProvider({ children, router }) {
  // props parameter will store every component(even their children components) which will be closed inside the tag of this function imported in a component(ideally that component will be App.js as it contains all the components and we usually want our context to be accessed by all components). All these components will be able to access our context using the useContext hook(useContext and the context we created are to be imported in the every component which needs to use the context).

  const client = useQueryClient();

  // Defining things to be stored in value below:
  const [authToken, setAuthToken, clearAuthToken] = useStorage("token");
  const [cachedNotes, setCachedNotes, clearCachedNotes] = useStorage(queryKey, []);
  const [lastSyncedAt, setLastSyncedAt, clearLastSyncedAt] = useStorage("lastSyncedAt");
  const newNotes = useStorageListener(newNotesKey, []);
  const [modal, setModal] = useState({ active: false });
  const [progress, setProgress] = useState(0);
  const [sidebar, setSidebar] = useState(false);

  const { data } = useQuery({
    queryKey,
    enabled: Boolean(authToken),
    queryFn: async () => {
      const notesToAdd = newNotes
        .filter((_id) => !hasActiveDraft(_id))
        .flatMap((_id) => {
          const localNote = getStorage(`local-${_id}`);
          return localNote ? [{ _id, ...localNote }] : [];
        });

      if (notesToAdd.length) {
        const { notes = null } = await fetchApp({
          url: "api/notes/add/bulk",
          method: "POST",
          body: { notes: notesToAdd },
          showToast: { success: false, error: true },
          onSuccess: ({ added = [] }) => {
            added.forEach(deleteLocalNote);
            toast.success(`${added.length} note(s) synced successfully!`);
          },
        });
        return notes;
      }

      const { notes = null } = await fetchApp({ url: `api/notes/fetch?lastSyncedAt=${lastSyncedAt}`, showToast: { success: false, error: true } });
      return notes;
    },
  });

  const notes = data || cachedNotes;
  const tags = useMemo(() => notes.reduce((arr, { tag }) => (arr.includes(tag) ? arr : arr.concat(tag)), []), [notes]);
  const tagColors = useStorageListener(tagColorsKey, {});

  const getTagColor = (tag) => tagColors[tag] || defaults.color;
  const setTagColor = (tag, color) => setStorage(tagColorsKey, { ...tagColors, [tag]: color });

  async function fetchApp({ url, method = "GET", body, token = authToken, showToast = { success: true, error: true }, onSuccess, onError }) {
    setProgress(33);
    let status, data;

    try {
      const response = await axios({ url, method, data: body, headers: { token, dimensions }, timeout: method === "GET" ? getTimeout : mutationTimeout });
      status = response.status;
      data = response.data;
      await onSuccess?.(data);
      if (showToast.success && data.msg) toast.success(data.msg);
      if (data.notes) {
        client.setQueryData(queryKey, data.notes);
        setCachedNotes(data.notes);
      }
      if (data.syncedAt) setLastSyncedAt(data.syncedAt);
    } catch (error) {
      const isNetworkError = !error.response;
      status = error.response?.status ?? 500;
      data = error.response?.data || {
        success: false,
        error: isNetworkError ? "Network error. Please check your internet connection." : "Something went wrong. Please try again.",
      };
      await onError?.(data.error);
      const authenticationError = data.error.toLowerCase().includes("session expired");
      if (authenticationError) {
        resetStorage();
        router.replace("/account/login");
      }
      if (showToast.error || authenticationError) toast.error(data.error);
    } finally {
      setProgress(100);
    }

    return { status, ...data };
  }

  function resetQueryParam(parameter) {
    const { [parameter]: removed, ...rest } = router.query;
    router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
  }

  function resetStorage() {
    client.clear();
    clearAuthToken();
    clearCachedNotes();
    clearLastSyncedAt();
    removeStorage("name");
    clearStorage("local", true);
    clearStorage("", false);
  }

  useEffect(() => {
    if (data) setCachedNotes(data);
  }, [data]);

  useEffect(() => {
    if (router.pathname !== "/note/[noteId]") setSidebar(false);
  }, [router.pathname]);

  // Context.Provider provides the context to the components using useContext().
  // value attribute stores the value(can be anything) to be passed to the components using the context.
  return (
    <NoteContext.Provider
      value={{
        fetchApp,
        getTagColor,
        lastSyncedAt,
        modal,
        newNotes,
        notes,
        progress,
        resetQueryParam,
        resetStorage,
        setAuthToken,
        setModal,
        setProgress,
        setSidebar,
        setTagColor,
        sidebar,
        tags,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
