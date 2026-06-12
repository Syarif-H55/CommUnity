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
