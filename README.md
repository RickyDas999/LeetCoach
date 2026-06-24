# LeetCoach

A full-stack web app for learning LeetCode patterns through reflection. Instead of grinding problems, LeetCoach tracks your attempts, classifies your mistakes, and schedules reviews using spaced repetition — so you actually retain the patterns you learn.

## Features

- Add problems with title, difficulty, and pattern category
- Log attempts with outcome (solved, solved with hint, watched solution, failed)
- Spaced repetition scheduling: the worse you did, the sooner you review
- Daily review queue and upcoming review calendar
- Problem detail pages per problem

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Backend | AWS Lambda + TypeScript |
| Database | DynamoDB (single-table design) |
| Hosting | Vercel (frontend), Lambda Function URL (backend) |

No always-on servers — runs entirely within the AWS free tier.

## Project Structure

```
LeetCoach/
├── backend/          # AWS Lambda function
│   ├── src/
│   │   └── index.ts  # Lambda handler + all endpoints
│   ├── test.mjs      # API test script (28 tests)
│   └── package.json
└── frontend/         # Next.js app
    ├── pages/
    │   ├── index.tsx              # Dashboard
    │   ├── problems/
    │   │   ├── index.tsx          # Problems list
    │   │   ├── new.tsx            # Add problem form
    │   │   └── [slug].tsx         # Problem detail
    │   └── reviews.tsx            # Today's + upcoming reviews
    └── styles/
        └── globals.css
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/problems` | List all problems |
| POST | `/problems` | Create a problem |
| GET | `/problems/:slug` | Get a single problem |
| POST | `/attempts` | Log an attempt |
| GET | `/reviews/today` | Today's review queue |
| GET | `/reviews/upcoming` | All upcoming reviews |

## Spaced Repetition Schedule

| Outcome | Next review |
|---|---|
| solved | 14 days |
| solved_with_hint | 5 days |
| watched_solution | 2 days |
| failed | 1 day |

## Local Development

**Backend**
```bash
cd backend
npm install
npm run build       # compile TypeScript with esbuild
npm run deploy      # build + zip + deploy to AWS Lambda
node test.mjs       # run API tests
```

**Frontend**
```bash
cd frontend
npm install
npm run dev         # starts at http://localhost:3000
```

Create a `.env.local` file in the `frontend/` directory:
```
NEXT_PUBLIC_API_URL=<your Lambda Function URL>
```

## DynamoDB Data Model

Single table (`LeetCoach`) with composite keys:

| Entity | pk | sk |
|---|---|---|
| Problem | `USER#<id>` | `PROBLEM#<slug>` |
| Attempt | `USER#<id>` | `ATTEMPT#<timestamp>#<slug>` |
| Review | `USER#<id>` | `REVIEW#<date>#<slug>` |

Sort keys are designed for lexicographic range queries — review dates sort naturally as ISO strings (`REVIEW#2026-06-25#...`).
