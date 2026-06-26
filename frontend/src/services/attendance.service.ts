import api from './api';
import { ApiResponse, Attendance, AttendanceSummary, AttendanceFilters, PaginatedResponse, QRData, AttendanceStatus } from '@/types';

export const attendanceService = {
    getQRData: (eventId: string) =>
        api.get<ApiResponse<QRData>>(`/events/${eventId}/attendance/qr`),

    scanAttendance: (eventId: string, data: { qr_content: string }) =>
        api.post<ApiResponse<Attendance>>(`/events/${eventId}/attendance/scan`, data),

    manualAttendance: (eventId: string, data: { volunteer_id: string; status: AttendanceStatus }) =>
        api.post<ApiResponse<Attendance>>(`/events/${eventId}/attendance/manual`, data),

    updateAttendance: (eventId: string, attendanceId: string, data: { status: AttendanceStatus }) =>
        api.put<ApiResponse<Attendance>>(`/events/${eventId}/attendance/${attendanceId}`, data),

    getEventAttendances: (eventId: string, params?: AttendanceFilters) =>
        api.get<PaginatedResponse<Attendance>>(`/events/${eventId}/attendance`, { params }),

    getAttendanceSummary: (eventId: string) =>
        api.get<ApiResponse<AttendanceSummary>>(`/events/${eventId}/attendance/summary`),

    getMyAttendances: (params?: AttendanceFilters) =>
        api.get<PaginatedResponse<Attendance>>('/my-attendances', { params }),
};
