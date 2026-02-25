<!--
Sync Impact Report:
- Version change: N/A -> 1.0.0
- Modified principles: N/A (new constitution)
- Added sections: All principles and sections for Hackathon Todo project
- Removed sections: None (new document)
- Templates requiring updates: ✅ Updated
- Follow-up TODOs: None
-->
# Hackathon Todo – Phase II (Full-Stack Web App) Constitution

## Core Principles

### I. Monorepo Architecture
Full-stack application developed in single repository with clear separation of concerns between frontend and backend services; Frontend and backend must be independently deployable while maintaining shared interfaces; Strict boundary enforcement between layers to prevent circular dependencies.

### II. Spec-Driven Development
All development work must be guided by formal specifications stored in /specs; No feature implementation without corresponding spec; Specs serve as source of truth and must be updated before implementation begins.

### III. Authentication & User Isolation (NON-NEGOTIABLE)
Every API endpoint requires JWT authentication using Better Auth; User identity must be verified server-side using BETTER_AUTH_SECRET; Users can only access their own data - no cross-user access allowed; Authentication headers validated on every request.

### IV. Security-First Approach
No user_id trusted from frontend without JWT verification; Input validation required at all entry points; Sanitized outputs to prevent XSS; Parameterized queries to prevent SQL injection; Secure session management with proper token handling.

### V. Full-Stack Integration
Frontend (Next.js 16+, TypeScript, Tailwind) communicates with Backend (FastAPI + SQLModel) via secure API calls; Consistent data models across frontend and backend; Proper error handling and user feedback across both layers; Unified testing strategy covering full stack.

### VI. Type Safety & Modern Frameworks
TypeScript used throughout for compile-time safety; Strict typing enforced for all API contracts; Next.js App Router leveraged for modern SSR/SSG patterns; Tailwind CSS for consistent styling; FastAPI for automatic API documentation and validation.

## Technical Constraints

### Database & Persistence
Neon Serverless PostgreSQL as primary data store; SQLModel for ORM and schema management; Proper indexing and query optimization; Database migrations managed through proper migration system; Connection pooling and resource management.

### Authentication System
Better Auth for JWT-based authentication; Shared BETTER_AUTH_SECRET between frontend and backend; Refresh token management; Proper session invalidation; Password security with bcrypt or similar.

### API Design Standards
RESTful API design with proper HTTP status codes; JSON request/response format; Proper error messaging with status codes; Rate limiting where appropriate; Input validation and sanitization.

## Development Workflow

### Code Quality Standards
TypeScript strict mode enabled; ESLint and Prettier for code formatting; Comprehensive unit and integration tests; Proper documentation for public APIs; Code reviews required for all PRs.

### Security Practices
Regular dependency vulnerability scanning; Secure credential management; No hardcoded secrets in code; Environment variables for configuration; Regular security audits.

### Testing Requirements
Unit tests for all business logic; Integration tests for API endpoints; End-to-end tests for critical user flows; Security-focused penetration testing; Performance testing for key operations.

## Governance

All code changes must comply with these constitutional principles; Amendments require explicit team consensus and documented approval; Pull requests rejected if not meeting constitutional standards; Code reviews must verify constitutional compliance; New features forbidden without proper spec alignment.

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04