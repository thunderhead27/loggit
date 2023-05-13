import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Link from 'next/link'

//@ts-ignore
export default function Home(props) {

  return (
    <div className="flex flex-col h-screen">
      <Layout>
        <div className="flex flex-col items-center absolute my-auto xl:top-0 top-48 bottom-0 h-[800px] gap-y-16">
          <div className="font-lobster text-5xl xl:text-8xl text-white drop-shadow-3xl">Loggit</div>
          <h1 className="font-lato text-white text-2xl xl:text-3xl font-bold drop-shadow-3xl">A simple food tracking app</h1>
          <Search />
          <div className="flex flex-row font-lato text-white gap-x-12 items-center">
            <Link href="/login" className="border-2 px-4 py-2 text-lg font-bold">Login</Link>
            <span className="text-xl">or</span>
            <Link href="/register" className="border-2 px-4 py-2 text-lg font-bold">Signup</Link>
          </div>
        </div>
      </Layout>
    </div>
  )
}
