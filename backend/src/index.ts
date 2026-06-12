import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

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
        return createAttempt(event.body);
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

    const result = await db.send(new GetCommand({
        TableName: "LeetCoach",
        Key: {
            pk: "USER#abc123",
            sk: "PROBLEM#" + slug
        }
    }))

    if (result.Item) {
        return {statusCode: 200,
            body: JSON.stringify(result.Item)
        }
    }
    else {
        return {statusCode: 404,
            body: JSON.stringify({error: "Item not found"})
        }
    }
}

async function createAttempt(body: string) {
    const data = JSON.parse(body)
    const slug = data.problemSlug
    const timestamp = new Date().toISOString()
    const date = new Date()

    const reviewDays: Record<string, number> = {
        failed: 1,
        watched_solution: 2,
        solved_with_hint: 5,
        solved: 14
    }
    const days = reviewDays[data.status] ?? 3
    date.setDate(date.getDate() + days)
    const reviewDate = date.toISOString().split("T")[0]
    

    const attemptItem = {
        pk: "USER#abc123",
        sk: "ATTEMPT#" + timestamp + "#" + slug,
        reviewDate: reviewDate,
        status: data.status,
        explanation: data.explanation,
        mistakeType: data.mistakeType,
        timeMinutes: data.timeMinutes
    }

    const reviewItem = {
        pk: "USER#abc123",
        sk: "REVIEW#" + reviewDate + "#" + slug,
        problemSlug: slug,
        completed: false,
        reviewStage: 1,
        createdAt: new Date().toISOString()
    }

    await db.send(new PutCommand({
        TableName: "LeetCoach",
        Item: attemptItem
    }))

    await db.send(new PutCommand({
        TableName: "LeetCoach",
        Item: reviewItem
    }))

    return {statusCode: 201,
        body: JSON.stringify({attempt: attemptItem, reviewItem: reviewItem})
    }
}

async function getTodayReviews() {
    const result = await db.send(new QueryCommand({
        TableName: "LeetCoach",
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": "USER#abc123",
            ":skPrefix": "REVIEW#" + new Date().toISOString().split("T")[0]
        }
    }))

    return {statusCode: 200,
        body: JSON.stringify(result.Items ?? [])
    }
}

async function getUpcomingReviews() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split("T")[0]
    const result = await db.send(new QueryCommand({
        TableName: "LeetCoach",
        KeyConditionExpression: "pk = :pk AND sk >= :skStart",
        ExpressionAttributeValues: {
            ":pk": "USER#abc123",
            ":skStart": "REVIEW#" + tomorrowStr,
        }
    }))

    return {statusCode: 200,
        body: JSON.stringify(result.Items ?? [])
    }
}