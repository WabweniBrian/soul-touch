# Staff Attendance Tracking System for Soul Touch Academy - PRD

## Introduction

This document outlines the requirements for developing a Staff Attendance Tracking System for Soul Touch Academy, a private primary school in Makerere, Kikoni, Uganda. The system replaces manual, paper-based attendance tracking with a digital solution to improve accuracy, accountability, and administrative efficiency.

**Tech Stack:**

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn UI
- Prisma ORM
- Server actions & server components

**Design Priorities:**

- Modularity
- Simplicity
- Usability for non-technical users (teachers, admin staff)
- Two roles: ADMIN (full access), STAFF (personal attendance only)

## Objectives

- Replace manual attendance registers with a digital platform
- Enable real-time attendance recording and history tracking
- Provide exportable analytics for decision-making
- Support user/staff management with role-based access
- Implement notifications for attendance alerts
- Ensure a simple, intuitive interface

## Scope

Web-based application, accessible via desktop, tablet, and smartphone. Modular architecture for maintainability and scalability.

---

## Features

### 1. Record Attendance

**Description:**  
STAFF log attendance (check-in/check-out); ADMIN monitor or record for staff.

**Functionality:**

- STAFF: Check-in/out daily via buttons
- ADMIN: View/record for any staff
- Records include timestamps, stored securely

**Implementation:**

- Server action for attendance submission
- Server component for attendance form
- Shadcn UI buttons/forms, styled with TailwindCSS
- Validation: Prevent duplicate check-in/out cycles

**User Flow:**

- STAFF: `/attendance/record` → "Check-In"/"Check-Out"
- ADMIN: `/attendance` → select staff, record attendance

**Role Access:**

- STAFF: Own attendance
- ADMIN: All attendance

** Pages:**

- Dashboard: `/`
- Attendance: `/attendance` with history and record options + export and filter options
- Users: `/users`
- Analytics: `/analytics`
- Notifications: `/notifications`
- Profile: `/profile`

---

### 2. Check Attendance History

**Description:**  
View attendance records over a period.

**Functionality:**

- STAFF: View own history (week, month)
- ADMIN: View any staff history
- Filter by date range/staff (ADMIN)

**Implementation:**

- Server component: fetch records via Prisma
- Shadcn UI table, styled with TailwindCSS
- Date range picker

**User Flow:**

- STAFF: `/attendance/history`
- ADMIN: `/attendance/history` → select/filter

**Role Access:**

- STAFF: Own history
- ADMIN: All histories

---

### 3. Logout

**Description:**  
Securely logs out user.

**Functionality:**

- Terminates session, redirects to login

**Implementation:**

- Server action (NextAuth.js)
- Shadcn UI button in navbar

**User Flow:**

- Click "Logout" → `/login`

**Role Access:**

- STAFF & ADMIN

---

### 4. Analytics (Exportable)

**Description:**  
Attendance analytics for ADMIN, with export options.

**Functionality:**

- Reports: trends, absenteeism, punctuality
- Filter by staff/department/date
- Export as CSV/PDF

**Implementation:**

- Server component: aggregated data (Prisma)
- Shadcn UI charts
- Server action: generate/download CSV/PDF
- TailwindCSS for layout

**User Flow:**

- ADMIN: `/analytics` → filter, view, export

**Role Access:**

- STAFF: No access
- ADMIN: Full access

---

### 5. Users and Staff Management

**Description:**  
ADMIN manages user accounts and staff profiles.

**Functionality:**

- Create/update/deactivate accounts
- Assign roles
- Edit staff details

**Implementation:**

- Server component: fetch/display data
- Shadcn UI forms/tables
- Server actions for CRUD

**User Flow:**

- ADMIN: `/users` → manage users/staff

**Role Access:**

- STAFF: No access
- ADMIN: Full access

---

### 6. Notifications

**Description:**  
Alerts for attendance events.

**Functionality:**

- STAFF: Missed check-ins/out (in-app)
- ADMIN: Absenteeism/system issues
- Optional: Email notifications

**Implementation:**

- Server action: trigger notifications
- Shadcn UI toast notifications
- Email integration (optional)

**User Flow:**

- STAFF: Toast for missed check-ins
- ADMIN: Notifications for absenteeism/issues

**Role Access:**

- STAFF: Personal notifications
- ADMIN: All notifications

---

## Technical Requirements

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + Shadcn UI
- **Database:** Prisma ORM + MySQL
- **Authentication:** NextAuth.js
- **Hosting:** Cloud (e.g., Vercel)
- **Security:** HTTPS, SHA-256, role-based access, Uganda Data Protection compliance
- **Compatibility:** Chrome, Firefox, Edge, Safari
- **Modular Design:** Separate modules for attendance, analytics, user management, notifications

---

## Non-Technical Considerations

- **User-Friendliness:** Simple UI, clear prompts, minimal clicks
- **Training:** Initial sessions + user guide
- **Scalability:** Future growth support
- **Cost-Effectiveness:** Open-source tools, cloud hosting

---

## Development Guidelines for LLMs

- **Code Structure:**
  - `/app`: routes
  - `/components`: reusable UI
  - `/lib`: utilities
  - `/prisma`: schema/database logic
- **Server Components:** Data fetching (attendance, analytics)
- **Server Actions:** Form submissions (attendance, user management)
- **UI:** Shadcn UI + TailwindCSS
- **Prisma:** Models per schema, relationships, indexes
- **Error Handling:** User-friendly messages, logging
- **Testing:** Unit tests (server actions), integration tests (critical workflows)
- **Documentation:** Inline comments, README, user guide
