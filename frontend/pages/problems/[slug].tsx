import { useRouter } from "next/router"
import { useEffect, useState } from "react"

interface Problem {
    title: string
    difficulty: string
    pattern: string
}

export default function ProblemDetail() {

    const router = useRouter()
    const slug = router.query.slug
    const [problem, setProblem] = useState({
        title: "", 
        difficulty: "", 
        pattern: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null> (null)

    useEffect(() => {
            if (!slug) {
                return
            }
            const fetchData = async() => {
                try {
                    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/problems/" + slug)
                    const result = await response.json()
                    
                    setLoading(false)
                    setProblem({
                        title: result.title,
                        difficulty: result.difficulty,
                        pattern: result.pattern
                    })
                }
                catch(error) {
                    setLoading(false)
                    setError(error instanceof Error ? error.message: "Something went wrong")
                }
            }
            setLoading(true)
            fetchData()
    }, [slug]) 

    if (loading) {
            return <p>Loading...</p>
        }
        if (error) {
            return <p>Error: {error} </p>
        }

    return (
        <main>
            <h1>Problem Detail</h1>
            <p>Title: {problem.title}</p>
            <p>Difficulty: {problem.difficulty}</p>
            <p>Pattern: {problem.pattern}</p>

        </main>
    )
}