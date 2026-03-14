import DataTable from '@/components/data-table/data-table';
import { RowActions } from '@/components/data-table/row-actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import axios from 'axios';
import { Loader2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.configurationCompanies];

export default function Index() {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ id: undefined, name: '', short_name: '', company_logo: null as File | null });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const data = new FormData();
        data.append('name', form.name);
        data.append('short_name', form.short_name);
        if (form.company_logo) data.append('company_logo', form.company_logo);
        const onFinish = () => setLoading(false);
        if (isEdit && form.id) {
            data.append('_method', 'PUT');
            router.post(route('configuration.companies.update', form.id), data, {
                forceFormData: true,
                onSuccess: () => {
                    setOpen(false);
                    tableRef.current?.refetch();
                    onFinish();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    onFinish();
                },
            });
        } else {
            router.post(route('configuration.companies.store'), data, {
                forceFormData: true,
                onSuccess: () => {
                    setOpen(false);
                    tableRef.current?.refetch();
                    onFinish();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    onFinish();
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
                    selectedIds.length > 0 && (
                        <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-sm font-normal" onClick={handleBulkDelete}>
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Selected ({selectedIds.length})
                        </Button>
                    )
                }
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{isEdit ? 'Edit Company' : 'Add Company'}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {isEdit ? 'Update the details of the existing company.' : 'Fill in the details to create a new company.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="mt-2 space-y-4">
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
                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEdit ? 'Update' : 'Create'} Company
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
