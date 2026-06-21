<?php

namespace Tests\Feature\Organization;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class MembershipTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;
    private User $member;
    private Organization $organization;
    private string $ownerToken;
    private string $memberToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create([
            'full_name' => 'Pemilik Organisasi',
            'username' => 'pemilik',
            'email' => 'pemilik@example.com',
        ]);

        $this->member = User::factory()->create([
            'full_name' => 'Anggota Organisasi',
            'username' => 'anggota',
            'email' => 'anggota@example.com',
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

        $this->ownerToken = $this->owner->createToken('auth-token')->plainTextToken;
        $this->memberToken = $this->member->createToken('auth-token')->plainTextToken;
    }

    private function authHeaders(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    /** @test */
    public function authenticated_user_can_list_members()
    {
        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/members");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Daftar anggota berhasil diambil.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'organization_id',
                        'user_id',
                        'user' => ['id', 'full_name', 'username', 'profile_photo_url'],
                        'role',
                        'joined_at',
                    ],
                ],
            ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_list_members()
    {
        $response = $this->getJson("/api/v1/organizations/{$this->organization->id}/members");

        $response->assertStatus(401);
    }

    /** @test */
    public function owner_can_add_member()
    {
        $newMember = User::factory()->create();

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->postJson("/api/v1/organizations/{$this->organization->id}/members", [
                'user_id' => $newMember->id,
                'role' => 'Koordinator Event',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Anggota berhasil ditambahkan.',
            ])
            ->assertJsonPath('data.user.full_name', $newMember->full_name)
            ->assertJsonPath('data.role', 'Koordinator Event');

        $this->assertDatabaseHas('organization_memberships', [
            'organization_id' => $this->organization->id,
            'user_id' => $newMember->id,
            'role' => 'Koordinator Event',
        ]);
    }

    /** @test */
    public function cannot_add_duplicate_member()
    {
        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->postJson("/api/v1/organizations/{$this->organization->id}/members", [
                'user_id' => $this->owner->id,
                'role' => 'Penyelenggara',
            ]);

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'message' => 'Pengguna sudah menjadi anggota organisasi ini.',
            ]);
    }

    /** @test */
    public function cannot_add_member_with_invalid_role()
    {
        $newMember = User::factory()->create();

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->postJson("/api/v1/organizations/{$this->organization->id}/members", [
                'user_id' => $newMember->id,
                'role' => 'Invalid Role',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    /** @test */
    public function cannot_add_nonexistent_user_as_member()
    {
        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->postJson("/api/v1/organizations/{$this->organization->id}/members", [
                'user_id' => '00000000-0000-0000-0000-000000000000',
                'role' => 'Koordinator Event',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['user_id']);
    }

    /** @test */
    public function owner_can_update_member_role()
    {
        $this->organization->members()->attach($this->member->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->patchJson("/api/v1/organizations/{$this->organization->id}/members/{$this->member->id}", [
                'role' => 'Penyelenggara',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Peran anggota berhasil diperbarui.',
            ])
            ->assertJsonPath('data.role', 'Penyelenggara');

        $this->assertDatabaseHas('organization_memberships', [
            'organization_id' => $this->organization->id,
            'user_id' => $this->member->id,
            'role' => 'Penyelenggara',
        ]);
    }

    /** @test */
    public function cannot_update_role_with_invalid_value()
    {
        $this->organization->members()->attach($this->member->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->patchJson("/api/v1/organizations/{$this->organization->id}/members/{$this->member->id}", [
                'role' => 'Invalid',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    /** @test */
    public function owner_can_remove_member()
    {
        $this->organization->members()->attach($this->member->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Koordinator Event',
            'joined_at' => now(),
        ]);

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->deleteJson("/api/v1/organizations/{$this->organization->id}/members/{$this->member->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Anggota berhasil dihapus.',
            ]);

        $this->assertDatabaseMissing('organization_memberships', [
            'organization_id' => $this->organization->id,
            'user_id' => $this->member->id,
        ]);
    }

    /** @test */
    public function cannot_remove_non_member()
    {
        $nonMember = User::factory()->create();

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->deleteJson("/api/v1/organizations/{$this->organization->id}/members/{$nonMember->id}");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Pengguna bukan anggota organisasi ini.',
            ]);
    }

    /** @test */
    public function owner_can_see_own_role_in_list()
    {
        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/members");

        $response->assertStatus(200);

        $ownerInList = collect($response->json('data'))
            ->firstWhere('user_id', $this->owner->id);

        $this->assertNotNull($ownerInList);
        $this->assertEquals('Penyelenggara', $ownerInList['role']);
    }

    /** @test */
    public function member_list_shows_all_added_users()
    {
        $users = User::factory()->count(3)->create();

        foreach ($users as $user) {
            $this->organization->members()->attach($user->id, [
                'id' => (string) Str::uuid(),
                'role' => 'Koordinator Event',
                'joined_at' => now(),
            ]);
        }

        $response = $this->withHeaders($this->authHeaders($this->ownerToken))
            ->getJson("/api/v1/organizations/{$this->organization->id}/members");

        $response->assertStatus(200);

        // 1 owner + 3 new members = 4 total
        $this->assertCount(4, $response->json('data'));
    }
}
