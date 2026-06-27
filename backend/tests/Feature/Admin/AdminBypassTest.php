<?php

namespace Tests\Feature\Admin;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class AdminBypassTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Organization $organization;
    private EventCategory $category;
    private string $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = EventCategory::create(['name' => 'Lingkungan']);

        $this->admin = User::factory()->create([
            'full_name' => 'Admin Sistem',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        $owner = User::factory()->create([
            'full_name' => 'Pemilik',
            'username' => 'pemilik',
            'email' => 'pemilik@example.com',
        ]);

        $this->organization = Organization::create([
            'name' => 'Yayasan Sejahtera',
            'description' => 'Organisasi sosial',
            'verification_status' => 'approved',
        ]);

        $this->organization->members()->attach($owner->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Penyelenggara',
            'joined_at' => now(),
        ]);

        $this->adminToken = $this->admin->createToken('auth-token')->plainTextToken;
    }

    private function authHeaders(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    /** @test */
    public function admin_can_update_event_not_owning_organization()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => User::factory()->create()->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->adminToken))
            ->patchJson("/api/v1/events/{$event->id}", [
                'title' => 'Diubah Admin',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Diubah Admin');
    }

    /** @test */
    public function admin_can_delete_event_not_owning_organization()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => User::factory()->create()->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->adminToken))
            ->deleteJson("/api/v1/events/{$event->id}");

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_publish_event_not_owning_organization()
    {
        $event = Event::create([
            'organization_id' => $this->organization->id,
            'coordinator_id' => User::factory()->create()->id,
            'category_id' => $this->category->id,
            'title' => 'Bersih Pantai',
            'description' => 'Kegiatan bersih-bersih pantai',
            'quota' => 50,
            'event_date' => now()->addMonth()->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '12:00',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders($this->authHeaders($this->adminToken))
            ->patchJson("/api/v1/events/{$event->id}/publish");

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'published');
    }
}
