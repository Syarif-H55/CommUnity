<?php

namespace Tests\Feature\Attendance;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organization;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    private User $volunteer;
    private User $coordinator;
    private User $organizer;
    private Organization $organization;
    private EventCategory $category;
    private Event $ongoingEvent;
    private Event $publishedEvent;
    private string $volunteerToken;
    private string $coordinatorToken;
    private string $organizerToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = EventCategory::create(['name' => 'Lingkungan']);

        $this->volunteer = User::factory()->create([
            'full_name' => 'Relawan Aktif',
            'username' => 'relawan',
            'email' => 'relawan@example.com',
        ]);

        $this->coordinator = User::factory()->create([
            'full_name' => 'Koordinator Event',
            'username' => 'koordinator',
            'email' => 'koordinator@example.com',
        ]);

        $this->organizer = User::factory()->create([
            'full_name' => 'Penyelenggara',
            'username' => 'penyelenggara',
            'email' => 'penyelenggara@example.com',
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

        $this->ongoingEvent = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->coordinator->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'province' => 'Jawa Barat',
            'city' => 'Bandung',
            'location_name' => 'Pantai Indah',
            'quota' => 50,
            'event_date' => now()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'ongoing',
        ]);

        $this->publishedEvent = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->coordinator->id,
            'category_id' => $this->category->id,
            'title' => 'Event Mendatang',
            'quota' => 10,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        VolunteerRegistration::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'registered_at' => now(),
        ]);

        $this->volunteerToken = $this->volunteer->createToken('auth-token')->plainTextToken;
        $this->coordinatorToken = $this->coordinator->createToken('auth-token')->plainTextToken;
        $this->organizerToken = $this->organizer->createToken('auth-token')->plainTextToken;
    }

    private function authHeaders(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    /** @test */
    public function coordinator_can_generate_qr()
    {
        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->getJson("/api/v1/events/{$this->ongoingEvent->id}/attendance-qr");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'QR attendance berhasil dibuat.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'event_id',
                    'event_title',
                    'qr_content',
                ],
            ]);
    }

    /** @test */
    public function organizer_can_generate_qr()
    {
        $response = $this->withHeaders($this->authHeaders($this->organizerToken))
            ->getJson("/api/v1/events/{$this->ongoingEvent->id}/attendance-qr");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    /** @test */
    public function volunteer_cannot_generate_qr()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->getJson("/api/v1/events/{$this->ongoingEvent->id}/attendance-qr");

        $response->assertStatus(403);
    }

    /** @test */
    public function volunteer_can_scan_qr_and_record_attendance()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson("/api/v1/events/{$this->ongoingEvent->id}/attendance/scan");

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Attendance berhasil dicatat.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'event_id',
                    'volunteer_id',
                    'status',
                    'attendance_time',
                ],
            ]);

        $this->assertDatabaseHas('attendances', [
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'status' => 'present',
        ]);
    }

    /** @test */
    public function volunteer_cannot_scan_qr_if_not_registered()
    {
        $unregisteredUser = User::factory()->create([
            'full_name' => 'Tidak Terdaftar',
            'username' => 'tidakdaftar',
            'email' => 'tidakdaftar@example.com',
        ]);
        $token = $unregisteredUser->createToken('auth-token')->plainTextToken;

        $response = $this->withHeaders($this->authHeaders($token))
            ->postJson("/api/v1/events/{$this->ongoingEvent->id}/attendance/scan");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Anda tidak terdaftar pada event ini.',
            ]);
    }

    /** @test */
    public function duplicate_attendance_is_prevented()
    {
        Attendance::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'status' => 'present',
            'attendance_time' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson("/api/v1/events/{$this->ongoingEvent->id}/attendance/scan");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Anda sudah melakukan attendance pada event ini.',
            ]);
    }

    /** @test */
    public function coordinator_can_mark_attendance_manually()
    {
        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->postJson("/api/v1/events/{$this->ongoingEvent->id}/attendances", [
                'volunteer_id' => $this->volunteer->id,
                'status' => 'present',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Attendance berhasil dicatat.',
            ]);

        $this->assertDatabaseHas('attendances', [
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'status' => 'present',
            'validated_by' => $this->coordinator->id,
        ]);
    }

    /** @test */
    public function coordinator_can_mark_late_and_absent()
    {
        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->postJson("/api/v1/events/{$this->ongoingEvent->id}/attendances", [
                'volunteer_id' => $this->volunteer->id,
                'status' => 'late',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('attendances', [
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'status' => 'late',
        ]);
    }

    /** @test */
    public function manual_attendance_validates_required_fields()
    {
        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->postJson("/api/v1/events/{$this->ongoingEvent->id}/attendances", []);

        $response->assertStatus(422);
    }

    /** @test */
    public function coordinator_can_update_attendance_status()
    {
        $attendance = Attendance::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'status' => 'present',
            'attendance_time' => now(),
            'validated_by' => $this->coordinator->id,
        ]);

        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->patchJson(
                "/api/v1/events/{$this->ongoingEvent->id}/attendances/{$attendance->id}",
                ['status' => 'absent']
            );

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Status attendance berhasil diperbarui.',
            ]);

        $this->assertDatabaseHas('attendances', [
            'id' => $attendance->id,
            'status' => 'absent',
        ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_attendance()
    {
        $response = $this->postJson("/api/v1/events/{$this->ongoingEvent->id}/attendance/scan");
        $response->assertStatus(401);

        $response = $this->getJson("/api/v1/events/{$this->ongoingEvent->id}/attendances");
        $response->assertStatus(401);
    }

    /** @test */
    public function coordinator_can_view_event_attendances()
    {
        Attendance::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'status' => 'present',
            'attendance_time' => now(),
            'validated_by' => $this->coordinator->id,
        ]);

        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->getJson("/api/v1/events/{$this->ongoingEvent->id}/attendances");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Daftar attendance berhasil diambil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'event_id', 'volunteer_id', 'volunteer_name', 'status', 'attendance_time'],
                ],
                'pagination' => [
                    'current_page',
                    'per_page',
                    'total',
                    'last_page',
                ],
            ]);

        $this->assertEquals(1, $response->json('pagination')['total']);
    }

    /** @test */
    public function volunteer_can_view_own_attendance_history()
    {
        Attendance::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'status' => 'present',
            'attendance_time' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->getJson('/api/v1/my-attendances');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Riwayat attendance berhasil diambil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'event_id', 'volunteer_id', 'status', 'attendance_time'],
                ],
                'pagination',
            ]);

        $this->assertEquals(1, $response->json('pagination')['total']);
    }

    /** @test */
    public function coordinator_can_view_attendance_summary()
    {
        Attendance::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'status' => 'present',
            'attendance_time' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->getJson("/api/v1/events/{$this->ongoingEvent->id}/attendance-summary");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Ringkasan attendance berhasil diambil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'total_registered',
                    'present',
                    'late',
                    'absent',
                    'attendance_rate',
                ],
            ]);

        $this->assertEquals(1, $response->json('data')['total_registered']);
        $this->assertEquals(1, $response->json('data')['present']);
        $this->assertEquals(100.0, $response->json('data')['attendance_rate']);
    }

    /** @test */
    public function volunteer_attendance_history_is_scoped_to_own_user()
    {
        $otherUser = User::factory()->create([
            'full_name' => 'Relawan Lain',
            'username' => 'relawanlain',
            'email' => 'relawanlain@example.com',
        ]);

        Attendance::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->ongoingEvent->id,
            'volunteer_id' => $otherUser->id,
            'status' => 'present',
            'attendance_time' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->getJson('/api/v1/my-attendances');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }

    /** @test */
    public function volunteer_cannot_scan_qr_for_non_ongoing_event()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson("/api/v1/events/{$this->publishedEvent->id}/attendance/scan");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Attendance hanya dapat dilakukan pada event yang sedang berlangsung.',
            ]);
    }
}
