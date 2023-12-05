import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, text, onClick }) {
    const pathname = usePathname()
    
    return <Link className={`flex items-center justify-center hover:scale-110 transition-all cursor-pointer capitalize ${pathname === href ? "font-bold" : "text-gray-300"}`} href={href} onClick={onClick}>{text}</Link>
}
