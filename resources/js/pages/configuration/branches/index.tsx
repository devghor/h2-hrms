import DataTable from '@/components/data-table/data-table';
import { RowActions } from '@/components/data-table/row-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BulkDeleteButton from '@/components/bulk-delete-button';
import { BaseDialog } from '@/components/dialog/base-dialog';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.configurationBranches];

const emptyForm = {
    id: undefined as number | undefined,
    company_id: '',
    name: '',
    short_name: '',
    code: '',
    address: '',
    phone: '',
    mobile: '',
    email: '',
};

export default function Index({ companies }: { companies: { id: number; name: string }[] }) {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true, searchable: true },
        { accessorKey: 'company', header: 'Company', sortable: true, searchable: true },
        { accessorKey: 'name', header: 'Name', sortable: true, searchable: true },
        { accessorKey: 'short_name', header: 'Short Name', sortable: true, searchable: true },
        { accessorKey: 'code', header: 'Code', sortable: true, searchable: true },
        { accessorKey: 'email', header: 'Email', sortable: true, searchable: true },
        { accessorKey: 'phone', header: 'Phone', sortable: true, searchable: true },
        { accessorKey: 'mobile', header: 'Mobile', sortable: true, searchable: true },
        { accessorKey: 'created_at', header: 'Created At', sortable: true },
        {
            accessorKey: 'actions',
            header: 'Actions',
            sortable: false,
            className: 'w-[60px] text-center',
            cell: ({ row }: any) => (
                <RowActions onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row.id)} />
            ),
        },
    ];

    const handleOpenAdd = () => {
        setForm({ ...emptyForm });
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleEdit = (row: any) => {
        setForm({
            id: row.id,
            company_id: row.company_id ? row.company_id.toString() : '',
            name: row.name,
            short_name: row.short_name ?? '',
            code: row.code ?? '',
            address: row.address ?? '',
            phone: row.phone ?? '',
            mobile: row.mobile ?? '',
            email: row.email ?? '',
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
        router.delete(route('configuration.branches.destroy', id), {
            onSuccess: () => tableRef.current?.refetch(),
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        axios
            .delete(route('configuration.branches.bulk-delete'), { data: { ids: selectedIds } })
            .then(() => {
                toast.success(`${selectedIds.length} branch(es) deleted successfully`);
                tableRef.current?.refetch();
            })
            .catch(() => {
                toast.error('Error deleting selected branches');
            });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: Record<string, any> = {
            company_id: form.company_id,
            name: form.name,
            short_name: form.short_name,
            code: form.code,
            address: form.address,
            phone: form.phone,
            mobile: form.mobile,
            email: form.email,
        };
        if (isEdit && form.id) {
            router.put(route('configuration.branches.update', form.id), data, {
                onSuccess: () => {
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors) => setFormErrors(errors),
            });
        } else {
            router.post(route('configuration.branches.store'), data, {
                onSuccess: () => {
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors) => setFormErrors(errors),
            });
        }
    };

    return (
        <AppLayout title="Branches" breadcrumbs={breadcrumbs} actions={<Button onClick={handleOpenAdd}>Add Branch</Button>}>
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('configuration.branches.index')}
                onSelectionChange={setSelectedIds}
                extraActions={<BulkDeleteButton selectedCount={selectedIds.length} onDelete={handleBulkDelete} />}
            />
            <BaseDialog
                open={open}
                onOpenChange={setOpen}
                title={isEdit ? 'Edit Branch' : 'Add Branch'}
                description={isEdit ? 'Update the details of the existing branch.' : 'Fill in the details to create a new branch.'}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel={isEdit ? 'Update' : 'Create'}
            >
                <div>
                    <Label htmlFor="company_id">Company</Label>
                    <Select
                        value={form.company_id ? form.company_id.toString() : ''}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, company_id: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                            {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id.toString()}>
                                    {company.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formErrors.company_id && <p className="text-sm text-red-500">{formErrors.company_id}</p>}
                </div>
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                </div>
                <div>
                    <Label htmlFor="short_name">Short Name</Label>
                    <Input name="short_name" value={form.short_name} onChange={handleChange} />
                    {formErrors.short_name && <p className="text-sm text-red-500">{formErrors.short_name}</p>}
                </div>
                <div>
                    <Label htmlFor="code">Code</Label>
                    <Input name="code" value={form.code} onChange={handleChange} />
                    {formErrors.code && <p className="text-sm text-red-500">{formErrors.code}</p>}
                </div>
                <div>
                    <Label htmlFor="address">Address</Label>
                    <Input name="address" value={form.address} onChange={handleChange} />
                    {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input name="phone" value={form.phone} onChange={handleChange} />
                    {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
                </div>
                <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input name="mobile" value={form.mobile} onChange={handleChange} />
                    {formErrors.mobile && <p className="text-sm text-red-500">{formErrors.mobile}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} />
                    {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                </div>
            </BaseDialog>
        </AppLayout>
    );
}
