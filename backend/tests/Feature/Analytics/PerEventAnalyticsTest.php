<?php

namespace Tests\Feature\Analytics;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\EventReport;
use App\Models\Organization;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PerEventAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    private User $organizer;
    private User $coordinator;
    private User $volunteer;
    private Organization $organization;
    private EventCategory $category;
    private Event $completedEvent1;
    private Event $completedEvent2;
    private Event $draftEvent;
    private string $organizerToken;
    private string $coordinatorToken;
    private string $volunteerToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = EventCategory::create(['name' => 'Lingkungan']);

        $this->organizer = User::factory()->create([
            'full_name' => 'Penyelenggara',
            'username' => 'penyelenggara',
            'email' => 'penyelenggara@example.com',
        ]);

        $this->coordinator = User::factory()->create([
            'full_name' => 'Koordinator',
            'username' => 'koordinator',
            'email' => 'koordinator@example.com',
        ]);

        $this->volunteer = User::factory()->create([
            'full_name' => 'Relawan',
            'username' => 'relawan',
            'email' => 'relawan@example.com',
        ]);

        $this->organization = Organization::create([
            'name' => 'Yayasan Sejahtera',
            'description' => 'Organisasi sosial',
            'verification_status' => 'approved',
        ]);

        $this->organization->members()->attach($this->organizer->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Penyelenggara',
            'joined_at' => now(),
        ]);

        $this->organization->members()->attach($this->coordinator->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        // Completed event 1 — with attendance data and approved report
        $this->completedEvent1 = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->coordinator->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'province' => 'Jawa Barat',
            'city' => 'Bandung',
            'location_name' => 'Pantai Indah',
            'quota' => 50,
            'event_date' => now()->subDays(10)->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'completed',
        ]);

        // Completed event 2 — with different attendance data, no report
        $this->completedEvent2 = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->coordinator->id,
            'category_id' => $this->category->id,
            'title' => 'Tanam Pohon',
            'description' => 'Penghijauan kota',
            'province' => 'Jawa Barat',
            'city' => 'Bandung',
            'location_name' => 'Taman Kota',
            'quota' => 30,
            'event_date' => now()->subDays(5)->format('Y-m-d'),
            'start_time' => '07:00',
            'end_time' => '11:00',
            'status' => 'completed',
        ]);

        // Draft event — should NOT appear in per-event analytics
        $this->draftEvent = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->coordinator->id,
            'category_id' => $this->category->id,
            'title' => 'Draft Event',
            'description' => 'Belum dipublikasikan',
            'quota' => 10,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'draft',
        ]);

        // Volunteers for event 1
        $vol1 = User::factory()->create(['full_name' => 'Vol 1', 'username' => 'vol1', 'email' => 'vol1@example.com']);
        $vol2 = User::factory()->create(['full_name' => 'Vol 2', 'username' => 'vol2', 'email' => 'vol2@example.com']);
        $vol3 = User::factory()->create(['full_name' => 'Vol 3', 'username' => 'vol3', 'email' => 'vol3@example.com']);

        foreach ([$vol1, $vol2, $vol3] as $v) {
            VolunteerRegistration::create([
                'id' => (string) Str::uuid(),
                'event_id' => $this->completedEvent1->id,
                'volunteer_id' => $v->id,
                'registered_at' => now(),
            ]);
        }

        // Volunteers for event 2
        $vol4 = User::factory()->create(['full_name' => 'Vol 4', 'username' => 'vol4', 'email' => 'vol4@example.com']);
        $vol5 = User::factory()->create(['full_name' => 'Vol 5', 'username' => 'vol5', 'email' => 'vol5@example.com']);

        foreach ([$vol4, $vol5] as $v) {
            VolunteerRegistration::create([
                'id' => (string) Str::uuid(),
                'event_id' => $this->completedEvent2->id,
                'volunteer_id' => $v->id,
                'registered_at' => now(),
            ]);
        }

        // Attendance for event 1: 2 present, 1 late
        Attendance::create(['id' => (string) Str::uuid(), 'event_id' => $this->completedEvent1->id, 'volunteer_id' => $vol1->id, 'status' => 'present', 'attendance_time' => now()]);
        Attendance::create(['id' => (string) Str::uuid(), 'event_id' => $this->completedEvent1->id, 'volunteer_id' => $vol2->id, 'status' => 'present', 'attendance_time' => now()]);
        Attendance::create(['id' => (string) Str::uuid(), 'event_id' => $this->completedEvent1->id, 'volunteer_id' => $vol3->id, 'status' => 'late', 'attendance_time' => now()]);

        // Attendance for event 2: 1 present, 1 absent
        Attendance::create(['id' => (string) Str::uuid(), 'event_id' => $this->completedEvent2->id, 'volunteer_id' => $vol4->id, 'status' => 'present', 'attendance_time' => now()]);
        Attendance::create(['id' => (string) Str::uuid(), 'event_id' => $this->completedEvent2->id, 'volunteer_id' => $vol5->id, 'status' => 'absent', 'attendance_time' => now()]);

        // Approved report for event 1
        EventReport::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->completedEvent1->id,
            'submitted_by' => $this->coordinator->id,
            'summary' => 'Laporan bersih pantai',
            'total_attendees' => 3,
            'report_status' => 'approved',
            'submitted_at' => now(),
            'approved_at' => now(),
        ]);

        $this->organizerToken = $this->organizer->createToken('auth-token')->plainTextToken;
        $this->coordinatorToken = $this->coordinator->createToken('auth-token')->plainTextToken;
        $this->volunteerToken = $this->volunteer->createToken('auth-token')->plainTextToken;
    }

    private function authHeaders(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    /** @test */
    public function organizer_can_view_per_event_analytics()
    {
        $response = $this->withHeaders($this->authHeaders($this->organizerToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/analytics/events");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Data per-event analytics berhasil diambil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'event_date',
                        'total_registrations',
                        'total_present',
                        'total_late',
                        'total_absent',
                        'attendance_rate',
                        'report_status',
                    ],
                ],
            ]);
    }

    /** @test */
    public function coordinator_can_view_per_event_analytics()
    {
        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/analytics/events");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    /** @test */
    public function volunteer_cannot_view_per_event_analytics()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/analytics/events");

        $response->assertStatus(403);
    }

    /** @test */
    public function only_completed_events_are_returned()
    {
        $response = $this->withHeaders($this->authHeaders($this->organizerToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/analytics/events");

        $response->assertStatus(200);
        $events = $response->json('data');

        $this->assertCount(2, $events);

        $titles = array_column($events, 'title');
        $this->assertContains('Bersih Pantai', $titles);
        $this->assertContains('Tanam Pohon', $titles);
        $this->assertNotContains('Draft Event', $titles);
    }

    /** @test */
    public function per_event_attendance_breakdown_is_accurate()
    {
        $response = $this->withHeaders($this->authHeaders($this->organizerToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/analytics/events");

        $response->assertStatus(200);
        $events = $response->json('data');

        $event1 = collect($events)->firstWhere('title', 'Bersih Pantai');
        $this->assertNotNull($event1);
        $this->assertEquals(3, $event1['total_registrations']);
        $this->assertEquals(2, $event1['total_present']);
        $this->assertEquals(1, $event1['total_late']);
        $this->assertEquals(0, $event1['total_absent']);
        $this->assertEquals(100.0, $event1['attendance_rate']);
        $this->assertEquals('approved', $event1['report_status']);

        $event2 = collect($events)->firstWhere('title', 'Tanam Pohon');
        $this->assertNotNull($event2);
        $this->assertEquals(2, $event2['total_registrations']);
        $this->assertEquals(1, $event2['total_present']);
        $this->assertEquals(0, $event2['total_late']);
        $this->assertEquals(1, $event2['total_absent']);
        $this->assertEquals(50.0, $event2['attendance_rate']);
        $this->assertNull($event2['report_status']);
    }

    /** @test */
    public function events_are_ordered_by_date_descending()
    {
        $response = $this->withHeaders($this->authHeaders($this->organizerToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/analytics/events");

        $response->assertStatus(200);
        $events = $response->json('data');

        $this->assertCount(2, $events);
        // Tanam Pohon (5 days ago) should come before Bersih Pantai (10 days ago)
        $this->assertEquals('Tanam Pohon', $events[0]['title']);
        $this->assertEquals('Bersih Pantai', $events[1]['title']);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_per_event_analytics()
    {
        $response = $this->getJson("/api/v1/organizations/{$this->organization->id}/analytics/events");

        $response->assertStatus(401);
    }
}
