Module Prefix: Payroll

Model, Controller, DataTable, Service file name should have module prefix also folder name will be Module Prefix folder

Enum, Traits should in folder like module prefix


# payroll_salary_heads
- name
- code
- is_basic_linked
- basic_ratio
- mode [cash, bank]
- gl_account_code
- gl_prefix_type [dynamic, static]
- identification_type [basic, lfa, pf_employee, pf_employer, pf_employer_deduction, other]
- category [gross, benefit, deduction, adjustment]
- position
- is_variable
- is_taxable
- tax_calculation_type [percentage, fixed, none]
- tax_value
- is_active


# payroll_salary_structures

- designation
- basic
- annual_increment_percentage
- efficiency_bar
- home_loan_multiplier
- car_loan_max_amount
- car_maintenance_expense
- life_insurance_multiplier
- hospitalization_insurance
- effective_date
- is_active



- Probation employee not getting any provident fund
- Only Employee Type permanent employee getting provident fund
- head regarding pf [pf_contribution_company, pf_contribution_company_deduction, pf_contribution_employee]
- pf will be getting by  basic percentage

**Salary certificate will generate from employee profile salary specification**


# gratuity_fund_members (When salary update it will be updated)
- eligibility_effective_date
- year_count_date_from
- year_count_date_to
- year_count
- times_of_basic
- last_basic
- balance
- last_working_date
- last_withdrawal_date
- status
- is_active

# salary_disbursement_batches
- name
- Year
- Month
- Type [Mothly Slary, Special Batch ]
- Remark
- Status [Generated = 0, Processed = 2, SentForApproval = 3, RevertFromApproval = 4, SentForDisbursement = 5, Disbursed =6]

**Rules**
- Batch only updated when status Generated, Processed, Revert From Approval
- Special batch can not be generated, it will be uploaded form excel
- Slary calculation differerntly for New Joiner, Promotion Calculation, Increment, Confirmation, Last Working Day
- Salary Head Transaction type Debit = Gross
- Salary Head Transaction type Credit = Deduction
- Net pay = Gross - Deduction
