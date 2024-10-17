import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, text, onClick }) {
  const pathname = usePathname();

  return (
    <Link className={`flex cursor-pointer items-center justify-center capitalize transition-all hover:scale-110 ${pathname === href ? "font-bold" : "text-gray-300"}`} href={href} onClick={onClick}>
      {text}
    </Link>
  );
}
