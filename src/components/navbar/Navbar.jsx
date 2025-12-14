import Link from "next/link";
import { Activity, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import LoadingBar from "react-top-loading-bar";
import { toast } from "react-toastify";
import Expandable from "./Expandable";
import NavLink from "./NavLink";
import { useNoteContext } from "../../contexts/NoteProvider";
import Hamburger from "../icons/Hamburger";

export default function Navbar({ name, router }) {
  const { noteId } = router.query;
  const { progress, notes, resetStorage, setProgress, setModal, setSidebar, sidebar } = useNoteContext();
  const [hide, setHide] = useState(true);
  const extendNav = () => {
    if (hide) setSidebar(false);
    setHide(!hide);
  };

  async function logOut() {
    setProgress(100);
    setModal({ active: false });
    resetStorage();
    toast.success("Logged out successfully!");
    router.replace("/account/login");
  }

  return (
    <>
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
            <div className="mt-3 space-y-0.5 sm:m-0 sm:flex sm:space-x-4 sm:space-y-0">
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
      <Activity mode={name ? "visible" : "hidden"}>
        <div
          className={`fixed inset-0 top-11 z-20 bg-gray-50 transition-all duration-[250] ${sidebar ? "bg-opacity-50" : "invisible bg-opacity-0"}`}
          onClick={() => setSidebar(false)}
        />
        <div
          className={`fixed top-11 z-30 h-[calc(100dvh-2.5rem)] min-w-48 space-y-2 overflow-y-scroll bg-white px-2 py-3 shadow-lg transition-transform duration-[250] ${sidebar ? "" : "-translate-x-full"}`}
        >
          <h3 className="mb-2 text-center text-lg font-semibold">Hi, {name}!</h3>
          <hr />
          <Activity mode={notes.length ? "visible" : "hidden"}>
            <div className="flex flex-col text-sm">
              <h3 className="text-base font-semibold">Your Notes</h3>
              {notes.map(({ _id, title }) => (
                <Link key={_id} href={`/note/${_id}`} className={`rounded p-1 hover:bg-gray-100 ${_id === noteId ? "bg-gray-100" : ""}`}>
                  {title}
                </Link>
              ))}
            </div>
            <hr />
          </Activity>
          <div className="flex flex-col space-y-2 text-sm">
            <h3 className="text-base font-semibold">Account Settings</h3>
            <button className="w-max font-semibold text-gray-600 hover:text-gray-900" onClick={logOut}>
              Log Out
            </button>
            <button className="w-max font-semibold text-gray-600 hover:text-gray-900" onClick={() => setModal({ active: true, type: "deleteUser" })}>
              Delete Account
            </button>
          </div>
        </div>
      </Activity>
    </>
  );
}
