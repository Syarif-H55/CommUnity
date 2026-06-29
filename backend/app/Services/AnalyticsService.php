<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getOrganizationAnalytics(Organization $organization): array
    {
        $totalEvents = $this->getTotalEvents($organization);
        $totalVolunteers = $this->getTotalVolunteers($organization);
        $completedEvents = $this->getCompletedEvents($organization);
        $attendanceRate = $this->getAttendanceRate($organization);

        return [
            'total_events' => $totalEvents,
            'total_volunteers' => $totalVolunteers,
            'completed_events' => $completedEvents,
            'attendance_rate' => $attendanceRate,
        ];
    }

    public function getTotalEvents(Organization $organization): int
    {
        return Event::where('organization_id', $organization->id)->count();
    }

    public function getTotalVolunteers(Organization $organization): int
    {
        return DB::table('volunteer_registrations')
            ->join('events', 'events.id', '=', 'volunteer_registrations.event_id')
            ->where('events.organization_id', $organization->id)
            ->distinct('volunteer_registrations.volunteer_id')
            ->count('volunteer_registrations.volunteer_id');
    }

    public function getCompletedEvents(Organization $organization): int
    {
        return Event::where('organization_id', $organization->id)
            ->where('status', 'completed')
            ->count();
    }

    public function getAttendanceRate(Organization $organization): float
    {
        $result = DB::table('attendances')
            ->join('events', 'events.id', '=', 'attendances.event_id')
            ->where('events.organization_id', $organization->id)
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN attendances.status IN (?, ?) THEN 1 ELSE 0 END) as attended
            ', ['present', 'late'])
            ->first();

        if (!$result || $result->total === 0) {
            return 0.0;
        }

        return round(($result->attended / $result->total) * 100, 2);
    }
}
