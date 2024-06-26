/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { resetStorage } from "../modules/storage";
import { useNoteContext } from "../contexts/NoteProvider";

export default function Modal({ router }) {
  const client = useQueryClient();
  const {
    fetchApp,
    modal: { active, type, ...props },
    setModal,
    setProgress,
  } = useNoteContext();
  const closeModal = () => setModal({ active: false });

  async function logOut() {
    setProgress(100);
    setModal({ active: false });
    toast.success("Logged out successfully!");
    client.clear();
    resetStorage();
    router.replace("/account/login");
  }

  async function deleteUser() {
    setModal({ active: false });
    await fetchApp({ url: "api/auth/delete", method: "DELETE" });
    resetStorage();
    router.replace("/account/signup");
  }

  async function deleteNote() {
    setModal({ active: false });
    await fetchApp({ url: `api/notes/delete/${props.note}`, method: "DELETE" });
  }

  return (
    <div>
      <div className={`${active ? "bg-opacity-50" : "invisible bg-opacity-0"} fixed inset-0 z-40 bg-black transition-all duration-700`} onClick={closeModal} />
      <div className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white text-center ${active ? "opacity-100" : "hidden"} rounded-md p-4 ${type === "edit" ? "w-4/5" : "w-max"}`}>
        {type === "user" ? (
          <div>
            <h3 className="mb-2 text-lg font-semibold">Hi, {props.name}!</h3>
            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <button className="btn" onClick={logOut}>
                Log Out
              </button>
              <button className="btn" onClick={() => setModal({ active: true, type: "deleteUser" })}>
                Delete Account
              </button>
              <button className="btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        ) : type === "deleteUser" ? (
          <div>
            <h3 className="font-bold">Delete Account?</h3>
            <p className="text-sm text-red-600">This action is irreversible</p>
            <div className="space-x-2">
              <button className="btn" onClick={deleteUser}>
                Yes
              </button>
              <button className="btn" onClick={closeModal}>
                No
              </button>
            </div>
          </div>
        ) : (
          type === "deleteNote" && (
            <div>
              <h3 className="font-bold">Delete Note?</h3>
              <p className="text-sm text-red-600">This action is irreversible</p>
              <div className="space-x-2">
                <button className="btn" onClick={deleteNote}>
                  Yes
                </button>
                <button className="btn" onClick={closeModal}>
                  No
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
