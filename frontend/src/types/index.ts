export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface User {
    id: string;
    full_name: string;
    email: string;
    username: string;
    is_admin: boolean;
    profile_photo_url: string | null;
    created_at: string;
}

export interface UserRoleContext {
    is_admin: boolean;
    organizations: OrganizationMembership[];
    is_organizer: boolean;
    is_coordinator: boolean;
}

export interface OrganizationMembership {
    id: string;
    name: string;
    role: 'Penyelenggara' | 'Koordinator Event';
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type OrganizationRole = 'Penyelenggara' | 'Koordinator Event';

export interface Organization {
    id: string;
    name: string;
    description: string;
    organization_email?: string | null;
    logo: string | null;
    logo_url: string | null;
    verification_document: string | null;
    verification_status: VerificationStatus;
    rejection_reason?: string | null;
    verified_at: string | null;
    created_at: string;
    updated_at: string;
    members_count?: number;
    member_count?: number;
    event_count?: number;
    role?: OrganizationRole;
}

export interface OrganizationMember {
    id: string;
    organization_id: string;
    user_id: string;
    user: Pick<User, 'id' | 'full_name' | 'username' | 'profile_photo_url'>;
    role: OrganizationRole;
    joined_at: string;
}

export interface OrganizationRegistrationRequest {
    name: string;
    description: string;
    logo?: File;
}

export interface OrganizationUpdateRequest {
    name?: string;
    description?: string;
    logo?: File;
}

export interface OrganizationDocumentUpload {
    document: File;
}

export interface DashboardStats {
    total_organizations: number;
    total_events: number;
    total_users: number;
    pending_verification: number;
    recent_events?: {
        id: string;
        title: string;
        status: string;
        start_time: string;
        organization_name: string | null;
        created_at: string;
    }[];
    recent_users?: {
        id: string;
        full_name: string;
        username: string;
        email: string;
        is_admin: boolean;
        created_at: string;
    }[];
}

export interface EventFilters {
    search?: string;
    category_id?: number;
    city?: string;
    province?: string;
    date?: string;
    sort?: string;
    per_page?: number;
    page?: number;
}

export interface DiscoverResponse {
    data: Event[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface Event {
    id: string;
    organization_id: string;
    organization_name?: string;
    coordinator_id: string;
    coordinator_name?: string;
    category_id: number;
    category_name?: string;
    title: string;
    description: string;
    province: string | null;
    city: string | null;
    location_name: string | null;
    quota: number;
    event_date: string;
    start_time: string;
    end_time: string;
    banner_url: string | null;
    status: EventStatus;
    current_participants: number;
    created_at: string;
    updated_at: string;
}

export interface CreateEventRequest {
    category_id: number;
    title: string;
    description?: string;
    province?: string;
    city?: string;
    location_name?: string;
    quota: number;
    event_date: string;
    start_time: string;
    end_time: string;
    banner?: File;
}

export interface UpdateEventRequest {
    category_id?: number;
    title?: string;
    description?: string;
    province?: string;
    city?: string;
    location_name?: string;
    quota?: number;
    event_date?: string;
    start_time?: string;
    end_time?: string;
    banner?: File;
}

export interface VolunteerRegistration {
    id: string;
    event_id: string;
    volunteer_id: string;
    event: Event;
    registered_at: string;
    created_at: string;
}

export interface RegistrationFilters {
    status?: string;
    per_page?: number;
    page?: number;
}

export interface EventCategory {
    id: number;
    name: string;
}

export interface EventQueryParams {
    search?: string;
    category_id?: string | number;
    city?: string;
    date?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
    page?: number;
    per_page?: number;
}

export interface RegistrationPaginatedResponse {
    data: VolunteerRegistration[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export type AttendanceStatus = 'present' | 'late' | 'absent';

export interface Attendance {
    id: string;
    event_id: string;
    volunteer_id: string;
    volunteer: Pick<User, 'id' | 'full_name' | 'username' | 'profile_photo_url'>;
    attendance_status: AttendanceStatus;
    attendance_time: string;
    validated_by: string | null;
    validator?: Pick<User, 'id' | 'full_name'>;
    event?: Event;
    created_at: string;
}

export interface AttendanceSummary {
    total_registered: number;
    present: number;
    late: number;
    absent: number;
    attendance_rate: number;
}

export interface QRData {
    event_id: string;
    event_title: string;
    qr_content: string;
}

export interface AttendanceFilters {
    status?: string;
    per_page?: number;
    page?: number;
}

export type ReportStatus = 'draft' | 'submitted' | 'approved' | 'revision_requested';

export interface ReportPhoto {
    id: string;
    report_id: string;
    image_url: string;
    created_at: string;
}

export interface EventReport {
    id: string;
    event_id: string;
    event_title?: string;
    submitted_by: string;
    submitter_name?: string;
    summary: string | null;
    total_attendees: number | null;
    report_status: ReportStatus;
    rejection_reason: string | null;
    photos: ReportPhoto[];
    submitted_at: string | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateReportRequest {
    summary?: string;
    total_attendees?: number;
    photos?: File[];
}

export interface UpdateReportRequest {
    summary?: string;
    total_attendees?: number;
}

export interface ReviewReportRequest {
    action: 'approved' | 'revision_requested';
    rejection_reason?: string;
}

export interface AiGenerateReportResponse {
    summary: string;
    sections: {
        summary?: string;
        attendance?: string;
        impact?: string;
    };
    provider: string;
}

export interface AnalyticsData {
    total_events: number;
    total_volunteers: number;
    completed_events: number;
    attendance_rate: number;
}

export interface Certificate {
    id: string;
    volunteer_id: string;
    volunteer_name?: string;
    event_id: string;
    event_title?: string;
    event_date?: string;
    organization_name?: string;
    certificate_number: string;
    pdf_url: string | null;
    issued_at: string | null;
    created_at: string;
}
