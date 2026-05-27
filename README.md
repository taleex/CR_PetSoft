# 🐾 PetSoft - Professional Pet Management Application

> A full-stack web application built during the [Professional React and Next.js](https://bytegrad.com/app/professional-react-and-nextjs/petsoft) course by [ByteGrad](https://bytegrad.com).

**PetSoft** is a modern, full-stack SaaS application that allows pet owners to manage their pets' information in one centralized dashboard. Users can sign up, add pets with details like name, age, and notes, search through their pets, and manage everything with a clean and responsive user interface. The app includes a Stripe payment integration for lifetime access.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Project Structure](#architecture--project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Database](#database)
  - [Schema Overview](#schema-overview)
  - [Seed Data](#seed-data)
- [Authentication](#authentication)
- [Payments (Stripe)](#payments-stripe)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Acknowledgments](#acknowledgments)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | Email/password-based authentication using NextAuth v5 with JWT sessions, bcrypt password hashing, and protected routes via middleware. |
| **🐕 Pet Management** | Full CRUD operations for pets — add, edit, delete, and view detailed pet information including name, owner name, age, image, and notes. |
| **🔍 Search** | Real-time search/filter functionality across pets for quick access. |
| **📊 Dashboard** | Central dashboard with pet list, detailed pet view, and statistical overview (total pets, average age, etc.). |
| **💳 Payment Integration** | Stripe-powered payment system for purchasing lifetime access to PetSoft. |
| **🛡️ Route Protection** | Intelligent middleware-based route guarding — redirects unauthenticated users to login, directs non-paying users to payment page, and prevents authenticated/paying users from accessing auth pages. |
| **🎨 Responsive UI** | Beautiful, responsive design built with Tailwind CSS and Radix UI components. |
| **⚡ Server Actions** | Next.js Server Actions for efficient form handling and data mutations. |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 14.1.0 | React framework with App Router for server-side rendering, routing, and API routes. |
| [React](https://react.dev/) | ^18 | UI component library. |
| [TypeScript](https://www.typescriptlang.org/) | ^5.9 | Type-safe JavaScript superset for improved developer experience. |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.3 | Utility-first CSS framework for rapid UI development. |
| [Radix UI](https://www.radix-ui.com/) | — | Accessible, unstyled React primitives (Dialog, Label, Slot). |
| [Lucide React](https://lucide.dev/) | ^0.563 | Beautiful, consistent icon library. |
| [React Hook Form](https://react-hook-form.com/) | ^7.72 | Performant form handling with easy validation integration. |
| [Zod](https://zod.dev/) | ^4.3 | Schema declaration and validation library. |
| [Sonner](https://sonner.emilkowal.ski/) | ^2.0 | Lightweight toast notifications. |
| [class-variance-authority](https://cva.style/) | ^0.7 | Utility for managing component variants. |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^3.4 | Smart merging of Tailwind CSS classes. |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | 14.1.0 | Serverless API endpoints (Stripe webhook, auth callbacks). |
| [NextAuth.js](https://next-auth.js.org/) | ^5.0 beta | Authentication framework with JWT session management and Credentials provider. |
| [Prisma](https://www.prisma.io/) | ^5.8 | Type-safe ORM for database schema management and queries. |
| [PostgreSQL](https://www.postgresql.org/) | — | Primary database (via Neon serverless PostgreSQL). |
| [@neondatabase/serverless](https://neon.tech/) | ^1.1 | Serverless PostgreSQL driver for Neon DB. |
| [Stripe](https://stripe.com/) | ^22.1 | Payment processing for lifetime access purchases. |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | ^3.0 | Password hashing for secure credential storage. |
| [server-only](https://www.npmjs.com/package/server-only) | ^0.0.1 | Ensures certain code only runs on the server. |

### Development & Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| [ESLint](https://eslint.org/) | ^8 | Code linting. |
| [PostCSS](https://postcss.org/) | ^8 | CSS transformation tool. |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | ^10 | CSS vendor prefixing. |
| [ts-node](https://typestrong.org/ts-node/) | ^10.9 | TypeScript execution for seed scripts. |
| [Prisma Studio](https://www.prisma.io/studio) | — | GUI database browser (optional, via `npx prisma studio`). |

---

## 🏗️ Architecture & Project Structure

```
petsoft/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.ts                # Database seed script
│   └── dev.db                 # Local SQLite dev database (if applicable)
│
├── public/
│   └── logo.svg               # Application logo
│
├── src/
│   ├── actions/
│   │   └── actions.ts         # Next.js Server Actions (form handling, Stripe, etc.)
│   │
│   ├── app/
│   │   ├── layout.tsx         # Root layout with global providers
│   │   ├── icon.svg           # Favicon/icon
│   │   │
│   │   ├── (app)/             # Authenticated app routes (protected)
│   │   │   └── app/
│   │   │       ├── layout.tsx     # App layout with context providers
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx   # Main dashboard page
│   │   │       └── account/
│   │   │           └── page.tsx   # Account settings page
│   │   │
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── payment/
│   │   │       └── page.tsx       # Stripe checkout page
│   │   │
│   │   ├── (marketing)/       # Public marketing/landing page
│   │   │   └── page.tsx
│   │   │
│   │   └── api/               # API route handlers
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts   # NextAuth API handlers
│   │       └── stripe/
│   │           └── route.ts       # Stripe webhook endpoint
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives (Button, Dialog, Input, etc.)
│   │   ├── app-footer.tsx
│   │   ├── app-header.tsx
│   │   ├── auth-form.tsx      # Login/Signup form component
│   │   ├── auth-form-btn.tsx
│   │   ├── background-pattern.tsx
│   │   ├── branding.tsx
│   │   ├── content-block.tsx
│   │   ├── h1.tsx
│   │   ├── logo.tsx
│   │   ├── pet-button.tsx
│   │   ├── pet-details.tsx
│   │   ├── pet-form-btn.tsx
│   │   ├── pet-form.tsx
│   │   ├── pet-list.tsx
│   │   ├── search-form.tsx
│   │   ├── sign-out-btn.tsx
│   │   └── stats.tsx
│   │
│   ├── contexts/
│   │   ├── pet-context-provider.tsx     # Pet data context
│   │   └── search-context-provider.tsx  # Search state context
│   │
│   ├── lib/
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── constants.ts        # App-wide constants
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── hooks.ts            # Custom React hooks
│   │   ├── next-auth.d.ts      # NextAuth type extensions
│   │   ├── server-utils.ts     # Server-side utility functions
│   │   ├── types.tsx           # TypeScript type definitions
│   │   ├── utils.ts            # General utility functions (cn, etc.)
│   │   └── validations.ts      # Zod validation schemas
│   │
│   ├── middleware.ts           # Next.js middleware (route protection)
│   └── styles/
│       └── globals.css         # Global styles + Tailwind directives
│
├── .env.example                # Environment variable template
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── components.json             # shadcn/ui component config
├── package.json
└── README.md
```

### Key Architecture Decisions

- **App Router**: Next.js 14 App Router for file-based routing with nested layouts, server components, and route groups.
- **Server Actions**: Data mutations (add/edit/delete pets, authentication, Stripe checkout) are handled via Next.js Server Actions for optimal performance.
- **Middleware**: A central `middleware.ts` handles all route protection logic — unauthenticated users are redirected to login, non-paying users to the payment page, and authenticated/paying users are kept within the app.
- **Prisma ORM**: Type-safe database access with a singleton Prisma client instance.
- **Context Providers**: React context is used for pet data state management and search functionality.
- **JWT Sessions**: Authentication uses JSON Web Tokens with custom fields (`userId`, `hasAccess`) for session management.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
- A [PostgreSQL](https://www.postgresql.org/) database (or [Neon](https://neon.tech/) serverless PostgreSQL)
- A [Stripe](https://stripe.com/) account (for payment integration)
- A [NextAuth](https://next-auth.js.org/) secret (generate with `openssl rand -base64 32`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/taleex/CR_PetSoft.git
   cd CR_PetSoft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables) below):
   ```bash
   cp .env.example .env
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional):**
   ```bash
   npx prisma db seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at [https://taleex-petsoft.vercel.app](https://taleex-petsoft.vercel.app).

### Environment Variables

Create a `.env` file in the project root. Refer to `.env.example` for the required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgresql://...`) |
| `AUTH_SECRET` | NextAuth secret key for JWT encryption |
| `STRIPE_SECRET_KEY` | Stripe secret API key (from your Stripe dashboard) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PRICE_ID` | Stripe price ID for the lifetime access product |
| `NEXT_PUBLIC_SERVER_URL` | Base URL of your application (e.g., `https://taleex-petsoft.vercel.app`) |

---

## 🗄️ Database

### Schema Overview

The database uses **PostgreSQL** with **Prisma ORM** for schema management. There are two main models:

#### `User`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` (CUID) | Primary key |
| `email` | `String` (unique) | User email address |
| `hashedPassword` | `String` | bcrypt-hashed password |
| `hasAccess` | `Boolean` | Whether the user has paid for lifetime access (default: `false`) |
| `pets` | `Pet[]` | One-to-many relationship with pets |
| `createdAt` | `DateTime` | Timestamp of account creation |
| `updatedAt` | `DateTime` | Timestamp of last update |

#### `Pet`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` (CUID) | Primary key |
| `name` | `String` | Pet's name |
| `ownerName` | `String` | Owner's name |
| `imageUrl` | `String` | URL to pet's image |
| `age` | `Int` | Pet's age |
| `notes` | `String` | Additional notes about the pet |
| `userId` | `String` (FK) | Foreign key referencing `User.id` |
| `createdAt` | `DateTime` | Timestamp of creation |
| `updatedAt` | `DateTime` | Timestamp of last update |

### Seed Data

A seed script is provided at `prisma/seed.ts` to populate the database with sample data for development. To run it:

```bash
npx prisma db seed
```

---

## 🔒 Authentication

Authentication is implemented using **NextAuth v5** (beta) with the **Credentials** provider.

### How it works

1. **Sign Up**: Users register with email and password. The password is hashed using `bcryptjs` before being stored in the database.
2. **Sign In**: Users authenticate via email/password. Credentials are validated against the database.
3. **JWT Sessions**: On successful authentication, a JWT token is created containing the user's `id`, `email`, and `hasAccess` status. This token is used for session management.
4. **Route Protection**: The `middleware.ts` file intercepts requests and enforces access rules:
   - Unauthenticated users are redirected to the login page.
   - Authenticated users without `hasAccess: true` are redirected to the payment page.
   - Authenticated users with `hasAccess: true` trying to access login/signup are redirected to the dashboard.

### Auth Providers

Currently, the only auth provider is **Credentials** (email/password), which can be extended with OAuth providers (Google, GitHub, etc.) via NextAuth's provider system.

---

## 💳 Payments (Stripe)

PetSoft uses **Stripe** for payment processing. Users must purchase lifetime access for **$299** to use the application.

### Payment Flow

1. User signs up and is redirected to the payment page.
2. User clicks "Buy lifetime access for $299".
3. A **Stripe Checkout Session** is created via a Server Action.
4. User completes payment on Stripe's hosted checkout page.
5. On success, Stripe sends a webhook to the `/api/stripe` endpoint, which updates the user's `hasAccess` field to `true`.
6. The user can then access the dashboard by clicking the "Access PetSoft" button, which triggers a session update.

### Stripe Webhook

For local development, use the Stripe CLI to forward webhook events:

```bash
stripe listen --forward-to localhost:3000/api/stripe
```

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start the Next.js development server |
| `build` | `npm run build` | Build the application for production (with `prisma generate`) |
| `start` | `npm run start` | Start the production server |
| `lint` | `npm run lint` | Run ESLint for code quality checks |
| `seed` | `npx prisma db seed` | Seed the database with sample data |
| `studio` | `npx prisma studio` | Open Prisma Studio (GUI database browser) |

---

## 🌐 Deployment

This application is optimized for deployment on **Vercel** (recommended for Next.js apps).

### Deployment Steps

1. Push the code to a GitHub repository.
2. Connect the repository to [Vercel](https://vercel.com/).
3. Configure the following environment variables in Vercel's dashboard:
   - `DATABASE_URL` (use a production PostgreSQL database, e.g., [Neon](https://neon.tech/))
   - `AUTH_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PRICE_ID`
   - `NEXT_PUBLIC_SERVER_URL` (set to your Vercel domain)
4. Deploy.

**Note**: For the Stripe webhook to work, configure the webhook endpoint in your Stripe dashboard to point to `https://taleex-petsoft.vercel.app/api/stripe`.

---

## 🙏 Acknowledgments

This project was built as part of the **[Professional React and Next.js](https://bytegrad.com/app/professional-react-and-nextjs/petsoft)** course by **ByteGrad**. The course provides in-depth training on building production-ready React and Next.js applications with modern best practices.

Special thanks to:
- **ByteGrad** for the comprehensive course content and project guidance.
- The **Next.js**, **Prisma**, **Tailwind CSS**, and **Stripe** teams for their excellent tools and documentation.

---

## 📄 License

This project is for educational purposes. Feel free to use it as a reference for your own learning and projects.