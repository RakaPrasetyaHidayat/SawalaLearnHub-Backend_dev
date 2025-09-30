---
description: Repository Information Overview
alwaysApply: true
---

# Sawala Learnhub Information

## Summary
Sawala Learnhub is a Next.js web application designed for learning management. It appears to be an internship project from 2025 that provides user management, division-based organization, and task management functionality.

## Structure
- **src/app**: Next.js application routes and pages
- **src/components**: React components organized in atomic design pattern (atoms, molecules, organisms, templates, pages)
- **src/services**: API services for data fetching and authentication
- **src/hooks**: Custom React hooks for data fetching and state management
- **src/utils**: Utility functions including authentication and error handling
- **src/data**: Static data resources
- **public**: Static assets including images and icons

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript targeting ES2017
**Build System**: Next.js (v15.5.3)
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React (v19.1.0) and React DOM (v19.1.0)
- Next.js (v15.5.3)
- Radix UI components (various UI primitives)
- Tailwind CSS (v4.1.13)
- date-fns (v4.1.0)
- recharts (v2.15.4)
- shadcn (v3.3.1)

**Development Dependencies**:
- TypeScript (v5)
- Webpack (v5.101.3)
- PostCSS (v8.5.6)
- Tailwind CSS tooling
- ts-morph (v27.0.0)

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

## Main Files & Resources
**Entry Points**:
- `src/app/page.tsx`: Main application entry point
- `src/app/layout.tsx`: Root layout component
- `src/app/login/page.tsx`: Login page
- `src/app/register/page.tsx`: Registration page
- `src/app/admin/*`: Admin section pages

**Configuration Files**:
- `next.config.mjs`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `.env`: Environment variables for API endpoints and division IDs

**API Services**:
- `src/services/api.ts`: API service setup
- `src/services/authService.ts`: Authentication service
- `src/services/userService.ts`: User management service
- `src/services/tasksService.ts`: Task management service
- `src/services/division.ts`: Division management service

## Project Architecture
The project follows a typical Next.js App Router structure with client-side components. It uses an atomic design pattern for component organization and implements custom hooks for data fetching. The application connects to a backend API (hosted on Vercel) for data persistence and authentication.

The UI is built using Radix UI primitives with Tailwind CSS for styling. The application appears to be a mobile-first design with a fixed width of 360px, suggesting it's primarily designed for mobile devices.