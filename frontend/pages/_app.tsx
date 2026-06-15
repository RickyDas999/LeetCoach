import type { AppProps } from "next/app"
import Link from "next/link"
import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
        <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/problems">Problems</Link>
            <Link href="/reviews">Reviews</Link>
        </nav>
        <Component {...pageProps} />
        </>
    )
}
