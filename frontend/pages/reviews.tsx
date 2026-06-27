import { useEffect, useState } from "react";

interface Review {
            pk: string
            sk: string
            completed: boolean
            reviewStage: number
            createdAt: string
        }

export default function Reviews() {

    const [reviews, setReviews] = useState<Review[]>([])
    const [upcoming, setUpcoming] = useState<Review[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        const fetchData = async() => {
            try {
                const [res1, res2] = await Promise.all([
                    fetch(process.env.NEXT_PUBLIC_API_URL + "/reviews/today"),
                    fetch(process.env.NEXT_PUBLIC_API_URL + "/reviews/upcoming")
                ])
                const result1 = await res1.json()
                const result2 = await res2.json()
                setReviews(result1)
                setUpcoming(result2)
            }
            catch (e) {
                setError(e instanceof Error ? e.message : "Something went wrong")
            }
        }

        fetchData()

    }, [])


    if (error) {
        return <p>{error}</p>
    }


    return <div>
        <h1 style={{ fontWeight: 'bold' }}> Today's Reviews: </h1>
        <ul>
        {reviews.map(r => (
            <li key = {r.sk}>
                <p>Completed: {r.completed ? "Yes" : "No"} </p>
                <p>Review Stage: {r.reviewStage} </p>
            </li>
        ))}
        </ul>  
        <h1 style={{ fontWeight: 'bold' }}> Upcoming Reviews: </h1>
        <ul>
            {upcoming.map(r => (
                    <li key = {r.sk}>
                        <p>Completed: {r.completed ? "Yes" : "No"} </p>
                        <p>Review Stage: {r.reviewStage} </p>
                        <p>Created At: {r.createdAt.split("T")[0]}</p>
                    </li>
                ))}
        </ul>
    </div>
}