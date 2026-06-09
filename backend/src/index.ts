export const handler = async (event: any) => {
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    if (method === "GET" && path === "/problems") {
        return getProblems();
    }

    if (method === 'POST' && path === "/problems") {
        return createProblem();
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

async function createProblem() {
    return {statusCode: 200,
        body: JSON.stringify({message: "To do"})
    }
}

async function getProblems() {
    return {statusCode: 200,
        body: JSON.stringify({message: "To do"})
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