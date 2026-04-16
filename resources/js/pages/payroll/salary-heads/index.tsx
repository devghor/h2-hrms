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

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.payrollSalaryHeads];

type EnumOption = { value: string; label: string };

interface Props {
    modes: EnumOption[];
    glPrefixTypes: EnumOption[];
    identificationTypes: EnumOption[];
    categories: EnumOption[];
    taxCalculationTypes: EnumOption[];
}

const defaultForm = {
    id: undefined as number | undefined,
    name: '',
    code: '',
    is_basic_linked: false,
    basic_ratio: '',
    mode: 'cash',
    gl_account_code: '',
    gl_prefix_type: 'dynamic',
    identification_type: 'other',
    category: 'gross',
    position: '',
    is_variable: false,
    is_taxable: false,
    tax_calculation_type: 'none',
    tax_value: '',
    is_active: true,
};

export default function Index({ modes, glPrefixTypes, identificationTypes, categories, taxCalculationTypes }: Props) {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ ...defaultForm });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true },
        { accessorKey: 'name', header: 'Name', sortable: true, searchable: true },
        { accessorKey: 'code', header: 'Code', sortable: true, searchable: true },
        {
            accessorKey: 'category',
            header: 'Category',
            sortable: true,
            searchable: true,
            filterType: 'select' as const,
            filterOptions: categories,
        },
        { accessorKey: 'identification_type', header: 'Type', sortable: true },
        { accessorKey: 'mode', header: 'Mode', sortable: true },
        { accessorKey: 'is_active', header: 'Status', sortable: true },
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
        setForm({ ...defaultForm });
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleEdit = (row: any) => {
        axios.get(route('payroll.salary-heads.show', row.id)).then(({ data }) => {
            setForm({
                id: data.id,
                name: data.name ?? '',
                code: data.code ?? '',
                is_basic_linked: !!data.is_basic_linked,
                basic_ratio: data.basic_ratio ?? '',
                mode: data.mode ?? 'cash',
                gl_account_code: data.gl_account_code ?? '',
                gl_prefix_type: data.gl_prefix_type ?? 'dynamic',
                identification_type: data.identification_type ?? 'other',
                category: data.category ?? 'gross',
                position: data.position ?? '',
                is_variable: !!data.is_variable,
                is_taxable: !!data.is_taxable,
                tax_calculation_type: data.tax_calculation_type ?? 'none',
                tax_value: data.tax_value ?? '',
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
        router.delete(route('payroll.salary-heads.destroy', id), {
            onSuccess: () => {
                toast.success('Salary head deleted successfully.');
                tableRef.current?.refetch();
            },
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        axios
            .delete(route('payroll.salary-heads.bulk-delete'), { data: { ids: selectedIds } })
            .then(() => {
                toast.success(`${selectedIds.length} salary head(s) deleted successfully`);
                tableRef.current?.refetch();
            })
            .catch(() => toast.error('Error deleting selected salary heads'));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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
            name: form.name,
            code: form.code || null,
            is_basic_linked: form.is_basic_linked,
            basic_ratio: form.basic_ratio || null,
            mode: form.mode,
            gl_account_code: form.gl_account_code || null,
            gl_prefix_type: form.gl_prefix_type,
            identification_type: form.identification_type,
            category: form.category,
            position: form.position || null,
            is_variable: form.is_variable,
            is_taxable: form.is_taxable,
            tax_calculation_type: form.tax_calculation_type,
            tax_value: form.tax_value || null,
            is_active: form.is_active,
        };

        if (isEdit && form.id) {
            router.put(route('payroll.salary-heads.update', form.id), data, {
                onSuccess: () => {
                    toast.success('Salary head updated successfully.');
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors: Record<string, string>) => setFormErrors(errors),
            });
        } else {
            router.post(route('payroll.salary-heads.store'), data, {
                onSuccess: () => {
                    toast.success('Salary head created successfully.');
                    handleClose();
                    tableRef.current?.refetch();
                },
                onError: (errors: Record<string, string>) => setFormErrors(errors),
            });
        }
    };

    return (
        <AppLayout
            title="Salary Heads"
            breadcrumbs={breadcrumbs}
            actions={<Button onClick={handleOpenAdd}>Add Salary Head</Button>}
        >
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('payroll.salary-heads.index')}
                onSelectionChange={setSelectedIds}
                extraActions={<BulkDeleteButton selectedCount={selectedIds.length} onDelete={handleBulkDelete} />}
            />

            <BaseDialog
                open={open}
                onOpenChange={setOpen}
                title={isEdit ? 'Edit Salary Head' : 'Add Salary Head'}
                description={
                    isEdit
                        ? 'Update the details of the existing salary head.'
                        : 'Fill in the details to create a new salary head.'
                }
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel={isEdit ? 'Update' : 'Create'}
                className="max-w-3xl"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Name *</Label>
                        <Input name="name" value={form.name} onChange={handleChange} required />
                        {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                    </div>

                    <div>
                        <Label>Code</Label>
                        <Input name="code" value={form.code} onChange={handleChange} />
                        {formErrors.code && <p className="text-sm text-red-500">{formErrors.code}</p>}
                    </div>

                    <div>
                        <Label>Category *</Label>
                        <Select value={form.category} onValueChange={(v) => handleSelect('category', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
                    </div>

                    <div>
                        <Label>Identification Type *</Label>
                        <Select value={form.identification_type} onValueChange={(v) => handleSelect('identification_type', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {identificationTypes.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.identification_type && (
                            <p className="text-sm text-red-500">{formErrors.identification_type}</p>
                        )}
                    </div>

                    <div>
                        <Label>Mode *</Label>
                        <Select value={form.mode} onValueChange={(v) => handleSelect('mode', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                {modes.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.mode && <p className="text-sm text-red-500">{formErrors.mode}</p>}
                    </div>

                    <div>
                        <Label>GL Prefix Type *</Label>
                        <Select value={form.gl_prefix_type} onValueChange={(v) => handleSelect('gl_prefix_type', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select GL prefix type" />
                            </SelectTrigger>
                            <SelectContent>
                                {glPrefixTypes.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.gl_prefix_type && (
                            <p className="text-sm text-red-500">{formErrors.gl_prefix_type}</p>
                        )}
                    </div>

                    <div>
                        <Label>GL Account Code</Label>
                        <Input name="gl_account_code" value={form.gl_account_code} onChange={handleChange} />
                        {formErrors.gl_account_code && (
                            <p className="text-sm text-red-500">{formErrors.gl_account_code}</p>
                        )}
                    </div>

                    <div>
                        <Label>Position</Label>
                        <Input name="position" type="number" value={form.position} onChange={handleChange} />
                        {formErrors.position && <p className="text-sm text-red-500">{formErrors.position}</p>}
                    </div>

                    <div>
                        <Label>Basic Ratio</Label>
                        <Input name="basic_ratio" type="number" step="0.0001" value={form.basic_ratio} onChange={handleChange} />
                        {formErrors.basic_ratio && <p className="text-sm text-red-500">{formErrors.basic_ratio}</p>}
                    </div>

                    <div>
                        <Label>Tax Calculation Type *</Label>
                        <Select value={form.tax_calculation_type} onValueChange={(v) => handleSelect('tax_calculation_type', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select tax type" />
                            </SelectTrigger>
                            <SelectContent>
                                {taxCalculationTypes.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.tax_calculation_type && (
                            <p className="text-sm text-red-500">{formErrors.tax_calculation_type}</p>
                        )}
                    </div>

                    <div>
                        <Label>Tax Value</Label>
                        <Input name="tax_value" type="number" step="0.0001" value={form.tax_value} onChange={handleChange} />
                        {formErrors.tax_value && <p className="text-sm text-red-500">{formErrors.tax_value}</p>}
                    </div>

                    <div className="col-span-2 grid grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_basic_linked"
                                checked={form.is_basic_linked}
                                onCheckedChange={(c) => handleCheckbox('is_basic_linked', !!c)}
                            />
                            <Label htmlFor="is_basic_linked">Basic Linked</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_variable"
                                checked={form.is_variable}
                                onCheckedChange={(c) => handleCheckbox('is_variable', !!c)}
                            />
                            <Label htmlFor="is_variable">Variable</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_taxable"
                                checked={form.is_taxable}
                                onCheckedChange={(c) => handleCheckbox('is_taxable', !!c)}
                            />
                            <Label htmlFor="is_taxable">Taxable</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                checked={form.is_active}
                                onCheckedChange={(c) => handleCheckbox('is_active', !!c)}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                    </div>
                </div>
            </BaseDialog>
        </AppLayout>
    );
}
