import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Employee {
    id: number;
    user_id: number;
    employee_code: string | null;
    full_name: string | null;
    first_name: string;
    last_name: string;
    designation_id: number | null;
}

interface SalaryHead {
    id: number;
    name: string;
    code: string | null;
    category: string;
    identification_type: string;
    is_basic_linked: boolean;
    basic_ratio: string | null;
    position: number | null;
}

interface SalaryProfileItem {
    payroll_salary_head_id: number;
    amount: string;
}

interface ActiveProfile {
    id: number;
    basic_amount: string;
    gross_amount: string;
    deduction_amount: string;
    net_amount: string;
    items: {
        payroll_salary_head_id: number;
        amount: string;
    }[];
}

interface SalaryStructure {
    id: number;
    basic: string;
    designation_id: number;
}

interface Props {
    employee: Employee;
    salaryHeads: SalaryHead[];
    activeProfile: ActiveProfile | null;
    salaryStructure: SalaryStructure | null;
}

const GROSS_CATEGORIES = ['gross', 'benefit'];
const DEDUCTION_CATEGORIES = ['deduction'];

function calcTotals(items: SalaryProfileItem[], salaryHeads: SalaryHead[]) {
    let basicAmount = 0;
    let grossAmount = 0;
    let deductionAmount = 0;

    items.forEach((item) => {
        const head = salaryHeads.find((h) => h.id === item.payroll_salary_head_id);
        if (!head) return;
        const amount = parseFloat(item.amount) || 0;
        const cat = typeof head.category === 'string' ? head.category : ((head.category as any)?.value ?? '');

        if (head.identification_type === 'basic' || (head.identification_type as any)?.value === 'basic') {
            basicAmount = amount;
        }
        if (GROSS_CATEGORIES.includes(cat)) {
            grossAmount += amount;
        }
        if (DEDUCTION_CATEGORIES.includes(cat)) {
            deductionAmount += amount;
        }
    });

    const netAmount = grossAmount - deductionAmount;

    return { basicAmount, grossAmount, deductionAmount, netAmount };
}

function getCategoryLabel(category: string | { value: string; label?: string }): string {
    if (typeof category === 'object') return category.label ?? category.value ?? '';
    return category;
}

function getCategoryColor(category: string | { value: string }): string {
    const val = typeof category === 'object' ? category.value : category;
    switch (val) {
        case 'gross':
            return 'bg-blue-100 text-blue-700';
        case 'benefit':
            return 'bg-green-100 text-green-700';
        case 'deduction':
            return 'bg-red-100 text-red-700';
        case 'adjustment':
            return 'bg-yellow-100 text-yellow-700';
        default:
            return 'bg-gray-100 text-gray-600';
    }
}

