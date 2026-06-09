import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1"})
const db = DynamoDBDocumentClient.from(client)

export const handler = async (event: any) => {
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    if (method === "GET" && path === "/problems") {
        return getProblems();
    }

    if (method === 'POST' && path === "/problems") {
        return createProblem(event.body);
    } 

    if (method === "GET" && path.startsWith("/problems/")) {
        const slug = path.split("/")[2]
        return getProblem(slug);
    }

    if (method === "POST" && path === "/attempts") {
        return createAttempt();
    }

    if (method === "GET" && path === "/reviews/today") {
        return getTodayReviews();
    }

    if (method === "GET" && path === "/reviews/upcoming") {
        return getUpcomingReviews();
    }

    return {
        statusCode: 404,
        body: JSON.stringify({ error: "Not found"})
    }
}

async function createProblem(body: string) {

    const data = JSON.parse(body)
    const slug = data.title.toLowerCase().replace(/ /g, "-")
    const item = {
            pk: "USER#abc123",
            sk: "PROBLEM#" + slug,
            title: data.title,
            difficulty: data.difficulty,
            pattern: data.pattern,
            source: "leetcode",
            createdAt: new Date().toISOString()
        }

    await db.send(new PutCommand({
        TableName: "LeetCoach",
        Item: item
    }))

    return {
        statusCode: 201,
        body: JSON.stringify(item)
    }
}

async function getProblems() {

    const result = await db.send(new QueryCommand({
        TableName: "LeetCoach",
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": "USER#abc123",
            ":skPrefix": "PROBLEM#"
        }
    }))

    return {statusCode: 200,
        body: JSON.stringify(result.Items ?? [])
    }
}

async function getProblem(slug: string) {
    return {statusCode: 200,
        body: JSON.stringify({message: "To do"})
    }
}

async function createAttempt() {
    return {statusCode: 200,
        body: JSON.stringify({message: "To do"})
    }
}

async function getTodayReviews() {
    return {statusCode: 200,
        body: JSON.stringify({message: "To do"})
    }
}

async function getUpcomingReviews() {
    return {statusCode: 200,
        body: JSON.stringify({message: "To do"})
    }
}