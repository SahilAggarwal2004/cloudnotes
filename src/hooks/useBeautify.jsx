import { useCompletion } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { charLimit, queryKey } from "../constants";
import { useNoteContext } from "../contexts/NoteProvider";
import { getStorage, setStorage } from "../lib/storage";
import { deleteLocalNote, isNewNote } from "../lib/notes";

const {
  note: {
    description: { max: maxDescription },
  },
} = charLimit;

export default function useBeautify({ _id, title, description, tag, updatedAt }) {
  const client = useQueryClient();
  const router = useRouter();
  const { fetchApi } = useNoteContext();
  const [beautifyActive, setBeautifyActive] = useState(false);
  const beautifyContextRef = useRef({ retry: false });

  const handleError = () => {
    toast.error("Failed to beautify note. Please try again later.");
    if (!beautifyContextRef.current.retry) cancelBeautify();
  };

  const { completion, complete, isLoading, stop, error } = useCompletion({
    api: "/api/completion",
    onError: handleError,
  });
  const beautifiedText = completion.slice(0, maxDescription);

  function cancelBeautify() {
    beautifyContextRef.current.retry = false;
    stop();
    setBeautifyActive(false);
  }

  async function startBeautify(retry = false) {
    beautifyContextRef.current.retry = retry;
    if (!retry) setBeautifyActive(true);
    void complete(description);
  }

  async function handleAcceptBeautify({ save, sync }) {
    const newNote = isNewNote(_id);
    const localKey = `local-${_id}`;
    const localState = getStorage(localKey);
    if (save) setStorage(localKey, { _id, title, description: beautifiedText, tag, updatedAt });
    if (sync) {
      const { success, error, updatedAt } = await fetchApi({
        url: newNote ? "api/notes/add/bulk" : `api/notes/update/${_id}`,
        method: newNote ? "POST" : "PUT",
        body: newNote ? { notes: [localState] } : localState,
        onSuccess: () => deleteLocalNote(_id),
      });
      if (!success) {
        if (error?.type === "conflict") {
          if (Date.parse(updatedAt) > lastSyncedAt) await client.refetchQueries({ queryKey });
          router.push(`/note/${_id}?conflict=true`);
        }
        return;
      }
    }
    cancelBeautify();
  }

  return {
    beautifyActive,
    beautifiedText,
    isBeautifying: isLoading,
    hasError: Boolean(error),
    startBeautify,
    cancelBeautify,
    handleAcceptBeautify,
  };
}
