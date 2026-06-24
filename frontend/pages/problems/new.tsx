import { useState } from "react"
import { useRouter } from "next/router"


export default function ProblemForm() {

    const router = useRouter()
    const [title, setTitle] = useState("")
    const [difficulty, setDifficulty] = useState("")
    const [pattern, setPattern] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()

        const payload = { title, difficulty, pattern }

        try {
            setLoading(true)
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/problems", {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                setLoading(false)
                router.push("/problems")
            }
        }
        
        catch (error) {
            setLoading(false)
            setError(error instanceof Error ? error.message: "Something went wrong")
        }
    }

    return (
        <main className="max-w-lg mx-auto mt-10 p-6">
            <h1 className="text-2xl font-bold mb-6">Add Problem</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                    placeholder="Difficulty (easy / medium / hard)"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                    placeholder="Pattern (e.g. Arrays & Hashing)"
                    value={pattern}
                    onChange={e => setPattern(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Add Problem"}
            </button>
            </form>
        </main>
    )

}