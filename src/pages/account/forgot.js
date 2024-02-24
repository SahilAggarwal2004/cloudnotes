/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import Logo from "../../components/Logo";
import Password from "../../components/Password";
import { useNoteContext } from "../../contexts/NoteProvider";

export default function Forgot({ router }) {
  const { fetchApp } = useNoteContext();
  const email = useRef();
  const otp = useRef();
  const password = useRef();
  const [stage, setStage] = useState(0);

  async function submit(event) {
    event.preventDefault();
    if (!stage) {
      const { success, error } = await fetchApp({ url: "api/auth/otp", method: "POST", body: { email: email.current.value } });
      if (success) setStage(1);
      else if (error === "OTP already sent!") setStage(stage + 1);
    } else {
      const { success } = await fetchApp({ url: "api/auth/forgot", method: "PUT", body: { email: email.current.value, otp: otp.current.value, password: password.current.value } });
      if (success) router.replace("/account/login");
    }
  }

  return (
    <>
      <Head>
        <title>Reset Password | CloudNotes</title>
      </Head>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-2 text-center">
            <Logo />
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
            <p className="text-sm text-gray-600">
              or{" "}
              <Link href="/account/login">
                <span className="font-medium hover:text-black">Login</span>
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={submit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <input ref={email} type="email" autoComplete="email" required className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md ${stage ? "rounded-b-none" : ""} focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:z-10 sm:text-sm`} placeholder="Email address" />
              {Boolean(stage) && (
                <>
                  <input ref={otp} type="text" autoComplete="new-password" minLength={6} maxLength={6} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:z-10 sm:text-sm" placeholder="Enter OTP" />
                  <Password password={password} />
                </>
              )}
            </div>
            <button type="submit" className="relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md border button-animation">
              {stage ? "Reset password" : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
