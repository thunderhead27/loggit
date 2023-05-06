import Link from "next/link"
import { useRouter } from "next/router";


export default function Navbar() {
    const router = useRouter();
    const { pathname } = router;

    return (
        <ul className="flex flex-row justify-between list-none items-center">
            <li className={`font-lobster text-white text-3xl drop-shadow-3xl`}>
                <Link href="/">Loggit</Link>
            </li >
            {pathname === '/login' ? null :
                <li className="no-underline font-lato text-2xl font-bold text-white">
                    <Link href="/login">Login</Link>
                </li>}
        </ul>
    )
}