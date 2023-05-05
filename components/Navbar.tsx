import { Lobster } from 'next/font/google'
import Link from "next/link"

const lobster = Lobster({
    weight: '400',
    subsets: ['latin']
})

export default function Navbar() {
    return (
        <ul className="flex flex-row justify-between list-none items-center">
            <li className={`${lobster.className} text-white text-5xl`}>Loggit</li >
            <li className="no-underline font-lato text-2xl font-bold text-white">
                <Link href="/login">Login</Link>
            </li>
        </ul>
    )
}