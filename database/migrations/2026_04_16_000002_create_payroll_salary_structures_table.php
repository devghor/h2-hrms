<?php

use App\Helpers\MigrationHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_salary_structures', function (Blueprint $table) {
            $table->id();
            MigrationHelper::ulidField($table);
            MigrationHelper::companyIdField($table);
            $table->foreignId('designation_id')->constrained('designations')->cascadeOnDelete();
            $table->decimal('basic', 15, 2);
            $table->decimal('annual_increment_percentage', 8, 2)->default(0);
            $table->decimal('efficiency_bar', 15, 2)->nullable();
            $table->decimal('home_loan_multiplier', 8, 2)->nullable();
            $table->decimal('car_loan_max_amount', 15, 2)->nullable();
            $table->decimal('car_maintenance_expense', 15, 2)->nullable();
            $table->decimal('life_insurance_multiplier', 8, 2)->nullable();
            $table->decimal('hospitalization_insurance', 15, 2)->nullable();
            $table->date('effective_date');
            $table->boolean('is_active')->default(true);
            MigrationHelper::commonFields($table);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_salary_structures');
    }
};
