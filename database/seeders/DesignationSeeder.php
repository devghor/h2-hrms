<?php

namespace Database\Seeders;

use App\Models\Configuration\Company\Company;
use App\Models\Configuration\Designation\Designation;
use Illuminate\Database\Seeder;

class DesignationSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        if (!$company) {
            return;
        }

        $designations = [
            // Executive
            ['name' => 'Chief Executive Officer',      'code' => 'CEO',         'description' => 'Head of the company',                         'position' => 1],
            ['name' => 'Chief Technology Officer',     'code' => 'CTO',         'description' => 'Head of technology and engineering',           'position' => 2],
            ['name' => 'Chief Operating Officer',      'code' => 'COO',         'description' => 'Head of operations',                          'position' => 3],
            ['name' => 'Chief Financial Officer',      'code' => 'CFO',         'description' => 'Head of finance',                             'position' => 4],
            ['name' => 'Chief Product Officer',        'code' => 'CPO',         'description' => 'Head of product strategy',                    'position' => 5],

            // Senior Management
            ['name' => 'VP of Engineering',            'code' => 'VP-ENG',      'description' => 'Leads engineering organisation',              'position' => 6],
            ['name' => 'Engineering Manager',          'code' => 'ENG-MGR',     'description' => 'Manages engineering teams',                   'position' => 7],
            ['name' => 'Product Manager',              'code' => 'PROD-MGR',    'description' => 'Owns product roadmap and delivery',           'position' => 8],
            ['name' => 'Project Manager',              'code' => 'PROJ-MGR',    'description' => 'Plans and tracks project delivery',           'position' => 9],
            ['name' => 'HR Manager',                   'code' => 'HR-MGR',      'description' => 'Manages HR operations',                       'position' => 10],
            ['name' => 'Finance Manager',              'code' => 'FIN-MGR',     'description' => 'Manages financial operations',                'position' => 11],
            ['name' => 'Marketing Manager',            'code' => 'MKT-MGR',     'description' => 'Leads marketing strategy',                    'position' => 12],
            ['name' => 'Sales Manager',                'code' => 'SALES-MGR',   'description' => 'Leads sales team and targets',                'position' => 13],

            // Engineering
            ['name' => 'Software Architect',           'code' => 'ARCHITECT',   'description' => 'Designs system architecture',                 'position' => 14],
            ['name' => 'Senior Software Engineer',     'code' => 'SR-SWE',      'description' => 'Leads technical implementation',              'position' => 15],
            ['name' => 'Senior Backend Engineer',      'code' => 'SR-BE',       'description' => 'Senior server-side engineer',                 'position' => 16],
            ['name' => 'Senior Frontend Engineer',     'code' => 'SR-FE',       'description' => 'Senior client-side engineer',                 'position' => 17],
            ['name' => 'Senior Full Stack Engineer',   'code' => 'SR-FSE',      'description' => 'Senior full stack developer',                 'position' => 18],
            ['name' => 'Backend Engineer',             'code' => 'BE',          'description' => 'Server-side application development',         'position' => 19],
            ['name' => 'Frontend Engineer',            'code' => 'FE',          'description' => 'Client-side application development',         'position' => 20],
            ['name' => 'Full Stack Engineer',          'code' => 'FSE',         'description' => 'End-to-end application development',          'position' => 21],
            ['name' => 'Mobile Developer',             'code' => 'MOBILE-DEV',  'description' => 'iOS and Android application development',     'position' => 22],
            ['name' => 'DevOps Engineer',              'code' => 'DEVOPS',      'description' => 'CI/CD, infrastructure, and deployment',       'position' => 23],
            ['name' => 'Data Engineer',                'code' => 'DATA-ENG',    'description' => 'Data pipelines and warehouse management',     'position' => 24],
            ['name' => 'Data Scientist',               'code' => 'DATA-SCI',    'description' => 'Machine learning and data analysis',          'position' => 25],
            ['name' => 'Security Engineer',            'code' => 'SEC-ENG',     'description' => 'Application and infrastructure security',     'position' => 26],

            // QA
            ['name' => 'QA Lead',                      'code' => 'QA-LEAD',     'description' => 'Leads quality assurance team',                'position' => 27],
            ['name' => 'Senior QA Engineer',           'code' => 'SR-QA',       'description' => 'Senior quality assurance engineer',           'position' => 28],
            ['name' => 'QA Engineer',                  'code' => 'QA',          'description' => 'Tests features and reports bugs',             'position' => 29],

            // Design
            ['name' => 'UX/UI Lead Designer',          'code' => 'UX-LEAD',     'description' => 'Leads design system and UX strategy',         'position' => 30],
            ['name' => 'UX/UI Designer',               'code' => 'UX-DES',      'description' => 'Designs user interfaces and experiences',     'position' => 31],

            // Junior / Entry
            ['name' => 'Junior Software Engineer',     'code' => 'JR-SWE',      'description' => 'Entry-level software engineer',               'position' => 32],
            ['name' => 'Junior Backend Engineer',      'code' => 'JR-BE',       'description' => 'Entry-level backend developer',               'position' => 33],
            ['name' => 'Junior Frontend Engineer',     'code' => 'JR-FE',       'description' => 'Entry-level frontend developer',              'position' => 34],
            ['name' => 'Software Intern',              'code' => 'INTERN',      'description' => 'Internship position for students',            'position' => 35],

            // HR & Admin
            ['name' => 'HR Specialist',                'code' => 'HR-SPEC',     'description' => 'Handles recruitment and HR processes',        'position' => 36],
            ['name' => 'Recruiter',                    'code' => 'RECRUIT',     'description' => 'Sources and screens candidates',              'position' => 37],
            ['name' => 'Office Administrator',         'code' => 'OFFICE-ADM',  'description' => 'Manages office operations',                   'position' => 38],

            // Finance
            ['name' => 'Accountant',                   'code' => 'ACCT',        'description' => 'Manages accounts and bookkeeping',            'position' => 39],
            ['name' => 'Financial Analyst',            'code' => 'FIN-ANALYST', 'description' => 'Analyses financial performance',              'position' => 40],

            // Sales & Marketing
            ['name' => 'Business Development Manager', 'code' => 'BD-MGR',      'description' => 'Identifies and pursues growth opportunities',  'position' => 41],
            ['name' => 'Account Executive',            'code' => 'ACC-EXEC',    'description' => 'Manages client accounts and closures',         'position' => 42],
            ['name' => 'Marketing Specialist',         'code' => 'MKT-SPEC',    'description' => 'Executes marketing campaigns',                 'position' => 43],
            ['name' => 'Content Creator',              'code' => 'CONTENT',     'description' => 'Creates technical and marketing content',      'position' => 44],

            // Support & Ops
            ['name' => 'Technical Support Engineer',   'code' => 'TECH-SUP',    'description' => 'Resolves technical issues for clients',        'position' => 45],
            ['name' => 'Customer Success Manager',     'code' => 'CSM',         'description' => 'Ensures client satisfaction and retention',    'position' => 46],
            ['name' => 'System Administrator',         'code' => 'SYS-ADMIN',   'description' => 'Manages servers and internal IT systems',      'position' => 47],
        ];

        foreach ($designations as $data) {
            Designation::updateOrCreate(
                ['company_id' => $company->id, 'code' => $data['code']],
                array_merge($data, ['company_id' => $company->id])
            );
        }
    }
}
