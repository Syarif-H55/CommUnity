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
    role: 'admin' | 'organizer' | 'coordinator' | 'volunteer';
    profile_photo_url: string | null;
    created_at: string;
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type OrganizationRole = 'Penyelenggara' | 'Koordinator Event';

export interface Organization {
    id: string;
    name: string;
    description: string;
    logo: string | null;
    logo_url: string | null;
    verification_document: string | null;
    verification_status: VerificationStatus;
    verified_at: string | null;
    created_at: string;
    updated_at: string;
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
    total_members: number;
    pending_verification: number;
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
