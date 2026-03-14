import DataTable from '@/components/data-table/data-table';
import { RowActions } from '@/components/data-table/row-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BulkDeleteButton from '@/components/bulk-delete-button';
import { BaseDialog } from '@/components/dialog/base-dialog';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.configurationCompanies];

export default function Index() {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ id: undefined, name: '', short_name: '', company_logo: null as File | null });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true, searchable: true },
        { accessorKey: 'name', header: 'Name', sortable: true, searchable: true },
        { accessorKey: 'short_name', header: 'Short Name', sortable: true, searchable: true },
        {
            accessorKey: 'company_logo',
            header: 'Logo',
            cell: ({ row }: any) => (row.company_logo ? <img src={row.company_logo} alt="Logo" className="h-8" /> : null),
        },
        { accessorKey: 'created_at', header: 'Created At', sortable: true, searchable: true, filterType: 'date' as const },
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
        setForm({ id: undefined, name: '', short_name: '', company_logo: null });
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleEdit = (row: any) => {
        setForm({ id: row.id, name: row.name, short_name: row.short_name, company_logo: null });
        setIsEdit(true);
        setOpen(true);
        setFormErrors({});
    };

    const handleClose = () => {
        setOpen(false);
        setIsEdit(false);
    };

    const handleDelete = (id: number) => {
        router.delete(route('configuration.companies.destroy', id), {
            onSuccess: () => tableRef.current?.refetch(),
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        axios.delete(route('configuration.companies.bulk-delete'), { data: { ids: selectedIds } }).then(() => {
            toast.success(`${selectedIds.length} company/companies deleted successfully`);
            tableRef.current?.refetch();
        }).catch(() => {
            toast.error('Error deleting selected companies');
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', form.name);
        data.append('short_name', form.short_name);
        if (form.company_logo) data.append('company_logo', form.company_logo);
        if (isEdit && form.id) {
            data.append('_method', 'PUT');
            router.post(route('configuration.companies.update', form.id), data, {
                forceFormData: true,
                onSuccess: () => {
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                },
            });
        } else {
            router.post(route('configuration.companies.store'), data, {
                forceFormData: true,
                onSuccess: () => {
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                },
            });
        }
    };

    return (
        <AppLayout title="Companies" breadcrumbs={breadcrumbs} actions={<Button onClick={handleOpenAdd}>Add Company</Button>}>
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('configuration.companies.index')}
                onSelectionChange={setSelectedIds}
                extraActions={
                    <BulkDeleteButton selectedCount={selectedIds.length} onDelete={handleBulkDelete} />
                }
            />
            <BaseDialog
                open={open}
                onOpenChange={setOpen}
                title={isEdit ? 'Edit Company' : 'Add Company'}
                description={isEdit ? 'Update the details of the existing company.' : 'Fill in the details to create a new company.'}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel={isEdit ? 'Update' : 'Create'}
            >
                <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                </div>
                <div>
                    <Label htmlFor="short_name">Short Name</Label>
                    <Input name="short_name" value={form.short_name} onChange={handleChange} required />
                    {formErrors.short_name && <p className="text-sm text-red-500">{formErrors.short_name}</p>}
                </div>
                <div>
                    <Label htmlFor="company_logo">Logo</Label>
                    <Input name="company_logo" type="file" accept="image/*" onChange={handleChange} />
                    {formErrors.company_logo && <p className="text-sm text-red-500">{formErrors.company_logo}</p>}
                </div>
            </BaseDialog>
        </AppLayout>
    );
}
