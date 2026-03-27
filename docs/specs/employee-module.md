# HRMS Employee Module - Database Specification

## Overview

This document defines the database schema for an **HRMS Employee Module** using a multi-company architecture.

Each record belongs to a company using `company_id`.

---

## Core Design Rules

- `company_id` = ownership of data (multi-company isolation)
- `employee_id` = used for employee relationships
- `created_by`, `updated_by` = audit tracking (references `users.id`)
- Do NOT mix `tenant_id` and `company_id`
- `ulid` is used as a public/global identifier (optional but recommended)

---

## Tables

---

## 1. employees

Core employee table.

| Column | Type | Description |
|--------|------|------------|
| id | BIGINT (PK) | Primary key |
| ulid | ULID | Public identifier |
| company_id | BIGINT (FK) | Company reference |
| employee_code | VARCHAR | Unique employee code |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| full_name | VARCHAR | Full name |
| email | VARCHAR | Unique email |
| phone | VARCHAR | Phone number |
| date_of_birth | DATE | Date of birth |
| gender | VARCHAR | Gender |
| hire_date | DATE | Joining date |
| employment_status | VARCHAR | Active / Inactive |
| department_id | BIGINT (FK) | Department reference |
| designation_id | BIGINT (FK) | Designation reference |
| manager_id | BIGINT (FK) | Self-referencing manager |
| address | TEXT | Address |
| city | VARCHAR | City |
| country | VARCHAR | Country |
| status | BOOLEAN | Active status flag |
| created_by | BIGINT (FK) | users.id |
| updated_by | BIGINT (FK) | users.id |
| created_at | TIMESTAMP | Created time |
| updated_at | TIMESTAMP | Updated time |

---

## 2. employee_contacts

| Column | Type | Description |
|--------|------|------------|
| id | BIGINT (PK) | Primary key |
| ulid | ULID | Public identifier |
| company_id | BIGINT (FK) | Company reference |
| employee_id | BIGINT (FK) | Related employee |
| contact_name | VARCHAR | Contact person name |
| relationship | VARCHAR | Relationship with employee |
| phone | VARCHAR | Phone number |
| created_at | TIMESTAMP | Created time |
| updated_at | TIMESTAMP | Updated time |

---

## 3. employee_documents

| Column | Type | Description |
|--------|------|------------|
| id | BIGINT (PK) | Primary key |
| ulid | ULID | Public identifier |
| company_id | BIGINT (FK) | Company reference |
| employee_id | BIGINT (FK) | Related employee |
| document_name | VARCHAR | Document name |
| document_type | VARCHAR | Type (NID, CV, etc.) |
| file_path | VARCHAR | File storage path |
| uploaded_at | TIMESTAMP | Upload time |
| created_by | BIGINT (FK) | users.id |
| created_at | TIMESTAMP | Created time |
| updated_at | TIMESTAMP | Updated time |

---

## 4. employee_education

| Column | Type | Description |
|--------|------|------------|
| id | BIGINT (PK) | Primary key |
| ulid | ULID | Public identifier |
| company_id | BIGINT (FK) | Company reference |
| employee_id | BIGINT (FK) | Related employee |
| degree | VARCHAR | Degree name |
| institution | VARCHAR | Institution name |
| year_of_passing | YEAR | Passing year |
| created_at | TIMESTAMP | Created time |
| updated_at | TIMESTAMP | Updated time |

---

## 5. employee_experience

| Column | Type | Description |
|--------|------|------------|
| id | BIGINT (PK) | Primary key |
| ulid | ULID | Public identifier |
| company_id | BIGINT (FK) | Company reference |
| employee_id | BIGINT (FK) | Related employee |
| company_name | VARCHAR | Previous company |
| designation | VARCHAR | Job role |
| start_date | DATE | Start date |
| end_date | DATE | End date |
| responsibilities | TEXT | Job responsibilities |
| created_at | TIMESTAMP | Created time |
| updated_at | TIMESTAMP | Updated time |

---

## Relationships

- **companies → employees** (1-to-many)
- **employees → departments** (many-to-one)
- **employees → designations** (many-to-one)
- **employees → employees (manager hierarchy)** (self-relation)
- **employees → contacts/documents/education/experience** (1-to-many)
- **users → employees** (1-to-one or optional mapping)

---

## Security Rules

- All queries MUST be filtered by `company_id`
- Prevent cross-company data access
- Use Laravel Global Scope for automatic company isolation
- Enforce `company_id` at repository/service level

---

## Notes

- `company_id` = primary tenant ownership key
- `employee_id` = HR relationship key (not ownership)
- `created_by` / `updated_by` = audit trail for system actions
- Schema is fully **Laravel migration ready**
