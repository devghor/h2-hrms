<?php

use App\Helpers\MigrationHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_employee_salary_profile_items', function (Blueprint $table) {
            $table->id();
            MigrationHelper::ulidField($table);
            MigrationHelper::companyIdField($table);
            $table->foreignId('payroll_employee_salary_profile_id')
                ->constrained('payroll_employee_salary_profiles', 'id', 'pesp_items_profile_fk')
                ->cascadeOnDelete();
            $table->foreignId('payroll_salary_head_id')
                ->constrained('payroll_salary_heads', 'id', 'pesp_items_head_fk')
                ->cascadeOnDelete();
            $table->decimal('amount', 15, 2)->default(0);
            MigrationHelper::commonFields($table);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_employee_salary_profile_items');
    }
};
