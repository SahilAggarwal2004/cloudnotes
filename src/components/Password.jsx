import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { charLimit } from "../constants";

const { minPassword } = charLimit;

export default function Password({ password }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative m-0 p-0">
      <input ref={password} type={show ? "text" : "password"} autoComplete="new-password" minLength={minPassword} required className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-purple-600 sm:text-sm" placeholder="Password" />
      <div onClick={() => setShow(!show)}>{!show ? <FaEye className="password-icon" /> : <FaEyeSlash className="password-icon" />}</div>
    </div>
  );
}
