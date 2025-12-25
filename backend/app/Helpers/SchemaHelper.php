<?php

namespace App\Helpers;

use Illuminate\Database\Schema\Blueprint;

final class SchemaHelper
{
    public static function addUlidColumn(
        Blueprint $table,
        string $column = 'ulid'
    ): void {
        $table->ulid($column)->unique();
    }

    public static function addTenantIdColumn(
        Blueprint $table,
        string $column = 'tenant_id'
    ): void {
        $table->bigInteger($column);
    }

    public static function addTimestampsColumns(
        Blueprint $table
    ): void {
        $table->timestamps();
    }

    public static function addSoftDeletesColumn(
        Blueprint $table
    ): void {
        $table->softDeletes();
    }

    public static function addCreatedByUpdatedByDeletedByColumns(
        Blueprint $table,
        string $createdByColumn = 'created_by',
        string $updatedByColumn = 'updated_by',
        string $deletedByColumn = 'deleted_by'
    ): void {
        $table->bigInteger($createdByColumn)->nullable();
        $table->bigInteger($updatedByColumn)->nullable();
        $table->bigInteger($deletedByColumn)->nullable();
    }
}
