import Link from "next/link";
import { useState } from "react";
import { FaRegUser, FaBars } from "react-icons/fa";
import LoadingBar from "react-top-loading-bar";
import Expandable from "./Expandable";
import NavLink from "./NavLink";
import { useNoteContext } from "../../contexts/NoteProvider";

export default function Navbar({ name }) {
  const { setModal, progress, setProgress } = useNoteContext();
  const [hide, setHide] = useState(true);
  const extendNav = () => setHide(!hide);

  return (
    <nav className="sticky inset-0 z-30">
      <div className="flex flex-col items-center overflow-hidden bg-purple-700 px-4 py-2 text-white sm:flex-row sm:justify-between">
        <div className={`flex w-full items-center justify-between sm:justify-start ${name && "sm:space-x-5"}`}>
          <FaRegUser className={`scale-125 cursor-pointer font-extrabold transition-all ${!name && "invisible fixed"}`} onClick={() => setModal({ active: true, type: "user", name })} />
          <Link href="/">
            <h2 className="text-center text-xl font-semibold">CloudNotes</h2>
          </Link>
          <FaBars className="scale-125 sm:invisible" onClick={extendNav} />
        </div>
        <Expandable expand={!hide}>
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
      </div>
      <LoadingBar color="#dc2626" containerStyle={{ position: "relative" }} shadow={false} progress={progress} waitingTime={300} onLoaderFinished={() => setProgress(0)} />
    </nav>
  );
}
