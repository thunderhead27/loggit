import Link from "next/link"
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
    const router = useRouter();
    const { pathname } = router;
    const { data: session } = useSession();


    return (
        <ul className="flex flex-row justify-between list-none items-center">
            <li className={`font-lobster text-white px-8 text-3xl drop-shadow-3xl`}>
                <Link href="/">Loggit</Link>
            </li >
            {session?.user ? <li className="no-underline pr-4 font-lato text-2xl font-bold text-white">
                <button className="pr-4" onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
            </li> : <li className="no-underline font-lato text-2xl font-bold text-white pr-4">
                <Link href="/login">Login</Link>
            </li>
            }

        </ul>
    )
}