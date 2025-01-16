/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { toast } from "react-toastify";
import { useNoteContext } from "../contexts/NoteProvider";
import { infinity, unitDurations } from "../constants";

export default function Modal({ router }) {
  const {
    fetchApp,
    modal: { active, type, ...props },
    resetStorage,
    setModal,
  } = useNoteContext();
  const [shareDuration, setShareDuration] = useState(infinity);
  const [durationType, setDurationType] = useState("minute");
  const isDurationInfinite = shareDuration === infinity;

  const closeModal = () => setModal({ active: false });

  async function deleteUser() {
    closeModal();
    await fetchApp({ url: "api/auth/delete", method: "DELETE" });
    resetStorage();
    router.replace("/account/signup");
  }

  async function deleteNote() {
    closeModal();
    await fetchApp({ url: `api/notes/delete/${props.note}`, method: "DELETE" });
  }

  async function undoNote() {
    closeModal();
    await fetchApp({ url: `api/notes/undo/${props.note}`, method: "PUT", body: { lastUpdatedAt: props.updatedAt } });
  }

  async function shareNote(event) {
    event.preventDefault();
    toast
      .promise(
        async () => {
          const { success } = await fetchApp({
            url: `api/notes/share/${props.note}`,
            method: "POST",
            body: { share: Date.now() + shareDuration * unitDurations[durationType] },
            showToast: false,
          });
          if (!success) throw new Error();
          const data = { url: `${window.location.origin}/share/${props.note}` };
          navigator.clipboard.writeText(data.url);
          if (navigator.canShare?.(data) && navigator.userAgentData?.mobile) navigator.share(data);
        },
        { pending: "Generating URL...", success: "URL copied to clipboard", error: "Something went wrong" },
      )
      .catch(() => {})
      .finally(closeModal);
  }

  return (
    <div>
      <div className={`fixed inset-0 z-50 bg-black transition-all duration-700 ${active ? "bg-opacity-50" : "invisible bg-opacity-0"}`} onClick={closeModal} />
      <div
        className={`fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 bg-white text-center ${active ? "opacity-100" : "hidden"} rounded-md p-4 ${type === "edit" ? "w-4/5" : "w-max"}`}
      >
        {type === "deleteUser" ? (
          <div>
            <h3 className="font-bold">Delete Account?</h3>
            <p className="pb-2 text-sm text-red-600">This action is irreversible</p>
            <div className="space-x-2">
              <button className="btn" onClick={deleteUser}>
                Yes
              </button>
              <button className="btn" onClick={closeModal}>
                No
              </button>
            </div>
          </div>
        ) : type === "deleteNote" ? (
          <div>
            <h3 className="font-bold">Delete Note?</h3>
            <p className="pb-2 text-sm text-red-600">This action is irreversible</p>
            <div className="space-x-2">
              <button className="btn" onClick={deleteNote}>
                Yes
              </button>
              <button className="btn" onClick={closeModal}>
                No
              </button>
            </div>
          </div>
        ) : type === "undoNote" ? (
          <div>
            <h3 className="font-bold">Undo Note?</h3>
            <p className="pb-2 text-sm">This will revert the note to its previous state</p>
            <div className="space-x-2">
              <button className="btn" onClick={undoNote}>
                Yes
              </button>
              <button className="btn" onClick={closeModal}>
                No
              </button>
            </div>
          </div>
        ) : (
          type === "shareNote" && (
            <form className="space-y-3" onSubmit={shareNote}>
              <h3 className="text-lg font-bold">Share Options</h3>
              <div className="flex items-center">
                <input
                  id="checked-checkbox"
                  type="checkbox"
                  checked={!isDurationInfinite}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 accent-purple-600 focus:ring-2 focus:ring-purple-500"
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
          )
        )}
      </div>
    </div>
  );
}
