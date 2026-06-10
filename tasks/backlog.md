# CommUnity Product Backlog

## Purpose

Dokumen ini berisi seluruh user story yang termasuk dalam scope MVP CommUnity.

Backlog digunakan sebagai sumber utama untuk menyusun sprint dan task implementasi.

Prioritas mengikuti MoSCoW yang telah ditetapkan pada PRD.

---

# Epic 1 - Authentication & Account Management

## US-001 User Registration

As a user

I want to create an account

So that I can access CommUnity features.

Priority:
Must Have

Acceptance Criteria:

- User can register using username, email, and password.
- Username must be unique.
- Email must be unique.
- Password is securely hashed.
- User receives successful registration confirmation.

---

## US-002 User Login

As a user

I want to log into the system

So that I can access my account.

Priority:
Must Have

Acceptance Criteria:

- User can login using username and password.
- Invalid credentials show an error message.
- Authentication token is generated.
- User session is maintained.

---

## US-003 Forgot Password

As a user

I want to reset my password

So that I can regain access to my account.

Priority:
Must Have

Acceptance Criteria:

- User can request password reset.
- User can create a new password.
- Old password becomes invalid.

---

## US-004 Manage Profile

As a user

I want to update my profile

So that my information remains accurate.

Priority:
Must Have

Acceptance Criteria:

- User can edit profile information.
- User can update profile picture.
- Changes are saved successfully.

---

# Epic 2 - Organization Management

## US-005 Register Organization

As an organizer

I want to register an organization

So that I can create social events.

Priority:
Must Have

Acceptance Criteria:

- Organizer can submit organization information.
- Organizer can upload verification documents.
- Organization status is stored as pending.

---

## US-006 Verify Organization

As a system administrator

I want to verify organizations

So that only legitimate organizations can organize events.

Priority:
Must Have

Acceptance Criteria:

- Admin can review organization data.
- Admin can approve organization.
- Admin can reject organization.
- Verification status is updated.

---

## US-007 Manage Organization Members

As an organizer

I want to manage organization members

So that responsibilities can be assigned appropriately.

Priority:
Must Have

Acceptance Criteria:

- Organizer can invite members.
- Organizer can assign roles.
- Member role is displayed correctly.

---

# Epic 3 - Event Management

## US-008 Create Event

As an organizer

I want to create a social event

So that volunteers can participate.

Priority:
Must Have

Acceptance Criteria:

- Organizer can create event.
- Event contains required information.
- Event is saved successfully.

---

## US-009 Edit Event

As an organizer

I want to update event information

So that volunteers receive accurate information.

Priority:
Must Have

Acceptance Criteria:

- Organizer can edit event details.
- Updated information is saved.

---

## US-010 Publish Event

As an organizer

I want to publish an event

So that it becomes visible to volunteers.

Priority:
Must Have

Acceptance Criteria:

- Event can be published.
- Published events appear in discovery page.

---

## US-011 Browse Events

As a volunteer

I want to browse available events

So that I can find activities to join.

Priority:
Must Have

Acceptance Criteria:

- Event list is displayed.
- Event details can be viewed.
- Only published events appear.

---

## US-012 Search & Filter Events

As a volunteer

I want to search and filter events

So that I can find relevant opportunities faster.

Priority:
Must Have

Acceptance Criteria:

- User can filter by category.
- User can filter by location.
- User can filter by date.
- Search results are updated correctly.

---

# Epic 4 - Volunteer Participation

## US-013 Register for Event

As a volunteer

I want to join an event

So that I can participate in community service activities.

Priority:
Must Have

Acceptance Criteria:

- Volunteer can register for an event.
- Registration status is recorded.
- Duplicate registrations are prevented.

---

## US-014 View Participation History

As a volunteer

I want to view my participation history

So that I can track my involvement.

Priority:
Must Have

Acceptance Criteria:

- Volunteer can see joined events.
- Volunteer can see participation status.
- Volunteer can see completed events.

---

# Epic 5 - Attendance Validation

## US-015 Generate Attendance QR

As an event coordinator

I want to generate attendance QR codes

So that attendance can be validated efficiently.

Priority:
Must Have

Acceptance Criteria:

- QR code is generated.
- QR code is unique for the event.
- QR code can be displayed during attendance.

---

## US-016 Validate Attendance

As a volunteer

I want to scan attendance QR codes

So that my attendance is recorded.

Priority:
Must Have

Acceptance Criteria:

- Attendance can be recorded.
- Attendance status is stored.
- Duplicate attendance is prevented.

---

# Epic 6 - Event Reporting

## US-017 Submit Event Report

As an event coordinator

I want to submit an event report

So that event completion can be documented.

Priority:
Must Have

Acceptance Criteria:

- Report can be submitted.
- Minimum one photo is required.
- Maximum five photos are allowed.
- Report status is stored.

---

## US-018 Review Event Report

As a system administrator

I want to review submitted reports

So that completed events can be validated.

Priority:
Must Have

Acceptance Criteria:

- Admin can review reports.
- Admin can approve reports.
- Admin can reject reports.
- Report status is updated.

---

# Epic 7 - Certificate Management

## US-019 Generate Digital Certificate

As a system

I want to generate certificates automatically

So that volunteers receive proof of participation.

Priority:
Must Have

Acceptance Criteria:

- Certificate is generated automatically.
- Certificate is linked to volunteer.
- Certificate information is stored.

---

## US-020 Download Certificate

As a volunteer

I want to download my certificate

So that I can use it as proof of participation.

Priority:
Must Have

Acceptance Criteria:

- Certificate can be downloaded as PDF.
- Downloaded file is valid.

---

# Epic 8 - Analytics Dashboard

## US-021 View Community Analytics

As an organizer

I want to view event statistics

So that I can evaluate community impact.

Priority:
Must Have

Acceptance Criteria:

- Total events displayed.
- Total volunteers displayed.
- Completed events displayed.
- Attendance rate displayed.

---

# Deferred Stories (Post-MVP)

## US-022 In-App Notifications

Priority:
Should Have

Status:
Deferred to v1.1

---

## US-023 Multi-Organization Membership Experience

Priority:
Should Have

Status:
Deferred to v1.1

---

# Backlog Summary

Total MVP User Stories:

21

Deferred User Stories:

2

Total User Stories:

23