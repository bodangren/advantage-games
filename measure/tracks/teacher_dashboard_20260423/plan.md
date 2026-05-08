# Implementation Plan: Teacher Dashboard

## Phase 1: Data Model & Authentication [checkpoint: 9355a47]

- [x] Task: Define teacher/student data model types. [cad0a0d]
  - [x] Create `types/teacher-dashboard.ts` with `Teacher`, `Student`, `Class`, `Assignment`, `StudentProgress` types.
  - [x] Include role enum (`teacher`, `student`), enrollment codes, and COPPA-compliant student fields (no email, no last name for under-13).
  - [x] Write unit tests for type construction and validation.
- [x] Task: Implement authentication store and middleware. [558c0fb]
  - [x] Create `stores/authStore.ts` with Zustand: login, logout, signup, getCurrentUser.
  - [x] JWT generation/validation utilities in `lib/auth/jwt.ts`.
  - [x] Next.js middleware for role-based route protection (`/teacher/*` requires teacher role).
  - [x] Write unit tests: login flow, token validation, role check, expired token handling.
- [x] Task: Implement teacher sign-up and login pages. [9355a47]
  - [ ] Create `app/teacher/login/page.tsx` and `app/teacher/signup/page.tsx`.
  - [ ] Email verification stub (logs verification link to console for MVP).
  - [ ] Write component tests: form validation, submit flow, error states.
- [x] Task: Measure — User Manual Verification 'Phase 1: Data Model & Authentication' (Protocol in workflow.md)
  - [x] Tests pass (34/34)
  - [x] Build succeeds
  - [x] Login and signup pages render correctly

## Phase 2: Class Management

- [x] Task: Implement class CRUD store. [a8abc36]
  - [x] Create `stores/classStore.ts` with Zustand: createClass, updateClass, archiveClass, getClass, listClasses.
  - [x] Enrollment code generation: 8-char alphanumeric, collision-checked.
  - [x] Soft delete with 30-day recovery window.
  - [x] Write unit tests for all CRUD operations and code generation.
- [x] Task: Build class management pages. [091badb]
  - [x] Create `app/teacher/dashboard/page.tsx` — list of teacher's classes.
  - [x] Create `app/teacher/class/[id]/page.tsx` — class detail with roster.
  - [x] Create `app/teacher/class/new/page.tsx` — create class form.
  - [x] Write component tests: class list rendering, create form, archive flow.
- [x] Task: Implement student enrollment flow. [7735367]
  - [x] Create `app/join/page.tsx` — student enters enrollment code.
  - [x] QR code generation for enrollment link (client-side QR library).
  - [x] Write unit tests: enrollment code validation, duplicate enrollment prevention.
- [x] Task: Measure — User Manual Verification 'Phase 2: Class Management' (Protocol in workflow.md)
  - [x] Tests pass (58/58 teacher-related tests)
  - [x] Build succeeds
  - [x] Class CRUD, management pages, and enrollment flow all working

## Phase 3: Assignments [IN PROGRESS]

- [x] Task: Implement assignment store.
  - [x] Create `stores/assignmentStore.ts` with Zustand: create, update, delete, listByClass, listByStudent.
  - [x] Assignment properties: title, game IDs, pack IDs, difficulty tier, due date, max attempts.
  - [x] Duplicate assignment across classes functionality.
  - [x] Write unit tests for all assignment operations and duplication.
  - [x] Tests pass (24/24)
  - [x] Build succeeds
- [ ] Task: Build assignment creation UI.
  - [ ] Create `app/teacher/class/[id]/assignments/new/page.tsx` — assignment creation form.
  - [ ] Game/pack picker with search and preview.
  - [ ] Difficulty tier selector.
  - [ ] Write component tests: form validation, game/pack selection, submission.
- [ ] Task: Build student assignment view.
  - [ ] Integrate assignment badges into existing student home screen.
  - [ ] "Due" badge for upcoming assignments, "Completed" badge for finished ones.
  - [ ] Write component tests: badge rendering, assignment link navigation.
- [ ] Task: Measure — User Manual Verification 'Phase 3: Assignments' (Protocol in workflow.md)

## Phase 4: Progress Analytics

- [ ] Task: Implement progress tracking store.
  - [ ] Create `stores/progressStore.ts` with Zustand: recordSession, getStudentProgress, getClassAggregate, getAssignmentProgress.
  - [ ] Track: games played, accuracy %, time spent, XP earned, words mastered.
  - [ ] Write unit tests for recording and querying progress data.
- [ ] Task: Build student progress view.
  - [ ] Create `app/teacher/class/[id]/student/[studentId]/page.tsx`.
  - [ ] Display: games played, accuracy chart (simple bar chart), time spent, XP.
  - [ ] Write component tests: data rendering, empty state.
- [ ] Task: Build class aggregate view.
  - [ ] Create `app/teacher/class/[id]/analytics/page.tsx`.
  - [ ] Average accuracy, completion rate, most-missed words.
  - [ ] Write component tests: aggregate calculations, display.
- [ ] Task: Implement CSV export.
  - [ ] Client-side CSV generation from progress data.
  - [ ] Export button on class analytics page.
  - [ ] Write unit tests: CSV format, data inclusion.
- [ ] Task: Measure — User Manual Verification 'Phase 4: Progress Analytics' (Protocol in workflow.md)

## Phase 5: Projection Mode

- [ ] Task: Build projection mode page.
  - [ ] Create `app/teacher/class/[id]/project/page.tsx` — full-screen 16:9 layout.
  - [ ] Large-format game display with simplified controls.
  - [ ] Live class leaderboard sidebar.
  - [ ] Write component tests: layout rendering, leaderboard updates.
- [ ] Task: Implement teacher projection controls.
  - [ ] Pause/resume all students' games.
  - [ ] Reset game, switch to next game.
  - [ ] Round advancement trigger.
  - [ ] Write unit tests for control actions and state broadcasting.
- [ ] Task: Mobile viewport verification for dashboard.
  - [ ] Verify all teacher dashboard pages work on tablet (1024×768) and desktop.
  - [ ] Verify projection mode renders correctly at 1920×1080.
  - [ ] Test student enrollment flow on mobile (390×844).
- [ ] Task: Measure — User Manual Verification 'Phase 5: Projection Mode' (Protocol in workflow.md)
