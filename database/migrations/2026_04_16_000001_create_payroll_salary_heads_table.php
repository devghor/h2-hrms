<?php

use App\Enums\Payroll\SalaryHeadCategoryEnum;
use App\Enums\Payroll\SalaryHeadGlPrefixTypeEnum;
use App\Enums\Payroll\SalaryHeadIdentificationTypeEnum;
use App\Enums\Payroll\SalaryHeadModeEnum;
use App\Enums\Payroll\SalaryHeadTaxCalculationTypeEnum;
use App\Helpers\MigrationHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_salary_heads', function (Blueprint $table) {
            $table->id();
            MigrationHelper::ulidField($table);
            MigrationHelper::companyIdField($table);
            $table->string('name');
            $table->string('code')->nullable();
            $table->boolean('is_basic_linked')->default(false);
            $table->decimal('basic_ratio', 8, 2)->nullable();
            $table->string('mode')->default(SalaryHeadModeEnum::Cash->value);
            $table->string('gl_account_code')->nullable();
            $table->string('gl_prefix_type')->default(SalaryHeadGlPrefixTypeEnum::Dynamic->value);
            $table->string('identification_type')->default(SalaryHeadIdentificationTypeEnum::Other->value);
            $table->string('category')->default(SalaryHeadCategoryEnum::Gross->value);
            $table->integer('position')->nullable();
            $table->boolean('is_variable')->default(false);
            $table->boolean('is_taxable')->default(false);
            $table->string('tax_calculation_type')->default(SalaryHeadTaxCalculationTypeEnum::None->value);
            $table->decimal('tax_value', 8, 2)->nullable();
            $table->boolean('is_active')->default(true);
            MigrationHelper::commonFields($table);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_salary_heads');
    }
};
