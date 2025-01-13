/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import { setStorage } from "../../modules/storage";
import Logo from "../../components/icons/Logo";
import Password from "../../components/Password";
import { useNoteContext } from "../../contexts/NoteProvider";

export default function Login({ router }) {
  const { fetchApp } = useNoteContext();
  const email = useRef();
  const password = useRef();

  async function submit(event) {
    event.preventDefault();
    const { success, name, token } = await fetchApp({ url: "api/auth/login", method: "POST", body: { email: email.current.value, password: password.current.value } });
    if (!success) return;
    setStorage("name", name);
    setStorage("token", token);
    router.replace("/");
  }

  return (
    <>
      <Head>
        <title>Login | CloudNotes</title>
      </Head>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-900">Log in to your account</h2>
            <p className="text-sm text-gray-600">
              or{" "}
              <Link href="/account/signup">
                <span className="font-medium hover:text-black">Sign Up</span>
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={submit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <input
                ref={email}
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-purple-600 focus:outline-none focus:ring-purple-600 sm:text-sm"
                placeholder="Email address"
              />
              <Password password={password} />
            </div>

            <Link href="/account/forgot" className="flex">
              <div className="cursor-pointer text-sm font-medium text-gray-600 hover:text-black">Forgot your password?</div>
            </Link>

            <button type="submit" className="button-animation relative flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium">
              Log in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
