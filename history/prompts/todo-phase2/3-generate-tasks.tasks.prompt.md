---
id: 3
title: generate-tasks
stage: tasks
date: 2026-02-04
surface: agent
model: Claude Sonnet 4.5
feature: todo-phase2
branch: 1-todo-phase2
user: user
command: /sp.tasks
labels: [tasks, planning, implementation, backend, frontend, security]
links:
  spec: specs/1-todo-phase2-spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-todo-phase2/tasks.md
tests:
---

## Prompt

```text
You are a technical project manager.

From the existing Phase II specs, break the project into small, concrete implementation tasks.

Each task must:
- Reference at least one spec file (e.g. @specs/features/task-crud.md)
- Be atomic and testable
- Clearly state backend or frontend scope
- Include expected outcome

Group tasks into:
1. Spec validation tasks
2. Backend tasks
3. Authentication & security tasks
4. Frontend UI tasks
5. Integration & testing tasks

Do NOT write code.
Do NOT change specs.
```

## Response snapshot

Generated comprehensive task breakdown for Hackathon Todo Phase II project with 48 specific, actionable tasks organized across 5 phases. Tasks are grouped by user story priority (P1, P1, P2) and include both backend and frontend responsibilities. All constitutional requirements (authentication, user isolation, security) are incorporated into the task structure. Each task follows the required format with checkboxes, IDs, parallelism indicators, and story labels where appropriate.

## Outcome

- ✅ Impact: Complete task breakdown enabling parallel development
- 🧪 Tests: N/A (planning artifact)
- 📁 Files: Created tasks.md with 48 specific implementation tasks
- 🔁 Next prompts: Ready for development implementation
- 🧠 Reflection: Tasks properly organized by user story with security requirements integrated

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin task implementation