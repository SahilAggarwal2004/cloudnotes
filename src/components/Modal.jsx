import { useNoteContext } from "../contexts/NoteProvider";

export default function Modal() {
  const {
    closeModal,
    modal: { active, Component, props },
  } = useNoteContext();

  return (
    <div>
      <div className={`fixed inset-0 z-50 bg-black transition-all duration-700 ${active ? "opacity-50" : "invisible opacity-0"}`} onClick={closeModal} />
      <div className={`fixed top-1/2 left-1/2 z-60 w-max -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-4 text-center ${active ? "opacity-100" : "hidden"}`}>
        {active && <Component {...props} />}
      </div>
    </div>
  );
}
