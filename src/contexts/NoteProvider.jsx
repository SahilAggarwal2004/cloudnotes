/* eslint-disable react-hooks/exhaustive-deps */
import { use, useState, createContext, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { apiUrl, defaults, newNotesKey, queryKey, tagColorsKey, timeouts } from "../constants";
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

const dimensions = typeof screen !== "undefined" && screen.width + screen.height;

const NoteContext = createContext(); // creating a new context. In a context, we will add states related to a particular thing which we want to become accessible to all our components.
export const useNoteContext = () => use(NoteContext);

export default function NoteProvider({ children, router }) {
  const client = useQueryClient();

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
        const { notes = null } = await fetchApi({
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

      const { notes = null } = await fetchApi({ url: `api/notes/fetch?lastSyncedAt=${lastSyncedAt}`, showToast: { success: false, error: true } });
      return notes;
    },
  });

  const notes = useMemo(() => data || cachedNotes, [data]);
  const tags = useMemo(() => notes.reduce((arr, { tag }) => (arr.includes(tag) ? arr : arr.concat(tag)), []), [notes]);
  const tagColors = useStorageListener(tagColorsKey, {});

  const getTagColor = (tag) => tagColors[tag] || defaults.color;
  const setTagColor = (tag, color) => setStorage(tagColorsKey, { ...tagColors, [tag]: color });

  async function fetchApi({ url, method = "GET", body, token = authToken, showToast = { success: true, error: true }, onSuccess, onError }) {
    setProgress(33);

    let data;

    try {
      const response = await fetch(`${apiUrl}${url}`, {
        method,
        headers: { "Content-Type": "application/json", token, dimensions },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(method === "GET" ? getTimeout : mutationTimeout),
      });
      data = await response.json();
      if (!data.success) throw data;
      await onSuccess?.(data);
      if (showToast.success && data.message) toast.success(data.message);
      if (data.notes) {
        client.setQueryData(queryKey, data.notes);
        setCachedNotes(data.notes);
      }
      if (data.syncedAt) setLastSyncedAt(data.syncedAt);
    } catch (error) {
      if (error?.error) data = error;
      else if (error?.name === "AbortError") data = { success: false, error: { type: "timeout", message: "Request timed out. Please try again." } };
      else data = { success: false, error: { type: "network", message: "Network error. Please check your internet connection." } };
      await onError?.(data.error);
      const authenticationError = data.error?.type === "authentication";
      if (authenticationError) {
        resetStorage();
        router.replace("/account/login");
      }
      if (showToast.error || authenticationError) toast.error(data.error?.message);
    } finally {
      setProgress(100);
    }

    return data;
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

  return (
    <NoteContext
      value={{
        fetchApi,
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
    </NoteContext>
  );
}
