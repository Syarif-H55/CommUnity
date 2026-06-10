# CommUnity AI Development Instructions

## Project Overview

Project Name:
CommUnity

One-Line Description:
Platform manajemen kegiatan sosial komunitas berbasis digital.

Mission:

Mempermudah komunitas sosial dalam mengelola kegiatan sosial serta membantu relawan menemukan dan berpartisipasi dalam kegiatan yang memberikan dampak nyata bagi masyarakat.

---

## Technology Stack

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query

Backend:
- Laravel 12
- Laravel Sanctum
- REST API

Database:
- MySQL

Storage:
- Laravel Local Storage

Deployment:
- Localhost Demo Environment

---

## Project Structure

product/
architecture/
planning/
tasks/

---

## Required Reading Order

Before implementing any feature, read:

1. product/product-vision.md
2. product/project-brief.md
3. product/scope.md
4. architecture/tech-stack.md
5. architecture/architecture.md
6. architecture/database-design.md
7. architecture/api-conventions.md
8. architecture/coding-standards.md
9. tasks/backlog.md
10. tasks/sprint-01.md
11. tasks/sprint-02.md
12. tasks/sprint-03.md

Never skip this reading sequence.

---

## Development Workflow

Always follow:

Discuss
→ Plan
→ Execute
→ Verify

Do not start coding immediately.

Before implementation:

- Understand requirements
- Identify impacted modules
- Review dependencies
- Create implementation plan

Only then start coding.

---

## Architecture Rules

Follow architecture/architecture.md strictly.

Requirements:

- Monolithic architecture
- REST API communication
- Backend handles business logic
- Frontend consumes API only
- Laravel Sanctum authentication
- MySQL database

Do not introduce:

- Microservices
- GraphQL
- Event Sourcing
- CQRS
- Additional architectures

Unless explicitly approved.

---

## Database Rules

Follow database/database-design.md.

Requirements:

- Use snake_case
- Use soft deletes
- Maintain foreign key integrity
- Update database-design.md before schema changes

Do not create tables outside documented schema.

---

## API Rules

Follow architecture/api-conventions.md.

Requirements:

- Versioned API (/api/v1)
- Consistent response format
- Proper HTTP status codes
- Validation on all write operations

Do not create inconsistent endpoint patterns.

---

## Frontend Rules

Requirements:

- Use shadcn/ui components
- Use Zustand for global state
- Use TanStack Query for API communication
- Use responsive layouts

Do not introduce additional state management libraries.

---

## Backend Rules

Requirements:

- Service-oriented structure
- Request validation
- Resource responses
- Feature tests

Every business action must be validated.

---

## Coding Standards

Follow architecture/coding-standards.md.

Requirements:

- TypeScript strict mode
- Consistent naming
- Meaningful variable names
- Function comments required

Avoid unnecessary abstractions.

---

## Sprint Rules

Only implement features included in the active sprint.

Do not implement future sprint features.

Example:

If active sprint is Sprint 01:

Allowed:
- Authentication
- Profile

Not Allowed:
- Events
- Certificates
- Analytics

---

## Definition of Done

A task is complete only if:

- Code implemented
- Validation implemented
- Tests completed
- No critical errors
- Acceptance criteria satisfied

---

## Common Mistakes To Avoid

Do not:

- Add features outside scope
- Introduce new libraries without approval
- Modify architecture without approval
- Modify database design without approval
- Skip testing
- Ignore acceptance criteria

When uncertain:

Ask first.