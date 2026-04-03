# salary_heads fields

- name
- code
- is_linked_basic
- percentage_of_basic_salary
- transaction_type [Deduction, Earning]
- transaction_mode [Cash, Bank]
- gl_account_prefix
- gl_account_prefix_type [Dynamic, Static]
- salary_head_type [Summarize, Sortable, Custom Generate, LFA, Festival]
- is_variable
- is_taxable
- tax_amount_type [Percentage, Fixed, Not Applicable]
- amount_or_rate
- is_active

# salary_structures fields

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
- Status [Generated, Sent From Approval, Revert From Approval, Disbursed]