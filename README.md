# MVP

AI-assisted accessibility scanning and repair for enterprises and government managing WCAG 2.1 AA and Section 508 readiness across websites and PDFs.

> MVP helps identify, prioritize, and repair accessibility issues. Final compliance should be reviewed by qualified accessibility professionals.

## Stack

- Next.js 15 + TypeScript
- Clerk authentication and organizations
- PostgreSQL + Prisma
- Stripe billing
- Anthropic Claude suggestions
- Playwright + axe-core scanning
- Railway deployment

## Local setup

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run dev
```

## Production setup

Deploy through Railway, connect PostgreSQL, and set the environment variables listed in `.env.example`.
