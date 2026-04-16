<?php

namespace Database\Seeders;

use App\Models\Configuration\Company\Company;
use App\Models\Configuration\Designation\Designation;
use App\Models\Payroll\PayrollSalaryStructure;
use Illuminate\Database\Seeder;

class PayrollSalaryStructureSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        if (!$company) {
            return;
        }

        // designation code => basic salary (BDT)
        $structures = [
            // Executive
            'CEO'        => 500000,
            'CTO'        => 450000,
            'COO'        => 420000,
            'CFO'        => 420000,
            'CPO'        => 400000,

            // Senior Management
            'VP-ENG'     => 350000,
            'ENG-MGR'    => 280000,
            'PROD-MGR'   => 260000,
            'PROJ-MGR'   => 240000,
            'HR-MGR'     => 220000,
            'FIN-MGR'    => 220000,
            'MKT-MGR'    => 200000,
            'SALES-MGR'  => 200000,

            // Engineering
            'ARCHITECT'  => 220000,
            'SR-SWE'     => 180000,
            'SR-BE'      => 170000,
            'SR-FE'      => 170000,
            'SR-FSE'     => 175000,
            'BE'         => 120000,
            'FE'         => 120000,
            'FSE'        => 125000,
            'MOBILE-DEV' => 130000,
            'DEVOPS'     => 140000,
            'DATA-ENG'   => 140000,
            'DATA-SCI'   => 150000,
            'SEC-ENG'    => 150000,

            // QA
            'QA-LEAD'    => 130000,
            'SR-QA'      => 100000,
            'QA'         =>  70000,

            // Design
            'UX-LEAD'    => 130000,
            'UX-DES'     =>  90000,

            // Junior / Entry
            'JR-SWE'     =>  60000,
            'JR-BE'      =>  55000,
            'JR-FE'      =>  55000,
            'INTERN'     =>  25000,

            // HR & Admin
            'HR-SPEC'    =>  60000,
            'RECRUIT'    =>  55000,
            'OFFICE-ADM' =>  40000,

            // Finance
            'ACCT'       =>  65000,
            'FIN-ANALYST'=>  80000,

            // Sales & Marketing
            'BD-MGR'     => 180000,
            'ACC-EXEC'   =>  90000,
            'MKT-SPEC'   =>  70000,
            'CONTENT'    =>  55000,

            // Support & Ops
            'TECH-SUP'   =>  60000,
            'CSM'        => 100000,
            'SYS-ADMIN'  =>  90000,
        ];

        foreach ($structures as $code => $basic) {
            $designation = Designation::where('company_id', $company->id)
                ->where('code', $code)
                ->first();

            if (!$designation) {
                continue;
            }

            PayrollSalaryStructure::updateOrCreate(
                ['company_id' => $company->id, 'designation_id' => $designation->id],
                [
                    'company_id'                  => $company->id,
                    'designation_id'              => $designation->id,
                    'basic'                       => $basic,
                    'annual_increment_percentage' => 5.00,
                    'effective_date'              => '2025-01-01',
                    'is_active'                   => true,
                ]
            );
        }
    }
}
