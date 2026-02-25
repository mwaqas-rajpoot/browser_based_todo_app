---
id: 1
title: update-project-constitution
stage: constitution
date: 2026-02-04
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: user
command: /sp.constitution
labels: [constitution, governance, setup]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
---

## Prompt

```text
You are Claude Code working inside a Spec-Kit driven monorepo.

Project Name: Hackathon Todo – Phase II (Full-Stack Web App)

Goal:
Transform an existing console-based Todo app into a secure, multi-user, full-stack web application using spec-driven development.

Core Rules:
- This is a monorepo (frontend + backend).
- Always read relevant specs from /specs before writing code.
- Follow instructions in all CLAUDE.md files (root, frontend, backend).
- Do NOT invent requirements that are not present in specs.
- Do NOT skip authentication or user isolation.
- Every task must be owned by a user (user_id).

Architecture:
- Frontend: Next.js 16+ (App Router, TypeScript, Tailwind)
- Backend: FastAPI + SQLModel
- Database: Neon Serverless PostgreSQL
- Auth: Better Auth (JWT-based)

Security Rules:
- All API routes require JWT authentication.
- JWT must be verified using shared secret: BETTER_AUTH_SECRET.
- Backend must NEVER trust user_id from frontend without verifying JWT.
- Users can only access their own tasks.
```

## Response snapshot

Updated the project constitution at .specify/memory/constitution.md with specific principles for the Hackathon Todo – Phase II project, incorporating the monorepo architecture, spec-driven development, authentication & user isolation, security-first approach, full-stack integration, and type safety requirements. The constitution includes governance rules and version tracking.

## Outcome

- ✅ Impact: Created new project constitution with 6 core principles and governance structure
- 🧪 Tests: N/A (documentation update)
- 📁 Files: Updated .specify/memory/constitution.md with project-specific governance
- 🔁 Next prompts: Continue with spec-driven development workflow
- 🧠 Reflection: Constitution properly reflects the security and architectural requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification process