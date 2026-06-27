<?php

namespace Tests\Feature\Organization;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class OrganizationAuthTest extends TestCase
{
    use RefreshDatabase;

    private User $volunteer;
    private User $organizer;
    private User $admin;
    private Organization $organization;
    private Organization $otherOrg;
    private string $volunteerToken;
    private string $organizerToken;
    private string $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->volunteer = User::factory()->create([
            'full_name' => 'Relawan',
            'username' => 'relawan',
            'email' => 'relawan@example.com',
        ]);

        $this->organizer = User::factory()->create([
            'full_name' => 'Penyelenggara',
            'username' => 'penyelenggara',
            'email' => 'penyelenggara@example.com',
        ]);

        $this->admin = User::factory()->create([
            'full_name' => 'Admin Sistem',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'is_admin' => true,
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

        $this->otherOrg = Organization::create([
            'name' => 'Organisasi Lain',
            'description' => 'Organisasi lain',
            'verification_status' => 'approved',
        ]);

        $this->volunteerToken = $this->volunteer->createToken('auth-token')->plainTextToken;
        $this->organizerToken = $this->organizer->createToken('auth-token')->plainTextToken;
        $this->adminToken = $this->admin->createToken('auth-token')->plainTextToken;
    }

    private function authHeaders(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    /** @test */
    public function volunteer_cannot_update_organization()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->patchJson("/api/v1/organizations/{$this->organization->id}", [
                'name' => 'Nama Baru',
            ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function volunteer_cannot_delete_organization()
    {
        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->deleteJson("/api/v1/organizations/{$this->organization->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function volunteer_cannot_add_member()
    {
        $newUser = User::factory()->create();

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->postJson("/api/v1/organizations/{$this->organization->id}/members", [
                'user_id' => $newUser->id,
                'role' => 'Koordinator Event',
            ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function volunteer_cannot_update_member_role()
    {
        $member = User::factory()->create();
        $this->organization->members()->attach($member->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->patchJson("/api/v1/organizations/{$this->organization->id}/members/{$member->id}", [
                'role' => 'Penyelenggara',
            ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function volunteer_cannot_remove_member()
    {
        $member = User::factory()->create();
        $this->organization->members()->attach($member->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->volunteerToken))
            ->deleteJson("/api/v1/organizations/{$this->organization->id}/members/{$member->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_update_any_organization()
    {
        $response = $this->withHeaders($this->authHeaders($this->adminToken))
            ->patchJson("/api/v1/organizations/{$this->otherOrg->id}", [
                'name' => 'Diubah Admin',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Diubah Admin');
    }

    /** @test */
    public function admin_can_delete_any_organization()
    {
        $response = $this->withHeaders($this->authHeaders($this->adminToken))
            ->deleteJson("/api/v1/organizations/{$this->otherOrg->id}");

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_add_member_to_any_organization()
    {
        $newUser = User::factory()->create();

        $response = $this->withHeaders($this->authHeaders($this->adminToken))
            ->postJson("/api/v1/organizations/{$this->otherOrg->id}/members", [
                'user_id' => $newUser->id,
                'role' => 'Koordinator Event',
            ]);

        $response->assertStatus(201);
    }

    /** @test */
    public function admin_can_update_member_role_in_any_organization()
    {
        $member = User::factory()->create();
        $this->otherOrg->members()->attach($member->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->adminToken))
            ->patchJson("/api/v1/organizations/{$this->otherOrg->id}/members/{$member->id}", [
                'role' => 'Penyelenggara',
            ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_remove_member_from_any_organization()
    {
        $member = User::factory()->create();
        $this->otherOrg->members()->attach($member->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->adminToken))
            ->deleteJson("/api/v1/organizations/{$this->otherOrg->id}/members/{$member->id}");

        $response->assertStatus(200);
    }
}
