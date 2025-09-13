<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('desks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
            $table->foreign('parent_id')->references('id')->on('desks')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('desks');
    }
};
