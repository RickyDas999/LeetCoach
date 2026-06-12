const BASE_URL = "https://pzh3vflkm2lldolljbb3ckk3hi0lvrmf.lambda-url.us-east-1.on.aws"

let passed = 0
let failed = 0

async function request(method, path, body) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  }
  if (body) options.body = JSON.stringify(body)
  const res = await fetch(BASE_URL + path, options)
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }
  return { status: res.status, data }
}

function check(name, condition, actual) {
  if (condition) {
    console.log(`  PASS: ${name}`)
    passed++
  } else {
    console.log(`  FAIL: ${name} — got: ${JSON.stringify(actual)}`)
    failed++
  }
}

async function main() {
  console.log("Running LeetCoach API tests...\n")

  // POST /problems — valid
  console.log("POST /problems (valid)")
  const created = await request("POST", "/problems", {
    title: "Test Problem",
    difficulty: "easy",
    pattern: "Arrays & Hashing"
  })
  check("returns 201", created.status === 201, created.status)
  check("has correct title", created.data.title === "Test Problem", created.data.title)
  check("sk has PROBLEM# prefix", created.data.sk?.startsWith("PROBLEM#"), created.data.sk)
  check("has createdAt", created.data.createdAt != null, created.data.createdAt)

  // POST /problems — missing field
  console.log("\nPOST /problems (missing difficulty)")
  const badCreate = await request("POST", "/problems", { title: "Test Problem" })
  check("returns 400", badCreate.status === 400, badCreate.status)
  check("has error field", badCreate.data.error != null, badCreate.data.error)

  // POST /problems — no body
  console.log("\nPOST /problems (no body)")
  const noBody = await request("POST", "/problems")
  check("returns 400", noBody.status === 400, noBody.status)

  // GET /problems
  console.log("\nGET /problems")
  const list = await request("GET", "/problems")
  check("returns 200", list.status === 200, list.status)
  check("returns array", Array.isArray(list.data), list.data)
  check("contains test problem", list.data.some(p => p.sk === "PROBLEM#test-problem"), list.data.length)

  // GET /problems/:slug — found
  console.log("\nGET /problems/test-problem")
  const single = await request("GET", "/problems/test-problem")
  check("returns 200", single.status === 200, single.status)
  check("has correct title", single.data.title === "Test Problem", single.data.title)

  // GET /problems/:slug — not found
  console.log("\nGET /problems/does-not-exist")
  const notFound = await request("GET", "/problems/does-not-exist")
  check("returns 404", notFound.status === 404, notFound.status)
  check("has error field", notFound.data.error != null, notFound.data.error)

  // POST /attempts — valid
  console.log("\nPOST /attempts (valid)")
  const attempt = await request("POST", "/attempts", {
    problemSlug: "test-problem",
    status: "solved_with_hint",
    explanation: "Used a hash map to count frequencies",
    mistakeType: "missed_edge_case",
    timeMinutes: 15
  })
  check("returns 201", attempt.status === 201, attempt.status)
  check("has attempt item", attempt.data.attempt != null, attempt.data.attempt)
  check("has review item", attempt.data.reviewItem != null, attempt.data.reviewItem)
  check("review is not completed", attempt.data.reviewItem?.completed === false, attempt.data.reviewItem?.completed)
  check("review sk has REVIEW# prefix", attempt.data.reviewItem?.sk?.startsWith("REVIEW#"), attempt.data.reviewItem?.sk)

  // POST /attempts — missing problemSlug
  console.log("\nPOST /attempts (missing problemSlug)")
  const badAttempt = await request("POST", "/attempts", { status: "solved" })
  check("returns 400", badAttempt.status === 400, badAttempt.status)
  check("has error field", badAttempt.data.error != null, badAttempt.data.error)

  // POST /attempts — missing status
  console.log("\nPOST /attempts (missing status)")
  const badAttempt2 = await request("POST", "/attempts", { problemSlug: "test-problem" })
  check("returns 400", badAttempt2.status === 400, badAttempt2.status)

  // GET /reviews/today
  console.log("\nGET /reviews/today")
  const today = await request("GET", "/reviews/today")
  check("returns 200", today.status === 200, today.status)
  check("returns array", Array.isArray(today.data), today.data)

  // GET /reviews/upcoming
  console.log("\nGET /reviews/upcoming")
  const upcoming = await request("GET", "/reviews/upcoming")
  check("returns 200", upcoming.status === 200, upcoming.status)
  check("returns array", Array.isArray(upcoming.data), upcoming.data)
  check("contains test review", upcoming.data.some(r => r.problemSlug === "test-problem"), upcoming.data.length)

  // 404 for unknown route
  console.log("\nGET /unknown-route")
  const unknown = await request("GET", "/unknown-route")
  check("returns 404", unknown.status === 404, unknown.status)

  console.log(`\nResults: ${passed} passed, ${failed} failed`)
}

main().catch(console.error)
