/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import Logo from "../../components/Logo";
import Password from "../../components/Password";
import { useNoteContext } from "../../contexts/NoteProvider";
import { charLimit } from "../../constants";

const { otp: otpLength } = charLimit;

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
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
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
            <div className="-space-y-px rounded-md shadow-sm">
              <input ref={email} type="email" autoComplete="email" required className={`relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 ${stage ? "rounded-b-none" : ""} focus:z-10 focus:border-purple-600 focus:outline-none focus:ring-purple-600 sm:text-sm`} placeholder="Email address" />
              {Boolean(stage) && (
                <>
                  <input ref={otp} type="text" autoComplete="new-password" minLength={otpLength} maxLength={otpLength} required className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-purple-600 focus:outline-none focus:ring-purple-600 sm:text-sm" placeholder="Enter OTP" />
                  <Password password={password} />
                </>
              )}
            </div>
            <button type="submit" className="button-animation relative flex w-full justify-center rounded-md border px-4 py-2 text-sm font-medium">
              {stage ? "Reset password" : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
