import Link from 'next/link'

export default function NavLink({ href, text, path, onClick }) {
    return <Link className={`flex items-center justify-center hover:scale-110 transition-all cursor-pointer capitalize ${path === href ? "font-bold" : "text-gray-300"}`} href={href} onClick={onClick}>{text}</Link>
}
