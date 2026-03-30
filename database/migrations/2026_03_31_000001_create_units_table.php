<?php

use App\Helpers\MigrationHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            MigrationHelper::ulidField($table);
            MigrationHelper::companyIdField($table);
            $table->string('name');
            $table->string('code')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->string('description')->nullable();
            MigrationHelper::commonFields($table);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
