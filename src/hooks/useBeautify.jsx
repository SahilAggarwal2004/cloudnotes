import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { charLimit } from "../constants";
import { useNoteContext } from "../contexts/NoteProvider";

const {
  note: {
    description: { max: maxDescription },
  },
} = charLimit;

export default function useBeautify(note) {
  const { _id, description, updatedAt } = note;
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

  const handleAcceptBeautify = async () => {
    const beautifiedText = completion.slice(0, maxDescription);
    const { success } = await fetchApp({
      url: `api/notes/update/${_id}`,
      method: "PUT",
      body: { description: beautifiedText, lastUpdatedAt: updatedAt },
    });
    if (success) {
      toast.success("Note beautified successfully!");
      cancelBeautify();
    }
  };

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
