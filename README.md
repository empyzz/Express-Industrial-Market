# 🏭 Industrial Marketplace Project

> **DEV Guide** — Installation and Configuration

---

## Getting Started

### Installation

Start by installing all project dependencies:

```bash
npm install
```

---

## Environment Configuration

### 1. Create your environment file

```bash
cp .env.example .env
```

### 2. Configure essential variables

Open `.env` and set up:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Token signing key | `your-super-secret-key` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` / `production` |

---

## Database Management with Prisma

### Initial Setup

```bash
# Initialize Prisma (if prisma folder don't exist)
npx prisma init
```

### Generate Client

Run this **every time** you modify `schema.prisma`:

```bash
npx prisma generate
```

### Migrations

**Development Environment:**
```bash
npx prisma migrate dev
```
*Creates a new migration and applies it*

**Production Environment:**
```bash
npx prisma migrate deploy
```
*Applies pending migrations without prompts*

### Database Inspector
Use [DBeaver](https://dbeaver.io/download/) to see your database 

### Project
Opens at `http://localhost:3000` 

---

## Running the Application

### Development Mode

**Step 1:** Typescript compiler in watch mode

```bash
npx tsc --watch
```

**Step 2:** Build the project
```bash
npm run build
```

**Step 3:** Start the server
```bash
npm start
```

*Serves compiled code from `dist/`*

*Run 2 Powershell, one for the compiler and the other for the server*
---


## Project Architecture

```
ExpressJS-Industrial-MarketPlace/
│
├── src/
│   ├── controllers/      # Business logic handlers
│   ├── middleware/       # Auth, validation, error handling
│   ├── routes/           # API endpoint definitions
│   ├── views/            # Template files
│   ├── public/           # Static assets (CSS, JS, images)
│   └── server.ts         # Application entry point
│
├── prisma/
│   ├── schema.prisma     # Database schema definition
│   └── migrations/       # Version-controlled DB changes
│
├── dist/                 # Compiled TypeScript output
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── test_db.js            # Test Database Connection (npm run db)
```

---

## 💡 Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start development server | `npm run start` |
| Build Typescript files | `npm run build` |
| Test DB connection    | `npm run db`
| Update Prisma client | `npx prisma generate` |
| Apply migrations (dev) | `npx prisma migrate dev` |
| Apply migrations (prod) | `npx prisma migrate deploy` |

---