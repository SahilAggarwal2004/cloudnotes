/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "react-toastify";
import Logo from "../../components/Logo";
import Password from "../../components/Password";
import { useNoteContext } from "../../contexts/NoteProvider";
import { charLimit } from "../../constants";

const { minName, maxName } = charLimit;

export default function Signup({ router }) {
  const { fetchApp } = useNoteContext();
  const name = useRef();
  const email = useRef();
  const password = useRef();

  async function submit(event) {
    event.preventDefault();
    const { success, error } = await fetchApp({ url: "api/auth/signup", method: "POST", body: { name: name.current.value, email: email.current.value, password: password.current.value }, showToast: false });
    if (!success) return toast.error(error);
    toast.success("Account created successfully! Please confirm your account via email to proceed!", { autoClose: 5000, pauseOnFocusLoss: true });
    router.replace("/account/login");
  }

  return (
    <>
      <Head>
        <title>Signup | CloudNotes</title>
      </Head>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-900">Create a new account</h2>
            <p className="text-sm text-gray-600">
              or{" "}
              <Link href="/account/login">
                <span className="font-medium hover:text-black">Log In</span>
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={submit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <input ref={name} type="text" autoComplete="name" required minLength={minName} maxLength={maxName} className="focus:border-purplr-600 relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-purple-600 sm:text-sm" placeholder="Your name" />
              <input ref={email} type="email" autoComplete="email" required className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-purple-600 focus:outline-none focus:ring-purple-600 sm:text-sm" placeholder="Email address" />
              <Password password={password} />
            </div>
            <button type="submit" className="button-animation relative flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
