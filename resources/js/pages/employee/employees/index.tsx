import BulkDeleteButton from '@/components/bulk-delete-button';
import DataTable from '@/components/data-table/data-table';
import { RowActions } from '@/components/data-table/row-actions';
import { BaseDialog } from '@/components/dialog/base-dialog';
import { Button } from '@/components/ui/button';
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

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.employeeEmployees];

type Option = { id: number; name: string };
type EnumOption = { value: number; label: string };

interface Props {
    departments: Option[];
    designations: Option[];
    managers: Option[];
    employeeTypes: EnumOption[];
    employeeStatuses: EnumOption[];
}

const defaultForm = {
    id: undefined as number | undefined,
    first_name: '',
    last_name: '',
    employee_code: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    hire_date: '',
    employee_type: 1,
    employee_status: 1,
    department_id: '',
    designation_id: '',
    manager_id: '',
    address: '',
    city: '',
    country: '',
};

export default function Index({ departments, designations, managers, employeeTypes, employeeStatuses }: Props) {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ ...defaultForm });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true },
        { accessorKey: 'employee_code', header: 'Code', sortable: true, searchable: true },
        { accessorKey: 'full_name', header: 'Name', sortable: true, searchable: true },
        { accessorKey: 'email', header: 'Email', sortable: true, searchable: true },
        { accessorKey: 'phone', header: 'Phone', sortable: true },
        { accessorKey: 'department', header: 'Department', sortable: true },
        { accessorKey: 'designation', header: 'Designation', sortable: true },
        { accessorKey: 'employee_type', header: 'Type', sortable: true },
        { accessorKey: 'employee_status', header: 'Status', sortable: true },
        { accessorKey: 'hire_date', header: 'Hire Date', sortable: true },
        {
            accessorKey: 'actions',
            header: 'Actions',
            sortable: false,
            className: 'w-[80px] text-center',
            cell: ({ row }: any) => (
                <div className="flex items-center justify-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => router.visit(route('employee.employees.show', row.id))}
                    >
                        View
                    </Button>
                    <RowActions onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row.id)} />
                </div>
            ),
        },
    ];

    const handleOpenAdd = () => {
        setForm({ ...defaultForm });
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleEdit = (row: any) => {
        setForm({
            id: row.id,
            first_name: row.first_name ?? '',
            last_name: row.last_name ?? '',
            employee_code: row.employee_code ?? '',
            email: row.email ?? '',
            phone: row.phone ?? '',
            date_of_birth: row.date_of_birth ?? '',
            gender: row.gender ?? '',
            hire_date: row.hire_date ?? '',
            employee_type: row.employee_type ?? 1,
            employee_status: row.employee_status ?? 1,
            department_id: row.department_id ? String(row.department_id) : '',
            designation_id: row.designation_id ? String(row.designation_id) : '',
            manager_id: row.manager_id ? String(row.manager_id) : '',
            address: row.address ?? '',
            city: row.city ?? '',
            country: row.country ?? '',
        });
        setIsEdit(true);
        setOpen(true);
        setFormErrors({});
    };

    const handleClose = () => {
        setOpen(false);
        setIsEdit(false);
    };

    const handleDelete = (id: number) => {
        router.delete(route('employee.employees.destroy', id), {
            onSuccess: () => tableRef.current?.refetch(),
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        axios
            .delete(route('employee.employees.bulk-delete'), { data: { ids: selectedIds } })
            .then(() => {
                toast.success(`${selectedIds.length} employee(s) deleted successfully`);
                tableRef.current?.refetch();
            })
            .catch(() => toast.error('Error deleting selected employees'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name: string, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            first_name: form.first_name,
            last_name: form.last_name,
            employee_code: form.employee_code || null,
            email: form.email || undefined,
            phone: form.phone || null,
            date_of_birth: form.date_of_birth || null,
            gender: form.gender || null,
            hire_date: form.hire_date || null,
            employee_type: form.employee_type,
            employee_status: form.employee_status,
            department_id: form.department_id || null,
            designation_id: form.designation_id || null,
            manager_id: form.manager_id || null,
            address: form.address || null,
            city: form.city || null,
            country: form.country || null,
        };

        const options = {
            onSuccess: () => {
                handleClose();
                tableRef.current?.refetch();
            },
            onError: (errors: Record<string, string>) => setFormErrors(errors),
        };

        if (isEdit && form.id) {
            router.put(route('employee.employees.update', form.id), data, options);
        } else {
            router.post(route('employee.employees.store'), data, options);
        }
    };

    return (
        <AppLayout title="Employees" breadcrumbs={breadcrumbs} actions={<Button onClick={handleOpenAdd}>Add Employee</Button>}>
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('employee.employees.index')}
                onSelectionChange={setSelectedIds}
                extraActions={<BulkDeleteButton selectedCount={selectedIds.length} onDelete={handleBulkDelete} />}
            />

            <BaseDialog
                open={open}
                onOpenChange={setOpen}
                title={isEdit ? 'Edit Employee' : 'Add Employee'}
                description={isEdit ? 'Update the employee details.' : 'Fill in the details to create a new employee.'}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel={isEdit ? 'Update' : 'Create'}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>First Name *</Label>
                        <Input name="first_name" value={form.first_name} onChange={handleChange} required />
                        {formErrors.first_name && <p className="text-sm text-red-500">{formErrors.first_name}</p>}
                    </div>
                    <div>
                        <Label>Last Name *</Label>
                        <Input name="last_name" value={form.last_name} onChange={handleChange} required />
                        {formErrors.last_name && <p className="text-sm text-red-500">{formErrors.last_name}</p>}
                    </div>
                    <div>
                        <Label>Employee Code</Label>
                        <Input name="employee_code" value={form.employee_code} onChange={handleChange} />
                        {formErrors.employee_code && <p className="text-sm text-red-500">{formErrors.employee_code}</p>}
                    </div>
                    <div>
                        <Label>Email {!isEdit && '*'}</Label>
                        <Input name="email" type="email" value={form.email} onChange={handleChange} required={!isEdit} />
                        {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                    </div>
                    <div>
                        <Label>Phone</Label>
                        <Input name="phone" value={form.phone} onChange={handleChange} />
                        {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
                    </div>
                    <div>
                        <Label>Date of Birth</Label>
                        <Input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
                        {formErrors.date_of_birth && <p className="text-sm text-red-500">{formErrors.date_of_birth}</p>}
                    </div>
                    <div>
                        <Label>Gender</Label>
                        <Select value={form.gender} onValueChange={(v) => handleSelect('gender', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {formErrors.gender && <p className="text-sm text-red-500">{formErrors.gender}</p>}
                    </div>
                    <div>
                        <Label>Hire Date</Label>
                        <Input name="hire_date" type="date" value={form.hire_date} onChange={handleChange} />
                        {formErrors.hire_date && <p className="text-sm text-red-500">{formErrors.hire_date}</p>}
                    </div>
                    <div>
                        <Label>Employee Type</Label>
                        <Select value={String(form.employee_type)} onValueChange={(v) => setForm((prev) => ({ ...prev, employee_type: Number(v) }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {employeeTypes.map((t) => (
                                    <SelectItem key={t.value} value={String(t.value)}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.employee_type && <p className="text-sm text-red-500">{formErrors.employee_type}</p>}
                    </div>
                    <div>
                        <Label>Employee Status</Label>
                        <Select
                            value={String(form.employee_status)}
                            onValueChange={(v) => setForm((prev) => ({ ...prev, employee_status: Number(v) }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {employeeStatuses.map((s) => (
                                    <SelectItem key={s.value} value={String(s.value)}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.employee_status && <p className="text-sm text-red-500">{formErrors.employee_status}</p>}
                    </div>
                    <div>
                        <Label>Department</Label>
                        <Select value={form.department_id} onValueChange={(v) => handleSelect('department_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((d) => (
                                    <SelectItem key={d.id} value={String(d.id)}>
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.department_id && <p className="text-sm text-red-500">{formErrors.department_id}</p>}
                    </div>
                    <div>
                        <Label>Designation</Label>
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
                        <Label>Manager</Label>
                        <Select value={form.manager_id} onValueChange={(v) => handleSelect('manager_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select manager" />
                            </SelectTrigger>
                            <SelectContent>
                                {managers.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.manager_id && <p className="text-sm text-red-500">{formErrors.manager_id}</p>}
                    </div>
                    <div className="col-span-2">
                        <Label>Address</Label>
                        <Input name="address" value={form.address} onChange={handleChange} />
                        {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}
                    </div>
                    <div>
                        <Label>City</Label>
                        <Input name="city" value={form.city} onChange={handleChange} />
                        {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                    </div>
                    <div>
                        <Label>Country</Label>
                        <Input name="country" value={form.country} onChange={handleChange} />
                        {formErrors.country && <p className="text-sm text-red-500">{formErrors.country}</p>}
                    </div>
                </div>
            </BaseDialog>
        </AppLayout>
    );
}
