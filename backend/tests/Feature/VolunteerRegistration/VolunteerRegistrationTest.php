<?php

namespace Tests\Feature\VolunteerRegistration;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organization;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class VolunteerRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private User $volunteer;
    private User $owner;
    private Organization $organization;
    private EventCategory $category;
    private Event $publishedEvent;
    private Event $draftEvent;
    private string $volunteerToken;
    private string $ownerToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = EventCategory::create(['name' => 'Lingkungan']);

        $this->volunteer = User::factory()->create([
            'full_name' => 'Relawan Aktif',
            'username' => 'relawan',
            'email' => 'relawan@example.com',
        ]);

        $this->owner = User::factory()->create([
            'full_name' => 'Pemilik Organisasi',
            'username' => 'pemilik',
            'email' => 'pemilik@example.com',
        ]);

        $this->organization = Organization::create([
            'name' => 'Yayasan Sejahtera',
            'description' => 'Organisasi sosial',
            'verification_status' => 'approved',
        ]);

        $this->organization->members()->attach($this->owner->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Penyelenggara',
            'joined_at' => now(),
        ]);

        $this->publishedEvent = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'province' => 'Jawa Barat',
            'city' => 'Bandung',
            'location_name' => 'Pantai Indah',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        $this->draftEvent = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Event Draft',
            'quota' => 10,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'draft',
        ]);

        $this->volunteerToken = $this->volunteer->createToken('auth-token')->plainTextToken;
        $this->ownerToken = $this->owner->createToken('auth-token')->plainTextToken;
    }

    private function authHeaders(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    /** @test */
    public function volunteer_can_register_for_published_event()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson("/api/v1/events/{$this->publishedEvent->id}/register");

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Pendaftaran event berhasil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'event_id',
                    'volunteer_id',
                    'event',
                    'registered_at',
                ],
            ]);

        $this->assertDatabaseHas('volunteer_registrations', [
            'event_id' => $this->publishedEvent->id,
            'volunteer_id' => $this->volunteer->id,
        ]);
    }

    /** @test */
    public function volunteer_cannot_register_twice_for_same_event()
    {
        VolunteerRegistration::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->publishedEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'registered_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson("/api/v1/events/{$this->publishedEvent->id}/register");

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'message' => 'Anda sudah mendaftar pada event ini.',
            ]);
    }

    /** @test */
    public function volunteer_cannot_register_for_draft_event()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson("/api/v1/events/{$this->draftEvent->id}/register");

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'message' => 'Hanya event yang sudah dipublikasikan yang dapat diikuti.',
            ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_register()
    {
        $response = $this->postJson("/api/v1/events/{$this->publishedEvent->id}/register");

        $response->assertStatus(401);
    }

    /** @test */
    public function cannot_register_for_nonexistent_event()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson('/api/v1/events/00000000-0000-0000-0000-000000000000/register');

        $response->assertStatus(404);
    }

    /** @test */
    public function cannot_register_when_quota_is_full()
    {
        $fullEvent = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Event Kuota Penuh',
            'quota' => 0,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson("/api/v1/events/{$fullEvent->id}/register");

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'message' => 'Kuota peserta event sudah penuh.',
            ]);
    }

    /** @test */
    public function volunteer_can_view_registration_history()
    {
        VolunteerRegistration::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->publishedEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'registered_at' => now(),
        ]);

        $otherEvent = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Tanam Pohon',
            'quota' => 30,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        VolunteerRegistration::create([
            'id' => (string) Str::uuid(),
            'event_id' => $otherEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'registered_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->getJson('/api/v1/my-registrations');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Riwayat partisipasi berhasil diambil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'event_id', 'volunteer_id', 'event', 'registered_at'],
                ],
                'pagination' => [
                    'current_page',
                    'per_page',
                    'total',
                    'last_page',
                ],
            ]);

        $this->assertCount(2, $response->json('data'));
        $this->assertEquals(2, $response->json('pagination')['total']);
    }

    /** @test */
    public function volunteer_registration_history_is_scoped_to_own_user()
    {
        $otherUser = User::factory()->create([
            'full_name' => 'Relawan Lain',
            'username' => 'relawanlain',
            'email' => 'relawanlain@example.com',
        ]);

        VolunteerRegistration::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->publishedEvent->id,
            'volunteer_id' => $otherUser->id,
            'registered_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->getJson('/api/v1/my-registrations');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }

    /** @test */
    public function can_filter_registration_history_by_event_status()
    {
        $completedEvent = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Event Selesai',
            'quota' => 10,
            'event_date' => now()->subMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'completed',
        ]);

        VolunteerRegistration::create([
            'id' => (string) Str::uuid(),
            'event_id' => $this->publishedEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'registered_at' => now(),
        ]);

        VolunteerRegistration::create([
            'id' => (string) Str::uuid(),
            'event_id' => $completedEvent->id,
            'volunteer_id' => $this->volunteer->id,
            'registered_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->getJson('/api/v1/my-registrations?status=completed');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('completed', $response->json('data')[0]['event']['status']);
    }
}
