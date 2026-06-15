import { useEffect, useState } from "react"

export default function ProblemList() {

    interface Problem {
        pk: string
        sk: string
        title: string
        difficulty: string
        pattern: string
        source: string
        createdAt: string
    }
    const [problems, setProblems] = useState<Problem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null> (null)


    useEffect(() => {
        // process.env.NEXT_PUBLIC_API_URL + "/problems"
        const fetchData = async() => {
            try {
                console.log(process.env.NEXT_PUBLIC_API_URL)
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/problems")
                const result = await response.json()
                setProblems(result)
                setLoading(false)
            }
            catch (err) {
                setError(err instanceof Error ? err.message: "Something went wrong")
                setLoading(false)
            }
        }
        setLoading(true)
        fetchData()
    }, [])

    if (loading) {
        return <p> Loading... </p>
    }

    if (error) {
        return <p> error: {error} </p> 
    }
    
    return <ul>
        {problems.map(p => (
            <li key = {p.sk}>{p.title}</li>
        ))}
    </ul>

}