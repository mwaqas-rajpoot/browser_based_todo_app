# Data Model: 1-todo-phase2

**Feature**: Hackathon Todo – Phase II (Full-Stack Web App)
**Date**: 2026-02-04
**Status**: Complete

## Entity Definitions

### User Entity
**Description**: Represents a registered user in the system

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for user
- `email`: String (Unique, Indexed) - User's email address for login
- `hashed_password`: String - BCrypt hashed password
- `created_at`: DateTime - Timestamp when account was created
- `updated_at`: DateTime - Timestamp when account was last updated
- `is_active`: Boolean (Default: True) - Whether account is active

**Validation Rules**:
- Email must be valid email format
- Email must be unique across system
- Password must be properly hashed (never stored in plain text)

**State Transitions**: None (static account data)

### Task Entity
**Description**: Represents a todo item owned by a specific user

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for task
- `title`: String (Required, Max 255) - Task title
- `description`: String (Optional, Max 1000) - Task description
- `status`: Enum ('todo', 'in_progress', 'completed') - Current task status
- `due_date`: DateTime (Optional) - When task is due
- `priority`: Enum ('low', 'medium', 'high') - Task priority level
- `user_id`: UUID (Foreign Key to User.id, Indexed) - Owner of the task
- `created_at`: DateTime - Timestamp when task was created
- `updated_at`: DateTime - Timestamp when task was last updated

**Validation Rules**:
- Title is required and must be between 1-255 characters
- User_id must reference an existing user
- Status must be one of the defined enum values
- Priority must be one of the defined enum values

**State Transitions**:
- Status transitions: 'todo' → 'in_progress' → 'completed'
- Cannot transition from 'completed' back to other states without explicit re-opening

## Relationship Diagram

```
User (1) ←→ (Many) Task
User.id ←→ Task.user_id (Foreign Key)
```

## Business Rules

### User Isolation
- Users can only access tasks where `user_id` matches their own `id`
- Backend must verify user identity server-side regardless of frontend claims
- No cross-user access is permitted at database or application level

### Data Integrity
- Referential integrity enforced through foreign key constraints
- Cascading rules: When user is deleted, all their tasks are also deleted
- All timestamp fields automatically managed by system

## Indexes

### Required Indexes
- User.email (Unique Index) - for fast authentication lookups
- Task.user_id (Index) - for efficient user-specific queries
- Task.status (Index) - for status-based filtering
- Task.due_date (Index) - for due date sorting/filtering
- Task.created_at (Index) - for chronological ordering

## API Contract Implications

### Request/Response Models
- **UserCreateRequest**: { email, password }
- **UserLoginRequest**: { email, password }
- **TaskCreateRequest**: { title, description, due_date, priority }
- **TaskUpdateRequest**: { title, description, status, due_date, priority }
- **TaskResponse**: { id, title, description, status, due_date, priority, created_at, updated_at }

### Validation Requirements
- All API endpoints must validate incoming data against entity rules
- Server-side validation must occur regardless of client-side validation
- Proper error responses for validation failures with specific field information