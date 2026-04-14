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

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.configurationDesignations];

export default function Index() {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ id: undefined, name: '', code: '', description: '', position: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true, searchable: true },
        { accessorKey: 'name', header: 'Name', sortable: true, searchable: true },
        { accessorKey: 'code', header: 'Code', sortable: true, searchable: true },
        { accessorKey: 'description', header: 'Description', sortable: true, searchable: true },
        { accessorKey: 'position', header: 'Position', sortable: true },
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
        setForm({ id: undefined, name: '', code: '', description: '', position: '' });
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleEdit = (row: any) => {
        setForm({ id: row.id, name: row.name, code: row.code ?? '', description: row.description ?? '', position: row.position ?? '' });
        setIsEdit(true);
        setOpen(true);
        setFormErrors({});
    };

    const handleClose = () => {
        setOpen(false);
        setIsEdit(false);
    };

    const handleDelete = (id: number) => {
        router.delete(route('configuration.designations.destroy', id), {
            onSuccess: () => tableRef.current?.refetch(),
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        axios.delete(route('configuration.designations.bulk-delete'), { data: { ids: selectedIds } }).then(() => {
            toast.success(`${selectedIds.length} designation(s) deleted successfully`);
            tableRef.current?.refetch();
        }).catch(() => {
            toast.error('Error deleting selected designations');
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: Record<string, any> = {
            name: form.name,
            code: form.code,
            description: form.description,
            position: form.position === '' ? null : form.position,
        };
        if (isEdit && form.id) {
            router.put(route('configuration.designations.update', form.id), data, {
                onSuccess: () => {
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                },
            });
        } else {
            router.post(route('configuration.designations.store'), data, {
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
        <AppLayout title="Designations" breadcrumbs={breadcrumbs} actions={<Button onClick={handleOpenAdd}>Add Designation</Button>}>
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('configuration.designations.index')}
                onSelectionChange={setSelectedIds}
                extraActions={
                    <BulkDeleteButton selectedCount={selectedIds.length} onDelete={handleBulkDelete} />
                }
            />
            <BaseDialog
                open={open}
                onOpenChange={setOpen}
                title={isEdit ? 'Edit Designation' : 'Add Designation'}
                description={isEdit ? 'Update the details of the existing designation.' : 'Fill in the details to create a new designation.'}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel={isEdit ? 'Update' : 'Create'}
            >
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                </div>
                <div>
                    <Label htmlFor="code">Code</Label>
                    <Input name="code" value={form.code} onChange={handleChange} />
                    {formErrors.code && <p className="text-sm text-red-500">{formErrors.code}</p>}
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input name="description" value={form.description} onChange={handleChange} />
                    {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
                </div>
                <div>
                    <Label htmlFor="position">Position</Label>
                    <Input name="position" type="number" value={form.position} onChange={handleChange} />
                    {formErrors.position && <p className="text-sm text-red-500">{formErrors.position}</p>}
                </div>
            </BaseDialog>
        </AppLayout>
    );
}
