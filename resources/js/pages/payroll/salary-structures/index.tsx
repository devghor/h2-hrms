import BulkDeleteButton from '@/components/bulk-delete-button';
import DataTable from '@/components/data-table/data-table';
import { RowActions } from '@/components/data-table/row-actions';
import { BaseDialog } from '@/components/dialog/base-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.payrollSalaryStructures];

interface Designation {
    id: number;
    name: string;
}

interface Props {
    designations: Designation[];
}

const defaultForm = {
    id: undefined as number | undefined,
    designation_id: '',
    basic: '',
    annual_increment_percentage: '',
    efficiency_bar: '',
    home_loan_multiplier: '',
    car_loan_max_amount: '',
    car_maintenance_expense: '',
    life_insurance_multiplier: '',
    hospitalization_insurance: '',
    effective_date: '',
    is_active: true,
};

export default function Index({ designations }: Props) {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ ...defaultForm });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true },
        { accessorKey: 'designation_name', header: 'Designation', sortable: true, searchable: true },
        { accessorKey: 'basic', header: 'Basic', sortable: true },
        { accessorKey: 'annual_increment_percentage', header: 'Annual Increment %', sortable: true },
        { accessorKey: 'effective_date', header: 'Effective Date', sortable: true },
        { accessorKey: 'is_active', header: 'Status', sortable: true },
        { accessorKey: 'created_at', header: 'Created At', sortable: true },
        {
            accessorKey: 'actions',
            header: 'Actions',
            sortable: false,
            className: 'w-[60px] text-center',
            cell: ({ row }: any) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row.id)} />,
        },
    ];

    const handleOpenAdd = () => {
        setForm({ ...defaultForm });
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleEdit = (row: any) => {
        axios.get(route('payroll.salary-structures.show', row.id)).then(({ data }) => {
            setForm({
                id: data.id,
                designation_id: data.designation_id ? String(data.designation_id) : '',
                basic: data.basic ?? '',
                annual_increment_percentage: data.annual_increment_percentage ?? '',
                efficiency_bar: data.efficiency_bar ?? '',
                home_loan_multiplier: data.home_loan_multiplier ?? '',
                car_loan_max_amount: data.car_loan_max_amount ?? '',
                car_maintenance_expense: data.car_maintenance_expense ?? '',
                life_insurance_multiplier: data.life_insurance_multiplier ?? '',
                hospitalization_insurance: data.hospitalization_insurance ?? '',
                effective_date: data.effective_date ?? '',
                is_active: data.is_active !== undefined ? !!data.is_active : true,
            });
            setIsEdit(true);
            setOpen(true);
            setFormErrors({});
        });
    };

    const handleClose = () => {
        setOpen(false);
        setIsEdit(false);
    };

    const handleDelete = (id: number) => {
        router.delete(route('payroll.salary-structures.destroy', id), {
            onSuccess: () => {
                toast.success('Salary structure deleted successfully.');
                tableRef.current?.refetch();
            },
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        axios
            .delete(route('payroll.salary-structures.bulk-delete'), { data: { ids: selectedIds } })
            .then(() => {
                toast.success(`${selectedIds.length} salary structure(s) deleted successfully`);
                tableRef.current?.refetch();
            })
            .catch(() => toast.error('Error deleting selected salary structures'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        if (type === 'number' && value.includes('.')) {
            const [, decimal] = value.split('.');
            const maxDecimals = name === 'annual_increment_percentage' ? 4 : 2;
            if (decimal.length > maxDecimals) return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name: string, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (name: string, checked: boolean) => {
        setForm((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            designation_id: form.designation_id ? Number(form.designation_id) : null,
            basic: form.basic || null,
            annual_increment_percentage: form.annual_increment_percentage || null,
            efficiency_bar: form.efficiency_bar || null,
            home_loan_multiplier: form.home_loan_multiplier || null,
            car_loan_max_amount: form.car_loan_max_amount || null,
            car_maintenance_expense: form.car_maintenance_expense || null,
            life_insurance_multiplier: form.life_insurance_multiplier || null,
            hospitalization_insurance: form.hospitalization_insurance || null,
            effective_date: form.effective_date || null,
            is_active: form.is_active,
        };

        if (isEdit && form.id) {
            router.put(route('payroll.salary-structures.update', form.id), data, {
                onSuccess: () => {
                    toast.success('Salary structure updated successfully.');
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors: Record<string, string>) => setFormErrors(errors),
            });
        } else {
            router.post(route('payroll.salary-structures.store'), data, {
                onSuccess: () => {
                    toast.success('Salary structure created successfully.');
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors: Record<string, string>) => setFormErrors(errors),
            });
        }
    };

    return (
        <AppLayout title="Salary Structures" breadcrumbs={breadcrumbs} actions={<Button onClick={handleOpenAdd}>Add Salary Structure</Button>}>
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('payroll.salary-structures.index')}
                onSelectionChange={setSelectedIds}
                extraActions={<BulkDeleteButton selectedCount={selectedIds.length} onDelete={handleBulkDelete} />}
            />

            <BaseDialog
                open={open}
                onOpenChange={setOpen}
                title={isEdit ? 'Edit Salary Structure' : 'Add Salary Structure'}
                description={
                    isEdit ? 'Update the details of the existing salary structure.' : 'Fill in the details to create a new salary structure.'
                }
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel={isEdit ? 'Update' : 'Create'}
                className="max-w-3xl"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <Label>Designation *</Label>
                        <Select value={form.designation_id} onValueChange={(v) => handleSelect('designation_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select designation" />
                            </SelectTrigger>
                            <SelectContent>
                                {designations.map((d) => (
                                    <SelectItem key={d.id} value={String(d.id)}>
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.designation_id && <p className="text-sm text-red-500">{formErrors.designation_id}</p>}
                    </div>

                    <div>
                        <Label>Basic *</Label>
                        <Input name="basic" type="number" step="0.01" min="0" value={form.basic} onChange={handleChange} required />
                        {formErrors.basic && <p className="text-sm text-red-500">{formErrors.basic}</p>}
                    </div>

                    <div>
                        <Label>Annual Increment % *</Label>
                        <Input
                            name="annual_increment_percentage"
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            value={form.annual_increment_percentage}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.annual_increment_percentage && <p className="text-sm text-red-500">{formErrors.annual_increment_percentage}</p>}
                    </div>

                    <div>
                        <Label>Efficiency Bar</Label>
                        <Input name="efficiency_bar" type="number" step="0.01" min="0" value={form.efficiency_bar} onChange={handleChange} />
                        {formErrors.efficiency_bar && <p className="text-sm text-red-500">{formErrors.efficiency_bar}</p>}
                    </div>

                    <div>
                        <Label>Home Loan Multiplier</Label>
                        <Input
                            name="home_loan_multiplier"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.home_loan_multiplier}
                            onChange={handleChange}
                        />
                        {formErrors.home_loan_multiplier && <p className="text-sm text-red-500">{formErrors.home_loan_multiplier}</p>}
                    </div>

                    <div>
                        <Label>Car Loan Max Amount</Label>
                        <Input
                            name="car_loan_max_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.car_loan_max_amount}
                            onChange={handleChange}
                        />
                        {formErrors.car_loan_max_amount && <p className="text-sm text-red-500">{formErrors.car_loan_max_amount}</p>}
                    </div>

                    <div>
                        <Label>Car Maintenance Expense</Label>
                        <Input
                            name="car_maintenance_expense"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.car_maintenance_expense}
                            onChange={handleChange}
                        />
                        {formErrors.car_maintenance_expense && <p className="text-sm text-red-500">{formErrors.car_maintenance_expense}</p>}
                    </div>

                    <div>
                        <Label>Life Insurance Multiplier</Label>
                        <Input
                            name="life_insurance_multiplier"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.life_insurance_multiplier}
                            onChange={handleChange}
                        />
                        {formErrors.life_insurance_multiplier && <p className="text-sm text-red-500">{formErrors.life_insurance_multiplier}</p>}
                    </div>

                    <div>
                        <Label>Hospitalization Insurance</Label>
                        <Input
                            name="hospitalization_insurance"
                            type="number"
                            step="1"
                            min="0"
                            value={form.hospitalization_insurance}
                            onChange={handleChange}
                        />
                        {formErrors.hospitalization_insurance && <p className="text-sm text-red-500">{formErrors.hospitalization_insurance}</p>}
                    </div>

                    <div>
                        <Label>Effective Date *</Label>
                        <Input name="effective_date" type="date" value={form.effective_date} onChange={handleChange} required />
                        {formErrors.effective_date && <p className="text-sm text-red-500">{formErrors.effective_date}</p>}
                    </div>

                    <div className="col-span-2">
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_active" checked={form.is_active} onCheckedChange={(c) => handleCheckbox('is_active', !!c)} />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                    </div>
                </div>
            </BaseDialog>
        </AppLayout>
    );
}
