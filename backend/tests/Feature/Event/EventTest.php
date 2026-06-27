<?php

namespace Tests\Feature\Event;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;
    private User $coordinator;
    private User $volunteer;
    private Organization $organization;
    private EventCategory $category;
    private string $ownerToken;
    private string $coordinatorToken;
    private string $volunteerToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = EventCategory::create(['name' => 'Lingkungan']);

        $this->owner = User::factory()->create([
            'full_name' => 'Pemilik Organisasi',
            'username' => 'pemilik',
            'email' => 'pemilik@example.com',
        ]);

        $this->coordinator = User::factory()->create([
            'full_name' => 'Koordinator Event',
            'username' => 'koordinator',
            'email' => 'koordinator@example.com',
        ]);

        $this->volunteer = User::factory()->create([
            'full_name' => 'Relawan Biasa',
            'username' => 'relawan',
            'email' => 'relawan@example.com',
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

        $this->organization->members()->attach($this->coordinator->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        $this->ownerToken = $this->owner->createToken('auth-token')->plainTextToken;
        $this->coordinatorToken = $this->coordinator->createToken('auth-token')->plainTextToken;
        $this->volunteerToken = $this->volunteer->createToken('auth-token')->plainTextToken;
    }

    private function authHeaders(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    private function validEventData(): array
    {
        return [
            'organization_id' => $this->organization->id,
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
        ];
    }

    /** @test */
    public function penyelenggara_can_create_event()
    {
        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->postJson('/api/v1/events', $this->validEventData());

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Event berhasil dibuat.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'organization_id',
                    'coordinator_id',
                    'category_id',
                    'title',
                    'description',
                    'province',
                    'city',
                    'location_name',
                    'quota',
                    'event_date',
                    'start_time',
                    'end_time',
                    'status',
                ],
            ]);

        $this->assertDatabaseHas('events', [
            'title' => 'Bersih Pantai',
            'status' => 'draft',
        ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_create_event()
    {
        $response = $this->postJson('/api/v1/events', $this->validEventData());

        $response->assertStatus(401);
    }

    /** @test */
    public function user_without_organization_cannot_create_event()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withHeaders($this->authHeaders($token))
            ->postJson('/api/v1/events', $this->validEventData());

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Hanya penyelenggara organisasi yang dapat melakukan tindakan ini.',
            ]);
    }

    /** @test */
    public function cannot_create_event_with_unverified_organization()
    {
        $unverifiedOwner = User::factory()->create([
            'full_name' => 'Pemilik Belum Verifikasi',
            'username' => 'pemilikunverified',
            'email' => 'pemilikunverified@example.com',
        ]);

        $unverifiedOrg = Organization::create([
            'name' => 'Organisasi Belum Verifikasi',
            'description' => 'Belum verifikasi',
            'verification_status' => 'pending',
        ]);

        $unverifiedOrg->members()->attach($unverifiedOwner->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Penyelenggara',
            'joined_at' => now(),
        ]);

        $token = $unverifiedOwner->createToken('auth-token')->plainTextToken;

        $response = $this->withHeaders($this->authHeaders($token))
            ->postJson('/api/v1/events', array_merge($this->validEventData(), [
                'organization_id' => $unverifiedOrg->id,
            ]));

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Organisasi belum terverifikasi.',
            ]);
    }

    /** @test */
    public function cannot_create_event_with_invalid_category()
    {
        $data = $this->validEventData();
        $data['category_id'] = 999;

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->postJson('/api/v1/events', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category_id']);
    }

    /** @test */
    public function cannot_create_event_with_past_date()
    {
        $data = $this->validEventData();
        $data['event_date'] = now()->subDay()->format('Y-m-d');

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->postJson('/api/v1/events', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['event_date']);
    }

    /** @test */
    public function cannot_create_event_with_end_before_start()
    {
        $data = $this->validEventData();
        $data['start_time'] = '14:00';
        $data['end_time'] = '08:00';

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->postJson('/api/v1/events', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_time']);
    }

    /** @test */
    public function user_can_view_event_detail()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson("/api/v1/events/{$event->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Detail event berhasil diambil.',
            ])
            ->assertJsonPath('data.title', 'Bersih Pantai')
            ->assertJsonPath('data.status', 'published');
    }

    /** @test */
    public function viewing_nonexistent_event_returns_404()
    {
        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson('/api/v1/events/00000000-0000-0000-0000-000000000000');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Event tidak ditemukan.',
            ]);
    }

    /** @test */
    public function owner_can_update_event()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->patchJson("/api/v1/events/{$event->id}", [
                'title' => 'Bersih Pantai Update',
                'quota' => 100,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Event berhasil diperbarui.',
            ])
            ->assertJsonPath('data.title', 'Bersih Pantai Update')
            ->assertJsonPath('data.quota', 100);
    }

    /** @test */
    public function cannot_update_completed_event()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'completed',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->patchJson("/api/v1/events/{$event->id}", [
                'title' => 'Updated Title',
            ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Event yang sudah selesai tidak dapat diubah.',
            ]);
    }

    /** @test */
    public function owner_can_publish_event()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->patchJson("/api/v1/events/{$event->id}/publish");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Event berhasil dipublikasikan.',
            ])
            ->assertJsonPath('data.status', 'published');
    }

    /** @test */
    public function cannot_publish_non_draft_event()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->patchJson("/api/v1/events/{$event->id}/publish");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Hanya event dengan status draft yang dapat dipublikasikan.',
            ]);
    }

    /** @test */
    public function owner_can_delete_draft_event()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->deleteJson("/api/v1/events/{$event->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Event berhasil dihapus.',
            ]);

        $this->assertSoftDeleted('events', ['id' => $event->id]);
    }

    /** @test */
    public function cannot_delete_completed_event()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'completed',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->deleteJson("/api/v1/events/{$event->id}");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Event yang sudah selesai tidak dapat dihapus.',
            ]);
    }

    /** @test */
    public function user_can_list_events_with_pagination()
    {
        Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Event 1',
            'quota' => 10,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Event 2',
            'quota' => 20,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson('/api/v1/events?per_page=1');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'pagination' => [
                    'current_page',
                    'per_page',
                    'total',
                    'last_page',
                ],
            ]);

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals(2, $response->json('pagination')['total']);
    }

    /** @test */
    public function user_can_filter_events_by_category()
    {
        $category2 = EventCategory::create(['name' => 'Pendidikan']);

        Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Event Lingkungan',
            'quota' => 10,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $category2->id,
            'title' => 'Event Pendidikan',
            'quota' => 20,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson('/api/v1/events?category_id=' . $this->category->id);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('Event Lingkungan', $response->json('data')[0]['title']);
    }

    /** @test */
    public function user_can_search_events()
    {
        Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'quota' => 10,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Tanam Pohon',
            'quota' => 20,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'published',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson('/api/v1/events?search=Pantai');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('Bersih Pantai', $response->json('data')[0]['title']);
    }

    /** @test */
    public function user_can_list_event_categories()
    {
        EventCategory::create(['name' => 'Pendidikan']);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson('/api/v1/event-categories');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Daftar kategori event berhasil diambil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'name'],
                ],
            ]);
    }

    /** @test */
    public function coordinator_cannot_create_event()
    {
        $response = $this->withHeaders($this->authHeaders($this->coordinatorToken))
            ->postJson('/api/v1/events', $this->validEventData());

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Hanya penyelenggara organisasi yang dapat melakukan tindakan ini.',
            ]);
    }

    private function createEvent(string $status = 'draft'): Event
    {
        return Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => $this->owner->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => $status,
        ]);
    }

    /** @test */
    public function non_owner_cannot_update_event()
    {
        $event = $this->createEvent();

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->patchJson("/api/v1/events/{$event->id}", [
                'title' => 'Diubah Relawan',
            ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function non_owner_cannot_delete_event()
    {
        $event = $this->createEvent();

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->deleteJson("/api/v1/events/{$event->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function non_owner_cannot_publish_event()
    {
        $event = $this->createEvent();

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->patchJson("/api/v1/events/{$event->id}/publish");

        $response->assertStatus(403);
    }
}
