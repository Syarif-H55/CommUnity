<?php

namespace Tests\Feature\Profile;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->user = User::factory()->create([
            'full_name' => 'Budi Santoso',
            'username' => 'budisantoso',
            'email' => 'budi@example.com',
        ]);

        $this->token = $this->user->createToken('auth-token')->plainTextToken;
    }

    private function authHeaders(): array
    {
        return ['Authorization' => "Bearer {$this->token}"];
    }

    /** @test */
    public function authenticated_user_can_view_profile()
    {
        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/v1/profile');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Profil berhasil dimuat.',
                'data' => [
                    'full_name' => 'Budi Santoso',
                    'username' => 'budisantoso',
                    'email' => 'budi@example.com',
                ],
            ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_view_profile()
    {
        $response = $this->getJson('/api/v1/profile');

        $response->assertStatus(401);
    }

    /** @test */
    public function user_can_update_profile()
    {
        $response = $this->withHeaders($this->authHeaders())
            ->patchJson('/api/v1/profile', [
                'full_name' => 'Budi Santoso Updated',
                'username' => 'budisantoso',
                'email' => 'budi@example.com',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Profil berhasil diperbarui.',
                'data' => [
                    'full_name' => 'Budi Santoso Updated',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'full_name' => 'Budi Santoso Updated',
        ]);
    }

    /** @test */
    public function user_cannot_update_to_duplicate_username()
    {
        User::factory()->create([
            'username' => 'existinguser',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->patchJson('/api/v1/profile', [
                'full_name' => 'Budi Santoso',
                'username' => 'existinguser',
                'email' => 'budi@example.com',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username']);
    }

    /** @test */
    public function user_cannot_update_to_duplicate_email()
    {
        User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->patchJson('/api/v1/profile', [
                'full_name' => 'Budi Santoso',
                'username' => 'budisantoso',
                'email' => 'existing@example.com',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function user_can_upload_profile_photo()
    {
        $photo = UploadedFile::fake()->image('profile.jpg', 200, 200);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/v1/profile/photo', [
                'photo' => $photo,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Foto profil berhasil diunggah.',
            ]);

        $this->assertNotNull($this->user->fresh()->profile_photo_path);
        Storage::disk('public')->assertExists($this->user->fresh()->profile_photo_path);
    }

    /** @test */
    public function user_cannot_upload_non_image_file()
    {
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/v1/profile/photo', [
                'photo' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['photo']);
    }

    /** @test */
    public function user_cannot_upload_photo_exceeding_max_size()
    {
        $photo = UploadedFile::fake()->image('large.jpg')->size(3000);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/v1/profile/photo', [
                'photo' => $photo,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['photo']);
    }

    /** @test */
    public function upload_replaces_old_profile_photo()
    {
        $oldPhoto = UploadedFile::fake()->image('old.jpg', 200, 200);
        $oldPath = $oldPhoto->store('profile-photos', 'public');

        $this->user->update(['profile_photo_path' => $oldPath]);

        $newPhoto = UploadedFile::fake()->image('new.jpg', 200, 200);

        $this->withHeaders($this->authHeaders())
            ->postJson('/api/v1/profile/photo', [
                'photo' => $newPhoto,
            ]);

        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($this->user->fresh()->profile_photo_path);
    }
}
