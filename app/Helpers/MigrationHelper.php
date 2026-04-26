<?php

namespace App\Helpers;

use Illuminate\Database\Schema\Blueprint;

class MigrationHelper
{
    public static function ulidField(Blueprint $table): void
    {
        $table->ulid('ulid')->unique()->index();
    }

    public static function commonFields(Blueprint $table): void
    {
        $table->unsignedBigInteger('created_by')->nullable();
        $table->unsignedBigInteger('updated_by')->nullable();
        $table->timestamps();
    }

    public static function companyIdField(Blueprint $table): void
    {
        $table->bigInteger('company_id')->index();
    }
}
