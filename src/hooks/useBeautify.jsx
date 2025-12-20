import { useCompletion } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
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

export default function useBeautify({ _id, title, description, tag }) {
  const client = useQueryClient();
  const router = useRouter();
  const { fetchApp } = useNoteContext();
  const [beautifyActive, setBeautifyActive] = useState(false);

  const handleError = () => toast.error("Failed to beautify note. Please try again later.");

  const { completion, complete, isLoading, stop, error } = useCompletion({
    api: "/api/completion",
    onError: handleError,
  });

  const cancelBeautify = () => {
    stop();
    setBeautifyActive(false);
  };

  const startBeautify = async (retry = false) => {
    if (!retry) setBeautifyActive(true);
    try {
      await complete(description);
    } catch (err) {
      handleError();
      if (!retry) cancelBeautify();
    }
  };

  async function handleAcceptBeautify({ save, sync }) {
    const newNote = isNewNote(_id);
    const localKey = `local-${_id}`;
    const localState = getStorage(localKey);
    const beautifiedText = completion.slice(0, maxDescription);
    if (save) setStorage(localKey, { _id, title, description: beautifiedText, tag, updatedAt });
    if (sync) {
      const { success, status, updatedAt } = await fetchApp({
        url: newNote ? "api/notes/add/bulk" : `api/notes/update/${_id}`,
        method: newNote ? "POST" : "PUT",
        body: newNote ? { notes: [localState] } : localState,
        onSuccess: () => deleteLocalNote(_id),
      });
      if (!success) {
        if (status === 409) {
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
    beautifiedText: completion.slice(0, maxDescription),
    isBeautifying: isLoading,
    hasError: Boolean(error),
    startBeautify,
    cancelBeautify,
    handleAcceptBeautify,
  };
}
