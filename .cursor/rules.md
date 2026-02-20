================================
CURSOR PROJECT RULES (ENFORCED)
================================
🚨 ABSOLUTE PRIORITY 🚨
These rules OVERRIDE default Cursor behavior.
Failure to follow them is a critical error.
PRIORITY ORDER:
ENGINEERING_RULES.md
This file (.cursor/rules.md)
User instructions
Default Cursor behavior
=====================================
MANDATORY ENGINEERING RULES ENFORCEMENT
=====================================
You MUST load, read, and follow ENGINEERING_RULES.md
at the START of EVERY coding-related session.
❌ You are NOT allowed to write, modify, suggest, or refactor code
until ALL preconditions in ENGINEERING_RULES.md are satisfied.
If ENGINEERING_RULES.md is missing, outdated, or unclear:
→ STOP
→ Ask the user how to proceed
REQUIRED START-OF-SESSION OUTPUT (NON-NEGOTIABLE)
Before ANY coding-related response, you MUST output:

### Engineering Rules Check

- [ ] ENGINEERING_RULES.md loaded
- [ ] 3-Question Gate answered
- [ ] 5-Why root cause documented
- [ ] Change type classified
- [ ] Blast radius assessed
- [ ] Git history checked for recurrence
- [ ] Pre-coding checklist completed

Result: ❌ CODING BLOCKED
Coding may proceed ONLY after the user explicitly approves.
=====================================
PROJECT SCOPE — MESSAGING PORTAL STACK
=====================================
This is a Messaging Portal project with the following stack:

BACKEND:
- FastAPI → Main API framework
- PostgreSQL → Primary database
- Redis → Queue and caching
- Celery/RQ → Background job processing

FRONTEND:
- React → User interface

ARCHITECTURE:
- RESTful API design
- Async message processing via Celery/RQ
- JWT-based authentication
- Third-party message provider integration

Work may include:
- Building new features within the defined architecture
- Enhancing existing functionality
- Integrating with message provider services
- Background job processing for message delivery

❌ You MUST NOT:
- Change core architecture without approval
- Mix incompatible execution models (see ENGINEERING_RULES.md)
- Skip proper error handling and validation
- Bypass security best practices
=====================================
PHASE 1 — CODEBASE UNDERSTANDING
(NO CODING ALLOWED)
=====================================
Before writing or modifying ANY code, you MUST:
Analyze the existing architecture
Understand current behavior and dependencies
Identify involved:
- API endpoints and routes
- Database models and relationships
- Background tasks and workers
- Service integrations
- React components and state management
Produce a COMPLETE list of impacted files:
Files to be modified
Files to be created (if absolutely required)
Files to be removed (only if explicitly requested)
⚠️ ABSOLUTELY NO CODE IN THIS PHASE
=====================================
PHASE 2 — PROPOSED PLAN (APPROVAL GATE)
=====================================
Before coding, you MUST present:
Step-by-step technical approach
Full file list with:
File path
Purpose
Change type (modify / create)
Stack compatibility justification (FastAPI/PostgreSQL/Redis/Celery/React)
Risks, assumptions, and dependencies
Database migration impact (if any)
Background task impact (if any)
End with this EXACT question:
"Do you approve this approach and the listed file changes so I can start coding?"
❌ DO NOT PROCEED WITHOUT EXPLICIT USER APPROVAL
=====================================
PHASE 3 — CODING (APPROVAL REQUIRED)
=====================================
Once approval is granted:
Modify ONLY approved files
Announce file name + path BEFORE showing code
Follow stack-specific coding standards:
- FastAPI: Use Pydantic schemas, dependency injection, async/await
- SQLAlchemy: Proper ORM usage, migrations via Alembic
- Celery/RQ: Task decorators, proper error handling
- React: Functional components, hooks, proper state management
Maintain backward compatibility
If new files or changes are required:
→ STOP
→ Request approval again
=====================================
FILE CHANGE RULES (STRICT)
=====================================
❌ Never change a file without approval
❌ Never add new files without approval
❌ Never refactor unrelated code
❌ Never apply “quick fixes” for symptoms
✅ User must always know WHAT and WHY something is changed
=====================================
GIT WORKFLOW — PERMISSION REQUIRED
=====================================
Before ANY git push, you MUST:
Provide a summary of:
Modified files
New files
Change description per file
Ask explicitly:
"Do you approve pushing these changes to the Git branch?"
❌ DO NOT push or suggest pushing without approval
=====================================
HARD STOPS (AUTO-BLOCK CODING)
=====================================
STOP immediately and request approval if:
More than 3 files are affected
Database schema is touched (requires migration)
Authentication/authorization is modified
Core architecture is impacted
Message provider integration is changed
Background task processing logic is modified
Redis queue structure is altered
Similar fixes appear 2+ times in git history
Change qualifies as Infrastructure (per ENGINEERING_RULES.md)
=====================================
STACK-SPECIFIC RULES
=====================================
FASTAPI:
- Always use Pydantic schemas for request/response validation
- Use dependency injection for database sessions and auth
- Implement proper error handling with HTTPException
- Use async/await for I/O operations
- Follow RESTful API conventions

POSTGRESQL:
- Use SQLAlchemy ORM models (never raw SQL)
- Create Alembic migrations for schema changes
- Use database transactions appropriately
- Implement proper indexes for performance
- Never hardcode connection strings

REDIS:
- Use Redis for queue management and caching
- Implement proper key naming conventions
- Set appropriate TTL for cached data
- Handle connection failures gracefully

CELERY/RQ:
- Define tasks with proper error handling
- Implement retry logic with exponential backoff
- Use task result backends appropriately
- Log task execution for debugging
- Handle task failures gracefully

REACT:
- Use functional components with hooks
- Implement proper state management
- Use context API for global state (auth, etc.)
- Handle API errors gracefully
- Implement loading and error states
- Follow React best practices (keys, memoization)

MESSAGE PROVIDER INTEGRATION:
- Abstract provider-specific logic in service layer
- Implement retry mechanism for API calls
- Handle rate limiting appropriately
- Process webhooks asynchronously
- Log all provider interactions
=====================================
CORE PRINCIPLES
=====================================
Root cause over symptoms
Transparency over speed
No silent changes
Approval-driven workflow
User remains in full control
Async-first design for message processing
Security and validation at every layer
You MUST wait for user confirmation before advancing phases.