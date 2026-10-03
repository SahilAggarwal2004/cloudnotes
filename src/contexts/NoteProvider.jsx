/* eslint-disable react-hooks/exhaustive-deps */
import { use, useState, createContext, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { defaults, newNotesKey, queryKey, tagColorsKey, timeouts } from "../constants";
import useModal from "../hooks/useModal";
import useStorage from "../hooks/useStorage";
import { useStorageListener } from "../hooks/useStorageListener";
import { errors, gatewayStatuses, getApiServerOrder, isTimeout } from "../lib/api";
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
  const { modal, openModal, closeModal } = useModal();
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

    let result = errors.network; // Also what the caller gets when no API server is configured.

    try {
      const explicitEmail = typeof body?.email === "string" ? body.email : null;
      const email = explicitEmail || getStorage("user")?.email;

      // An explicitly supplied email gets its own deterministic server.
      // Otherwise, reuse the server from this browser session when available.
      const servers = getApiServerOrder({
        key: email?.trim().toLowerCase(),
        preferredUrl: explicitEmail ? undefined : getStorage("apiServer", null, false)?.url,
      });

      const path = url.replace(/^\/+/, "");
      const isGet = method === "GET";

      for (const server of servers) {
        let response;

        try {
          response = await fetch(`${server}/${path}`, {
            method,
            headers: { "Content-Type": "application/json", token, dimensions },
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(isGet ? getTimeout : mutationTimeout),
          });
        } catch (error) {
          const timedOut = isTimeout(error);
          result = timedOut ? errors.timeout : errors.network;

          // A GET can always try the next server. A mutation can only do so when the request never
          // got through (connection refused, DNS failure, ...). After a timeout it may have been
          // applied, and repeating it elsewhere could duplicate it.
          if (isGet || !timedOut) continue;
          break;
        }

        const responseData = await response.json().catch(() => null);
        const fromApi = Boolean(responseData) && typeof responseData === "object";
        result = fromApi ? responseData : errors.server;

        // Safe to try the next server:
        // - GET: on any server error or non-API response, since nothing is mutated.
        // - Mutation: only on a gateway response from the platform (see gatewayStatuses). An error
        //   reported by our own API (even a 500) may have been partially applied, so it is final.
        const retry = fromApi ? isGet && response.status >= 500 : isGet || gatewayStatuses.includes(response.status);
        if (retry) continue;

        // Remember the server that answered, even if it answered with an error such as 401 or 409.
        if (fromApi) setStorage("apiServer", { url: server }, false);
        break;
      }

      if (result.success) {
        await onSuccess?.(result);

        if (showToast.success && result.message) {
          toast.success(result.message);
        }
      } else {
        const errorObj = result.error;

        await onError?.(errorObj);

        if (errorObj) {
          const authenticationError = errorObj.type === "authentication";

          if (authenticationError) {
            resetStorage();
            router.replace("/account/login");
          }

          if (showToast.error || authenticationError) {
            toast.error(errorObj.message);
          }
        }
      }
    } finally {
      if (result.notes) {
        client.setQueryData(queryKey, result.notes);
        setCachedNotes(result.notes);
      }

      if (result.syncedAt) setLastSyncedAt(result.syncedAt);

      setProgress(100);
    }

    return result;
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
    removeStorage("user");
    clearStorage("local", true);
    clearStorage("", false);
  }

  useEffect(() => {
    if (data) setCachedNotes(data);
  }, [data]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebar(false);
  }, [router.pathname]);

  return (
    <NoteContext
      value={{
        closeModal,
        fetchApi,
        getTagColor,
        modal,
        newNotes,
        notes,
        openModal,
        progress,
        resetQueryParam,
        resetStorage,
        setAuthToken,
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
