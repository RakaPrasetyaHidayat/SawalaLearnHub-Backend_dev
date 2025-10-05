# API Implementation Guide - Task Submission & User Management

## Overview
This guide covers the implementation of 4 key API endpoints for the Sawala Learnhub application:

1. Get users by division (per channel_year)
2. Approve user (admin only)
3. Get task submission (by taskId) showing description + file_urls
4. Update submission status (admin only)

All functions are implemented with proper error handling, authentication, and user-friendly error messages.

## Implementation Files

### Modified Files:
- `src/services/userService.ts` - Added `fetchUsersByDivision()` and `approveUser()`
- `src/services/tasksService.ts` - Added `getTaskSubmissionByTaskId()` and `updateSubmissionStatus()`
- `src/services/examples.ts` - Added comprehensive usage examples

### New Files:
- `API_IMPLEMENTATION_GUIDE.md` - This documentation
- `test-api-functions.js` - Basic test script

## API Functions Reference

### 1. fetchUsersByDivision(divisionId, year?)
**File**: `src/services/userService.ts`
**Purpose**: Get users by division, optionally filtered by channel_year

```typescript
import { fetchUsersByDivision } from '@/services/userService';

// Get grouped counts per year (no year parameter)
const counts = await fetchUsersByDivision('division-uuid');
// Returns: [{ channel_year: 2024, count: 12 }, { channel_year: 2025, count: 15 }]

// Get users for specific year
const users = await fetchUsersByDivision('division-uuid', 2025);
// Returns: [{ id, full_name, email, role, channel_year, division_id }, ...]
```

**Error Handling**: Handles 400 (invalid division), 401 (unauthenticated)

### 2. approveUser(userId, role)
**File**: `src/services/userService.ts`
**Purpose**: Admin approves user and sets role

```typescript
import { approveUser } from '@/services/userService';

const result = await approveUser('user-uuid', 'SISWA'); // or 'ADMIN'
// Returns: { status: "success", message: "User approved", data: { ... } }
```

**Requirements**: Requires admin JWT token
**Allowed Roles**: "SISWA" or "ADMIN"
**Error Handling**: Handles 400 (invalid role), 401/403 (not admin)

### 3. TasksService.getTaskSubmissionByTaskId(taskId)
**File**: `src/services/tasksService.ts`
**Purpose**: Get current user's submission for a task

```typescript
import { TasksService } from '@/services/tasksService';

const submission = await TasksService.getTaskSubmissionByTaskId('task-uuid');
// Returns: {
//   id, task_id, user_id, description,
//   file_urls: ["https://...", "https://..."],
//   submission_status, created_at, updated_at
// }
```

**Error Handling**: Handles 404 (no submission found), 401 (unauthenticated)

### 4. TasksService.updateSubmissionStatus(taskId, userId, status, feedback?)
**File**: `src/services/tasksService.ts`
**Purpose**: Admin updates submission status with optional feedback

```typescript
import { TasksService } from '@/services/tasksService';

const result = await TasksService.updateSubmissionStatus(
  'task-uuid',
  'user-uuid',
  'APPROVED',
  'Excellent work!'
);
// Returns: { status: "success", message: "Task submission reviewed successfully", data: { ... } }
```

**Requirements**: Requires admin JWT token
**Error Handling**: Handles 401 (auth), 403 (not admin), 404 (submission not found)

## Usage Examples

See `src/services/examples.ts` for complete examples including:

- `fetchUsersByDivisionExample()` - Get users/counts by division
- `fetchDivisionCountsExample()` - Get year-based counts
- `approveUserExample()` - Approve user with role assignment
- `getTaskSubmissionExample()` - Get submission details
- `updateSubmissionStatusExample()` - Update submission status
- `reviewSubmissionWorkflow()` - Complete review workflow

## Error Handling Strategy

All functions implement comprehensive error handling:

1. **Authentication Errors (401)**: Clear messages about login requirements
2. **Authorization Errors (403)**: Admin-only access messages
3. **Not Found Errors (404)**: Specific messages for missing resources
4. **Validation Errors (400)**: Clear validation messages
5. **Network/Server Errors (5xx)**: User-friendly retry messages
6. **Timeout Errors**: Connection issue guidance

## Testing

Run the test script:
```bash
node test-api-functions.js
```

This will test all functions (expect auth errors for protected endpoints).

## Integration Notes

- All functions use the existing `apiFetcher` for consistent authentication
- JWT tokens are automatically attached from localStorage
- Error responses follow the API's `{ status, message, data }` format
- Functions are designed to work with existing UI components and hooks

## Deadline Notes

✅ **Completed Features**:
- All 4 API functions implemented
- Comprehensive error handling
- Authentication integration
- TypeScript types and documentation
- Usage examples and test script

The implementation minimizes errors by:
- Using existing patterns from codebase
- Consistent error handling across all functions
- Proper TypeScript typing
- Following the established service architecture