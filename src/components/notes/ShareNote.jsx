import { useState } from "react";
import { toast } from "react-toastify";
import { infinity, unitDurations } from "../../constants";
import { useNoteContext } from "../../contexts/NoteProvider";

export default function ShareNote({ id }) {
  const { closeModal, fetchApi } = useNoteContext();
  const [shareDuration, setShareDuration] = useState(infinity);
  const [durationType, setDurationType] = useState("minute");
  const isDurationInfinite = shareDuration === infinity;

  async function shareNote(event) {
    event.preventDefault();
    toast
      .promise(
        async () => {
          const { success } = await fetchApi({
            url: `api/notes/share/${id}`,
            method: "POST",
            body: { share: Date.now() + shareDuration * unitDurations[durationType] },
            showToast: { success: false, error: false },
          });
          if (!success) throw new Error();
          const data = { url: `${window.location.origin}/share/${id}` };
          navigator.clipboard.writeText(data.url);
          if (navigator.canShare?.(data) && navigator.userAgentData?.mobile) navigator.share(data);
        },
        { pending: "Generating URL...", success: "URL copied to clipboard", error: "Uh Oh, Something went wrong!" },
      )
      .catch(() => {})
      .finally(closeModal);
  }

  return (
    <form className="space-y-3" onSubmit={shareNote}>
      <h3 className="text-lg font-bold">Share Options</h3>
      <div className="flex items-center">
        <input
          id="checked-checkbox"
          type="checkbox"
          checked={!isDurationInfinite}
          className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-purple-600 accent-purple-600 focus:ring-2 focus:ring-purple-500"
          onChange={() => setShareDuration(isDurationInfinite ? 1 : infinity)}
        />
        <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900">
          Share for limited time
        </label>
      </div>
      <div className="flex space-x-2 text-sm">
        <input
          type="number"
          defaultValue={isDurationInfinite ? 1 : shareDuration}
          disabled={isDurationInfinite}
          min={1}
          onChange={(e) => setShareDuration(e.target.value)}
          className="w-20 rounded-md border border-gray-300 px-2 py-1 disabled:opacity-60"
        />
        <div className="flex w-full flex-auto justify-evenly rounded-md border">
          <button
            type="button"
            disabled={isDurationInfinite}
            className={`w-full rounded-md px-2 py-1 disabled:opacity-60 ${durationType === "minute" ? "bg-purple-600 text-white" : "border-none"}`}
            onClick={() => setDurationType("minute")}
          >
            Minutes
          </button>
          <button
            type="button"
            disabled={isDurationInfinite}
            className={`w-full rounded-md px-2 py-1 disabled:opacity-60 ${durationType === "hour" ? "bg-purple-600 text-white" : "border-none"}`}
            onClick={() => setDurationType("hour")}
          >
            Hours
          </button>
          <button
            type="button"
            disabled={isDurationInfinite}
            className={`w-full rounded-md px-2 py-1 disabled:opacity-60 ${durationType === "day" ? "bg-purple-600 text-white" : "border-none"}`}
            onClick={() => setDurationType("day")}
          >
            Days
          </button>
        </div>
      </div>
      <div className="space-x-2">
        <button className="btn">Share</button>
        <button type="button" className="btn" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </form>
  );
}
