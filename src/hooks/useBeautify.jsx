import { useCompletion } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { charLimit, queryKey } from "../constants";
import { useNoteContext } from "../contexts/NoteProvider";
import { getStorage, removeStorage, setStorage } from "../modules/storage";

const {
  note: {
    description: { max: maxDescription },
  },
} = charLimit;

export default function useBeautify({ _id, title, description, tag, updatedAt }) {
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
    const beautifiedText = completion.slice(0, maxDescription);
    const editKey = `edit${_id}`;
    if (save) setStorage(editKey, { title, description: beautifiedText, tag, updatedAt });
    if (sync) {
      const { success, status, updatedAt } = await fetchApp({
        url: `api/notes/update/${_id}`,
        method: "PUT",
        body: getStorage(editKey),
        showToast: false,
      });
      if (!success) {
        if (status === 409) {
          if (Date.parse(updatedAt) > lastSyncedAt) await client.refetchQueries({ queryKey });
          router.push(`/note/${_id}?conflict=true`);
        }
        return;
      }
      toast.success("Note beautified successfully!");
      removeStorage(editKey);
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
