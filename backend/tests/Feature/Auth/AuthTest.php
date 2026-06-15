<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private array $validRegistrationData;

    protected function setUp(): void
    {
        parent::setUp();

        $this->validRegistrationData = [
            'full_name' => 'Budi Santoso',
            'username' => 'budisantoso',
            'email' => 'budi@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];
    }

    /** @test */
    public function user_can_register_with_valid_data()
    {
        $response = $this->postJson('/api/v1/auth/register', $this->validRegistrationData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'full_name', 'username', 'email'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'budi@example.com',
            'username' => 'budisantoso',
        ]);
    }

    /** @test */
    public function user_cannot_register_with_duplicate_email()
    {
        $this->postJson('/api/v1/auth/register', $this->validRegistrationData);

        $response = $this->postJson('/api/v1/auth/register', $this->validRegistrationData);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function user_cannot_register_with_duplicate_username()
    {
        $this->postJson('/api/v1/auth/register', $this->validRegistrationData);

        $response = $this->postJson('/api/v1/auth/register', [
            'full_name' => 'Another User',
            'username' => 'budisantoso',
            'email' => 'another@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username']);
    }

    /** @test */
    public function user_cannot_register_without_password_confirmation()
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'full_name' => 'Budi Santoso',
            'username' => 'budisantoso',
            'email' => 'budi@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function user_can_login_with_valid_credentials()
    {
        User::factory()->create([
            'username' => 'budisantoso',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'username' => 'budisantoso',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'full_name', 'username', 'email'],
                    'token',
                ],
            ]);
    }

    /** @test */
    public function user_cannot_login_with_invalid_password()
    {
        User::factory()->create([
            'username' => 'budisantoso',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'username' => 'budisantoso',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Kredensial yang diberikan tidak valid.',
            ]);
    }

    /** @test */
    public function user_cannot_login_with_nonexistent_username()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'username' => 'nonexistent',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Kredensial yang diberikan tidak valid.',
            ]);
    }

    /** @test */
    public function authenticated_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logout berhasil.',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    /** @test */
    public function unauthenticated_user_cannot_logout()
    {
        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(401);
    }

    /** @test */
    public function user_can_request_password_reset_token()
    {
        User::factory()->create([
            'email' => 'budi@example.com',
        ]);

        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'budi@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['reset_token'],
            ]);
    }

    /** @test */
    public function forgot_password_returns_success_for_unregistered_email()
    {
        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /** @test */
    public function user_can_reset_password_with_valid_token()
    {
        $user = User::factory()->create([
            'email' => 'budi@example.com',
        ]);

        $tokenResponse = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'budi@example.com',
        ]);

        $resetToken = $tokenResponse['data']['reset_token'];

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'email' => 'budi@example.com',
            'token' => $resetToken,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Password berhasil direset.',
            ]);

        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    /** @test */
    public function user_cannot_reset_password_with_invalid_token()
    {
        User::factory()->create([
            'email' => 'budi@example.com',
        ]);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'email' => 'budi@example.com',
            'token' => 'invalid-token',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }
}
