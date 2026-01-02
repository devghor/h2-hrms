<?php

namespace Tests\Feature\Api\V1\Base;

use App\Models\Base\Designation;
use App\Models\Uam\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class DesignationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        // Create permissions
        $permissions = [
            'READ_BASE_DESIGNATION',
            'CREATE_BASE_DESIGNATION',
            'UPDATE_BASE_DESIGNATION',
            'DELETE_BASE_DESIGNATION',
            'RESTORE_BASE_DESIGNATION',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }

        // Give all permissions to user
        $this->user->givePermissionTo($permissions);

        Sanctum::actingAs($this->user);
    }

    public function test_can_list_designations(): void
    {
        Designation::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/base/designations');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'ulid', 'name', 'description', 'level', 'created_at', 'updated_at']
                ]
            ]);
    }

    public function test_can_create_designation(): void
    {
        $designationData = [
            'name' => 'Senior Developer',
            'description' => 'Senior level software developer',
            'level' => 4,
        ];

        $response = $this->postJson('/api/v1/base/designations', $designationData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Designation created successfully.',
            ]);

        $this->assertDatabaseHas('designations', [
            'name' => 'Senior Developer',
            'level' => 4,
        ]);
    }

    public function test_can_show_designation(): void
    {
        $designation = Designation::factory()->create();

        $response = $this->getJson("/api/v1/base/designations/{$designation->ulid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'ulid' => $designation->ulid,
                    'name' => $designation->name,
                ],
            ]);
    }

    public function test_can_update_designation(): void
    {
        $designation = Designation::factory()->create();

        $updateData = [
            'name' => 'Updated Designation',
            'description' => 'Updated description',
            'level' => 5,
        ];

        $response = $this->putJson("/api/v1/base/designations/{$designation->ulid}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Designation updated successfully.',
            ]);

        $this->assertDatabaseHas('designations', [
            'ulid' => $designation->ulid,
            'name' => 'Updated Designation',
            'level' => 5,
        ]);
    }

    public function test_can_delete_designation(): void
    {
        $designation = Designation::factory()->create();

        $response = $this->deleteJson("/api/v1/base/designations/{$designation->ulid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Designation deleted successfully.',
            ]);

        $this->assertSoftDeleted('designations', [
            'ulid' => $designation->ulid,
        ]);
    }

    public function test_can_restore_deleted_designation(): void
    {
        $designation = Designation::factory()->create();
        $designation->delete();

        $response = $this->postJson("/api/v1/base/designations/{$designation->ulid}/restore");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Designation restored successfully.',
            ]);

        $this->assertDatabaseHas('designations', [
            'ulid' => $designation->ulid,
            'deleted_at' => null,
        ]);
    }

    public function test_can_get_all_designations(): void
    {
        Designation::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/base/designations/all');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'All designations retrieved successfully.',
            ]);
    }

    public function test_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/base/designations', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'level']);
    }

    public function test_validates_unique_designation_name(): void
    {
        $designation = Designation::factory()->create(['name' => 'Manager']);

        $response = $this->postJson('/api/v1/base/designations', [
            'name' => 'Manager',
            'level' => 5,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_unauthorized_user_cannot_access_designations(): void
    {
        // Create a user without permissions
        $unauthorizedUser = User::factory()->create();
        Sanctum::actingAs($unauthorizedUser);

        $response = $this->getJson('/api/v1/base/designations');

        $response->assertStatus(403);
    }

    public function test_unauthorized_user_cannot_create_designation(): void
    {
        // Create a user without create permission
        $unauthorizedUser = User::factory()->create();
        $unauthorizedUser->givePermissionTo('READ_BASE_DESIGNATION');
        Sanctum::actingAs($unauthorizedUser);

        $response = $this->postJson('/api/v1/base/designations', [
            'name' => 'Test Designation',
            'level' => 1,
        ]);

        $response->assertStatus(403);
    }
}
