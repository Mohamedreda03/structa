# LESSONOS - AI-Powered Technical Lesson Generator

LESSONOS is a Next.js 16 application designed to help developers and technical professionals learn complex topics through structured, AI-generated lessons. Unlike standard AI chat interfaces, LESSONOS focuses on creating persistent, editable, and well-organized learning modules.

## Project Overview

*   **Goal:** Generate and refine structured technical lessons using AI.
*   **Target Audience:** Developers, engineers, and technical learners.
*   **Key Features:**
    *   **Structured Generation:** Lessons are divided into logical sections (intro, core concepts, examples, etc.).
    *   **AI Editing:** Users can select specific sections to expand, simplify, or refine with AI assistance.
    *   **Persistence:** Lessons and AI-assisted modifications are saved for long-term learning.

## Technology Stack

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **UI Library:** [React 19](https://react.dev/), [Shadcn UI](https://ui.shadcn.com/), [Tailwind CSS 4](https://tailwindcss.com/)
*   **Authentication:** [Better Auth](https://www.better-auth.com/)
*   **Database & ORM:** [Drizzle ORM](https://orm.drizzle.team/) with [PostgreSQL](https://www.postgresql.org/)
*   **Emails:** [Resend](https://resend.com/)
*   **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## Architecture and Structure

### Database Schema (`src/db/schema.ts`)
*   **Users/Sessions/Accounts/Verifications:** Standard authentication tables for Better Auth.
*   **Lessons:** Core entity representing a learning topic (title, topic, difficulty, status).
*   **Lesson Sections:** Individual parts of a lesson (title, content, order).
*   **AI Edits:** Tracks AI-assisted modifications to specific lesson sections.

### Authentication (`src/lib/auth.ts` & `src/lib/auth-client.ts`)
*   Uses Better Auth with a Drizzle adapter.
*   Supports email/password authentication with password reset functionality via Resend.

### Routing (`src/app`)
*   `(auth)`: Sign-in, sign-up, password recovery. Protected by `AuthLayout` (redirects logged-in users to `/dashboard`).
*   `(product)`:
    *   `/dashboard`: Overview of user lessons.
    *   `/lessons/new`: Create a new AI-generated lesson.
    *   `/lessons/[lessonId]`: Unified lesson page for viewing, reading, and editing with AI.
    *   Protected by `ProductLayout` (redirects unauthenticated users to `/sign-in`).

### Components
*   `UserNav`: Client component in `src/components/user-nav.tsx` that handles user profile display and sign-out.

## Getting Started

### Prerequisites
*   Node.js 20+
*   PostgreSQL database
*   Resend API Key (for emails)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file (see `.env.example` if available) with:
*   `DATABASE_URL`: PostgreSQL connection string.
*   `BETTER_AUTH_SECRET`: Secret for authentication.
*   `RESEND_API_KEY`: API key for Resend.
*   `NEXT_PUBLIC_APP_URL`: Base URL (e.g., `http://localhost:3000`).

### Development Commands
*   **Run Development Server:** `npm run dev`
*   **Build Project:** `npm run build`
*   **Linting:** `npm run lint`
*   **Database Management:**
    *   `npm run db:generate`: Generate migrations.
    *   `npm run db:push`: Push schema changes directly to the DB.
    *   `npm run db:migrate`: Run migrations.
    *   `npm run db:studio`: Open Drizzle Studio to explore data.

## Development Conventions

*   **Styling:** Use Tailwind CSS 4 utility classes. Prefer components from `src/components/ui` (Shadcn).
*   **Data Access:** Use Drizzle ORM for all database interactions. Keep logic in `src/db` or server actions.
*   **Type Safety:** Strict TypeScript is enforced. Define Zod schemas for form validation and API payloads.
*   **Components:** Small, reusable components in `src/components`. Page-specific components can stay in their respective route directories or a `components` subfolder.
