import Link from "next/link";
import { Activity, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import LoadingBar from "react-top-loading-bar";
import { toast } from "react-toastify";
import Expandable from "./Expandable";
import NavLink from "./NavLink";
import { useNoteContext } from "../../contexts/NoteProvider";
import Hamburger from "../icons/Hamburger";
import { getPrefilledFeedbackFormUrl } from "../../lib/utilities";
import DeleteUser from "../user/DeleteUser";

export default function Navbar({ user, router }) {
  const { name, email } = user || {};
  const { noteId } = router.query;
  const { closeModal, openModal, progress, notes, resetStorage, setProgress, setSidebar, sidebar } = useNoteContext();
  const [hide, setHide] = useState(true);

  const extendNav = () => {
    if (hide) setSidebar(false);
    setHide(!hide);
  };

  async function logOut() {
    setProgress(100);
    closeModal();
    resetStorage();
    router.replace("/account/login");
    toast.success("Logged out successfully!");
  }

  return (
    <>
      {/* Top Navbar */}
      <div className="sticky inset-0 z-40">
        <nav className="flex flex-col items-center overflow-hidden bg-purple-700 px-4 py-2 text-white sm:flex-row sm:justify-between">
          <div className={`flex w-full items-center justify-between sm:justify-start ${name && "sm:space-x-4"}`}>
            <Activity mode={name ? "visible" : "hidden"}>
              <button
                type="button"
                onClick={() => {
                  if (!sidebar) setHide(true);
                  setSidebar(!sidebar);
                }}
              >
                <Hamburger open={sidebar} />
              </button>
            </Activity>

            <Link href="/">
              <h2 className="text-center text-xl font-semibold">CloudNotes</h2>
            </Link>

            <FaChevronDown className={`scale-125 transition-transform duration-200 sm:invisible ${hide ? "" : "rotate-180"}`} onClick={extendNav} />
          </div>

          <Expandable expand={!hide} className="min-w-max px-2 sm:inline-block">
            <div className="mt-3 space-y-0.5 sm:m-0 sm:flex sm:space-y-0 sm:space-x-4">
              {name ? (
                <NavLink href="/" text="Dashboard" onClick={extendNav} />
              ) : (
                <>
                  <NavLink href="/account/signup" text="Signup" onClick={extendNav} />
                  <NavLink href="/account/login" text="Login" onClick={extendNav} />
                </>
              )}
              <NavLink href="/about" text="About" onClick={extendNav} />
            </div>
          </Expandable>
        </nav>

        <LoadingBar color="#dc2626" containerStyle={{ position: "relative" }} shadow={false} progress={progress} waitingTime={300} onLoaderFinished={() => setProgress(0)} />
      </div>

      {/* Sidebar */}
      <Activity mode={name ? "visible" : "hidden"}>
        {/* Overlay */}
        <div className={`duration-250] fixed inset-0 top-11 z-20 bg-gray-50 transition-all ${sidebar ? "opacity-30" : "invisible opacity-0"}`} onClick={() => setSidebar(false)} />

        {/* Sidebar panel */}
        <div
          className={`fixed top-11 z-30 flex h-[calc(100dvh-2.5rem)] min-w-48 flex-col space-y-2 overflow-y-auto bg-white px-2 py-3 shadow-lg transition-transform duration-250 ${sidebar ? "" : "-translate-x-full"}`}
        >
          {/* Header */}
          <h3 className="mb-2 text-center text-lg font-semibold">Hi, {name}!</h3>
          <hr />

          {/* Notes */}
          <Activity mode={notes.length ? "visible" : "hidden"}>
            <div className="flex min-h-32 flex-1 flex-col overflow-y-auto pr-1 text-sm">
              <h3 className="text-base font-semibold">Your Notes</h3>

              <div className="mt-1 space-y-1">
                {notes.map(({ _id, title }) => (
                  <Link key={_id} href={`/note/${_id}`} className={`block rounded-sm p-1 hover:bg-gray-100 ${_id === noteId ? "bg-gray-100" : ""}`}>
                    {title}
                  </Link>
                ))}
              </div>
            </div>
            <hr />
          </Activity>

          {/* Bottom (fixed) */}
          <div className="flex flex-col space-y-2 pt-2 text-sm">
            <h3 className="text-base font-semibold">Account Settings</h3>

            <button className="w-max font-semibold text-gray-600 hover:text-gray-900" onClick={logOut}>
              Log Out
            </button>

            <button className="w-max font-semibold text-gray-600 hover:text-gray-900" onClick={() => openModal({ Component: DeleteUser })}>
              Delete Account
            </button>

            <a className="w-max font-semibold text-gray-600 hover:text-gray-900" href={getPrefilledFeedbackFormUrl(name, email)} target="_blank" rel="noopener">
              Send Feedback
            </a>
          </div>
        </div>
      </Activity>
    </>
  );
}
