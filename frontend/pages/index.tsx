import { useEffect, useState } from "react"
import Link from "next/link"

// Total number of problems added
// How many reviews are due today
// A link to add a new problem

  interface Problem {
        pk: string
        sk: string
        title: string
        difficulty: string
        pattern: string
        source: string
        createdAt: string
    }
    interface Review {
        pk: string
        sk: string
        completed: boolean
        reviewStage: number
        createdAt: string
      }

export default function Dashboard() {

  const [problems, setProblems] = useState<Problem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)


  useEffect(() => {

    const fetchData = async() => {
      try {
        const [p, r] = await Promise.all([
          fetch(process.env.NEXT_PUBLIC_API_URL + "/problems"),
          fetch(process.env.NEXT_PUBLIC_API_URL + "/reviews/today")
        ])
        const pRes = await p.json()
        const rRes = await r.json()

        setLoading(false)
        setProblems(pRes)
        setReviews(rRes)
      }

      catch (e) {
        setError(e instanceof Error ? e.message: "Something went wrong")
      }
    }

    setLoading(true)
    fetchData()
  }, [])

  if (error) {
    return <p> {error} </p>
  }

  if (loading) {
    return <p> Loading... </p>
  }

  return (
    <main>
      <h1 style={{ fontWeight: 'bold' }}>Problems: </h1>
      <p>Problems: {problems.length} </p>
      <h1 style={{ fontWeight: 'bold' }}>Reviews: </h1>
      <h1>Today's Reviews: {reviews.length} </h1>
      <Link style = {{ fontWeight: 'bold', color: 'blue' }} href = '/problems/new'> Add a new problem </Link>
    </main>
  )
}