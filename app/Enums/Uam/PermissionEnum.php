<?php

namespace App\Enums\Uam;

enum PermissionEnum: string
{
    // General > Dashboard
    case ReadGeneralDashboard = 'READ_GENERAL_DASHBOARD';

    /**
     * Uam Module
     */
        // Uam > User
    case CreateUamUser = 'CREATE_UAM_USER';
    case ReadUamUser = 'READ_UAM_USER';
    case UpdateUamUser = 'UPDATE_UAM_USER';
    case DeleteUamUser = 'DELETE_UAM_USER';

        // Uam > Role
    case CreateUamRole = 'CREATE_UAM_ROLE';
    case ReadUamRole = 'READ_UAM_ROLE';
    case UpdateUamRole = 'UPDATE_UAM_ROLE';
    case DeleteUamRole = 'DELETE_UAM_ROLE';

        // Uam > Permission
    case CreateUamPermission = 'CREATE_UAM_PERMISSION';
    case ReadUamPermission = 'READ_UAM_PERMISSION';
    case UpdateUamPermission = 'UPDATE_UAM_PERMISSION';
    case DeleteUamPermission = 'DELETE_UAM_PERMISSION';

    /**
     * Employee Module
     */
        // Employee > Employees
    case CreateEmployeeEmployee = 'CREATE_EMPLOYEE_EMPLOYEE';
    case ReadEmployeeEmployee = 'READ_EMPLOYEE_EMPLOYEE';
    case UpdateEmployeeEmployee = 'UPDATE_EMPLOYEE_EMPLOYEE';
    case DeleteEmployeeEmployee = 'DELETE_EMPLOYEE_EMPLOYEE';

    /**
     * Payroll Module
     */
        // Payroll > Salary Head
    case CreatePayrollSalaryHead = 'CREATE_PAYROLL_SALARY_HEAD';
    case ReadPayrollSalaryHead = 'READ_PAYROLL_SALARY_HEAD';
    case UpdatePayrollSalaryHead = 'UPDATE_PAYROLL_SALARY_HEAD';
    case DeletePayrollSalaryHead = 'DELETE_PAYROLL_SALARY_HEAD';

        // Payroll > Salary Structure
    case CreatePayrollSalaryStructure = 'CREATE_PAYROLL_SALARY_STRUCTURE';
    case ReadPayrollSalaryStructure = 'READ_PAYROLL_SALARY_STRUCTURE';
    case UpdatePayrollSalaryStructure = 'UPDATE_PAYROLL_SALARY_STRUCTURE';
    case DeletePayrollSalaryStructure = 'DELETE_PAYROLL_SALARY_STRUCTURE';

        // Payroll > Employee Salary Profile
    case CreatePayrollEmployeeSalaryProfile = 'CREATE_PAYROLL_EMPLOYEE_SALARY_PROFILE';
    case ReadPayrollEmployeeSalaryProfile = 'READ_PAYROLL_EMPLOYEE_SALARY_PROFILE';
    case UpdatePayrollEmployeeSalaryProfile = 'UPDATE_PAYROLL_EMPLOYEE_SALARY_PROFILE';
    case DeletePayrollEmployeeSalaryProfile = 'DELETE_PAYROLL_EMPLOYEE_SALARY_PROFILE';

    /**
     * Configuration Module
     */
        // Configuration > Company
    case CreateConfigurationCompany = 'CREATE_CONFIGURATION_COMPANY';
    case ReadConfigurationCompany = 'READ_CONFIGURATION_COMPANY';
    case UpdateConfigurationCompany = 'UPDATE_CONFIGURATION_COMPANY';
    case DeleteConfigurationCompany = 'DELETE_CONFIGURATION_COMPANY';

        // Configuration > Branch
    case CreateConfigurationBranch = 'CREATE_CONFIGURATION_BRANCH';
    case ReadConfigurationBranch = 'READ_CONFIGURATION_BRANCH';
    case UpdateConfigurationBranch = 'UPDATE_CONFIGURATION_BRANCH';
    case DeleteConfigurationBranch = 'DELETE_CONFIGURATION_BRANCH';

        // Configuration > Division
    case CreateConfigurationDivision = 'CREATE_CONFIGURATION_DIVISION';
    case ReadConfigurationDivision = 'READ_CONFIGURATION_DIVISION';
    case UpdateConfigurationDivision = 'UPDATE_CONFIGURATION_DIVISION';
    case DeleteConfigurationDivision = 'DELETE_CONFIGURATION_DIVISION';

        // Configuration > Department
    case CreateConfigurationDepartment = 'CREATE_CONFIGURATION_DEPARTMENT';
    case ReadConfigurationDepartment = 'READ_CONFIGURATION_DEPARTMENT';
    case UpdateConfigurationDepartment = 'UPDATE_CONFIGURATION_DEPARTMENT';
    case DeleteConfigurationDepartment = 'DELETE_CONFIGURATION_DEPARTMENT';

        // Configuration > Designation
    case CreateConfigurationDesignation = 'CREATE_CONFIGURATION_DESIGNATION';
    case ReadConfigurationDesignation = 'READ_CONFIGURATION_DESIGNATION';
    case UpdateConfigurationDesignation = 'UPDATE_CONFIGURATION_DESIGNATION';
    case DeleteConfigurationDesignation = 'DELETE_CONFIGURATION_DESIGNATION';
}