export default function Show({ employee, salaryHeads, activeProfile, salaryStructure }: Props) {
    const employeeName = employee.full_name || `${employee.first_name} ${employee.last_name}`;

    const breadcrumbs: BreadcrumbItem[] = [
        breadcrumbItems.dashboard,
        breadcrumbItems.payrollEmployeeSalaryProfiles,
        { title: employeeName, href: route('payroll.employee-salary-profiles.show', employee.user_id) },
    ];

    const isBasicIdentType = (head: SalaryHead) =>
        head.identification_type === 'basic' || (head.identification_type as any)?.value === 'basic';

    const buildInitialItems = (): SalaryProfileItem[] => {
        return salaryHeads.map((head) => {
            const existing = activeProfile?.items.find((i) => i.payroll_salary_head_id === head.id);
            if (existing) {
                return { payroll_salary_head_id: head.id, amount: existing.amount };
            }
            // No active profile: seed basic head from salary structure
            if (!activeProfile && isBasicIdentType(head) && salaryStructure?.basic) {
                return { payroll_salary_head_id: head.id, amount: parseFloat(salaryStructure.basic).toFixed(2) };
            }
            if (head.is_basic_linked && head.basic_ratio && salaryStructure?.basic) {
                const computed = (parseFloat(head.basic_ratio) * parseFloat(salaryStructure.basic)) / 100;
                return { payroll_salary_head_id: head.id, amount: computed.toFixed(2) };
            }
            return { payroll_salary_head_id: head.id, amount: '0.00' };
        });
    };

    const [items, setItems] = useState<SalaryProfileItem[]>(buildInitialItems);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const totals = calcTotals(items, salaryHeads);

    const handleAmountChange = (headId: number, value: string) => {
        const changedHead = salaryHeads.find((h) => h.id === headId);
        const changingBasic = changedHead && isBasicIdentType(changedHead);

        setItems((prev) =>
            prev.map((item) => {
                if (item.payroll_salary_head_id === headId) {
                    return { ...item, amount: value };
                }
                // Recalculate basic-linked heads in real time when basic changes
                if (changingBasic) {
                    const head = salaryHeads.find((h) => h.id === item.payroll_salary_head_id);
                    if (head?.is_basic_linked && head.basic_ratio) {
                        const newBasic = parseFloat(value) || 0;
                        const computed = (parseFloat(head.basic_ratio) * newBasic) / 100;
                        return { ...item, amount: computed.toFixed(2) };
                    }
                }
                return item;
            }),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            user_id: employee.user_id,
            basic_amount: totals.basicAmount.toFixed(2),
            gross_amount: totals.grossAmount.toFixed(2),
            deduction_amount: totals.deductionAmount.toFixed(2),
            net_amount: totals.netAmount.toFixed(2),
            items: items.map((item) => ({
                payroll_salary_head_id: item.payroll_salary_head_id,
                amount: parseFloat(item.amount) || 0,
            })),
        };

        router.post(route('payroll.employee-salary-profiles.store'), data, {
            onSuccess: () => {
                toast.success('Salary profile saved successfully.');
                setFormErrors({});
            },
            onError: (errors: Record<string, string>) => {
                setFormErrors(errors);
                toast.error('Please fix the errors and try again.');
            },
        });
    };

    return (
        <AppLayout
            title={`Salary Profile — ${employeeName}`}
            breadcrumbs={breadcrumbs}
            actions={
                <Button type="button" onClick={handleSubmit}>
                    Save Profile
                </Button>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Employee Info */}
                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Employee Information</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Name</p>
                            <p className="font-medium">{employeeName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Employee Code</p>
                            <p className="font-medium">{employee.employee_code ?? '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Designation Basic</p>
                            <p className="font-medium">{salaryStructure ? parseFloat(salaryStructure.basic).toLocaleString() : '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Profile Status</p>
                            <p className="font-medium">{activeProfile ? 'Active Profile' : 'No Profile'}</p>
                        </div>
                    </div>
                </div>

                {/* Salary Heads Table */}
                <div className="rounded-lg border bg-card">
                    <div className="border-b px-4 py-3">
                        <h2 className="text-sm font-semibold">Salary Head Amounts</h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Basic-linked heads are pre-calculated from the designation structure. Adjust amounts as needed.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">#</th>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Salary Head</th>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Code</th>
                                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Category</th>
                                    <th className="w-44 px-4 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {salaryHeads.map((head, index) => {
                                    const item = items.find((i) => i.payroll_salary_head_id === head.id);
                                    const errKey = `items.${index}.amount`;
                                    return (
                                        <tr key={head.id} className="hover:bg-muted/20">
                                            <td className="px-4 py-2 text-muted-foreground">{index + 1}</td>
                                            <td className="px-4 py-2 font-medium">
                                                {head.name}
                                                {head.is_basic_linked && (
                                                    <span className="ml-1.5 rounded bg-blue-50 px-1 py-0.5 text-[10px] text-blue-600">
                                                        Basic linked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-muted-foreground">{head.code ?? '—'}</td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(head.category)}`}
                                                >
                                                    {getCategoryLabel(head.category)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="ml-auto h-8 w-36 text-right"
                                                    value={item?.amount ?? '0.00'}
                                                    onChange={(e) => handleAmountChange(head.id, e.target.value)}
                                                />
                                                {formErrors[errKey] && <p className="mt-0.5 text-xs text-red-500">{formErrors[errKey]}</p>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals Summary */}
                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Summary</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg bg-muted/40 p-3 text-center">
                            <p className="text-xs text-muted-foreground">Basic Amount</p>
                            <p className="text-lg font-semibold">{totals.basicAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3 text-center">
                            <p className="text-xs text-green-600">Gross Amount</p>
                            <p className="text-lg font-semibold text-green-700">
                                {totals.grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="rounded-lg bg-red-50 p-3 text-center">
                            <p className="text-xs text-red-600">Deduction Amount</p>
                            <p className="text-lg font-semibold text-red-700">
                                {totals.deductionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-3 text-center">
                            <p className="text-xs text-blue-600">Net Amount</p>
                            <p className="text-lg font-semibold text-blue-700">
                                {totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                    {(formErrors['basic_amount'] || formErrors['gross_amount'] || formErrors['deduction_amount'] || formErrors['net_amount']) && (
                        <p className="mt-2 text-sm text-red-500">
                            {formErrors['basic_amount'] || formErrors['gross_amount'] || formErrors['deduction_amount'] || formErrors['net_amount']}
                        </p>
                    )}
                </div>
            </form>
        </AppLayout>
    );
}
