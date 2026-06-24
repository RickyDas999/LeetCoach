import type { AppProps } from "next/app"
import Link from "next/link"
import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className="bg-white min-h-screen text-gray-900">
            <nav className="p-4 border-b border-gray-200 flex gap-6">
                <Link href="/" className="font-medium hover:text-blue-600">Dashboard</Link>
                <Link href="/problems" className="font-medium hover:text-blue-600">Problems</Link>
                <Link href="/reviews" className="font-medium hover:text-blue-600">Reviews</Link>
            </nav>
            <Component {...pageProps} />
        </div>
    )
}