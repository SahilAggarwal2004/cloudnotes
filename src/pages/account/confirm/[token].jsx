import { useNoteContext } from "../../../contexts/NoteProvider";
import Head from "next/head";

export default function Confirm({ router }) {
  const { token } = router.query;
  const { fetchApp } = useNoteContext();

  return (
    <>
      <Head>
        <title>CloudNotes - Notes on Cloud</title>
      </Head>
      <div>
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] space-y-5 text-center">
          <h3 className="font-semibold">Confirm your CloudNotes account</h3>
          <button
            className="btn text-base disabled:opacity-60"
            disabled={!token}
            onClick={() => fetchApp({ url: "api/auth/confirm", method: "PUT", token, onSuccess: () => router.replace("/account/login") })}
          >
            Click Here!
          </button>
        </div>
      </div>
    </>
  );
}
