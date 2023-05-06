import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app'
import { Lato } from 'next/font/google'
import { Lobster } from 'next/font/google'


const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lato'
})

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-lobster'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <main className={`${lato.variable} ${lobster.variable}`}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  )
}
