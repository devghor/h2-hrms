<?php

use App\Helpers\MigrationHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('designations', function (Blueprint $table) {
            $table->id();
            MigrationHelper::ulidField($table);
            MigrationHelper::companyIdField($table);
            $table->string('name');
            $table->string('code')->nullable();
            $table->string('description')->nullable();
            $table->integer('position')->nullable();
            MigrationHelper::commonFields($table);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('designations');
    }
};
