import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';
import { toast } from 'sonner';

interface RawPermission {
    id: number;
    display_name: string; // "Read", "Create", etc.
    group: string; // "General > Dashboard"
    module: string; // "General"
}

interface Permission {
    id: number;
    name: string;
    module: string;
    feature: string;
    action: string;
    display_name?: string;
}

interface Role {
    id: number;
    name: string;
    description?: string;
    permissions: number[];
}

interface PermissionGroup {
    [module: string]: {
        [feature: string]: Permission[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.uamRoles, { title: 'Edit Role', href: '' }];

function transformPermissions(rawPermissions: RawPermission[]): Permission[] {
    return rawPermissions.map((perm) => {
        const [module, feature] = perm.group.split(' > ');
        return {
            id: perm.id,
            name: `${perm.display_name}${module}${feature}`,
            module,
            feature,
            action: perm.display_name,
            display_name: perm.display_name,
        };
    });
}

export default function EditRole({ role, allPermissions: rawPermissions }: { role: Role; allPermissions: RawPermission[] }) {
    const allPermissions: Permission[] = transformPermissions(rawPermissions);

    const [form, setForm] = useState({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions || [],
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handlePermissionChange = (permissionId: number) => {
        setForm((prev) => {
            const permissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter((id) => id !== permissionId)
                : [...prev.permissions, permissionId];
            return { ...prev, permissions };
        });
    };

    const handleSelectAllFeature = (featurePermissions: any[]) => {
        const ids = featurePermissions.map((p) => p.id);
        const allSelected = ids.every((id) => form.permissions.includes(id));
        setForm((prev) => ({
            ...prev,
            permissions: allSelected ? prev.permissions.filter((id) => !ids.includes(id)) : [...new Set([...prev.permissions, ...ids])],
        }));
    };

    const handleSelectAllModule = (modulePermissions: any[]) => {
        const ids = modulePermissions.map((p) => p.id);
        const allSelected = ids.every((id) => form.permissions.includes(id));
        setForm((prev) => ({
            ...prev,
            permissions: allSelected ? prev.permissions.filter((id) => !ids.includes(id)) : [...new Set([...prev.permissions, ...ids])],
        }));
    };

    const handleSelectAllPermissions = () => {
        const allIds = allPermissions.map((p) => p.id);
        const allSelected = allIds.every((id) => form.permissions.includes(id));
        setForm((prev) => ({
            ...prev,
            permissions: allSelected ? [] : allIds,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('uam.roles.update', role.id), form, {
            onSuccess: () => toast.success('Role updated successfully'),
            onError: (errors) => setFormErrors(errors),
        });
    };

    const permissionsByModuleAndFeature = allPermissions.reduce<PermissionGroup>((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = {};
        if (!acc[perm.module][perm.feature]) acc[perm.module][perm.feature] = [];
        acc[perm.module][perm.feature].push(perm);
        return acc;
    }, {});

    // Filter based on search term
    const filteredPermissionsByModuleAndFeature = Object.fromEntries(
        Object.entries(permissionsByModuleAndFeature)
            .map(([module, features]) => [
                module,
                Object.fromEntries(
                    Object.entries(features)
                        .map(([feature, perms]) => [
                            feature,
                            perms.filter(
                                (p) =>
                                    p.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.feature.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.module.toLowerCase().includes(searchTerm.toLowerCase()),
                            ),
                        ])
                        .filter(([_, perms]) => perms.length > 0),
                ),
            ])
            .filter(([_, features]) => Object.keys(features).length > 0),
    );

    const isFeatureFullySelected = (featurePermissions: any[]) => featurePermissions.every((perm) => form.permissions.includes(perm.id));
    const isFeaturePartiallySelected = (featurePermissions: any[]) =>
        featurePermissions.some((perm) => form.permissions.includes(perm.id)) && !isFeatureFullySelected(featurePermissions);
    const isModuleFullySelected = (modulePermissions: any[]) => modulePermissions.every((perm) => form.permissions.includes(perm.id));

    const crudActions = ['Create', 'Read', 'Update', 'Delete'];

    const countCrudPermissions = (permissions: any[], selectedIds: any[]) => {
        const counts: Record<string, boolean> = { Create: false, Read: false, Update: false, Delete: false };
        permissions.forEach((perm) => {
            if (crudActions.includes(perm.action)) {
                counts[perm.action] = selectedIds.includes(perm.id);
            }
        });
        return counts;
    };

    return (
        <AppLayout title="Edit Role" breadcrumbs={breadcrumbs}>
            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Top Sticky Buttons */}
                <div className="sticky top-0 z-20 flex flex-wrap justify-end gap-4 border-b bg-white py-4 shadow-sm">
                    <Button type="button" variant="outline" onClick={() => router.visit(route('uam.roles.index'))}>
                        Cancel
                    </Button>

                    <Button type="button" variant="secondary" onClick={handleSelectAllPermissions}>
                        {allPermissions.every((p) => form.permissions.includes(p.id)) ? 'Deselect All' : 'Select All'}
                    </Button>

                    <Button type="submit" className="min-w-[140px]">
                        Update Role
                    </Button>
                </div>

                {/* Role Info */}
                <Card className="rounded-lg border shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Role Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Role Name <span className="text-red-500">*</span>
                            </Label>
                            <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter role name" />
                            {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter role description"
                            />
                            {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Search Input */}
                <div className="space-y-6">
                    <Label className="text-lg font-semibold">Permissions</Label>
                    <p className="text-sm text-muted-foreground">Select the permissions this role should have access to.</p>

                    <div className="mb-4 flex justify-center">
                        <Input
                            placeholder="Search permissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-1/3"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Object.entries(filteredPermissionsByModuleAndFeature).map(([module, features]: any) => {
                            const allModulePermissions = Object.values(features).flat();
                            const moduleFullySelected = isModuleFullySelected(allModulePermissions);

                            return (
                                <Card key={module} className="rounded-lg border-l-4 border-primary shadow-md transition-all hover:shadow-lg">
                                    <CardHeader className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={moduleFullySelected}
                                                onCheckedChange={() => handleSelectAllModule(allModulePermissions)}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                            <CardTitle className="text-lg font-bold">{module}</CardTitle>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {form.permissions.filter((id) => allModulePermissions.map((p: any) => p.id).includes(id)).length} /{' '}
                                            {allModulePermissions.length} perms
                                        </span>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        {Object.entries(features).map(([feature, permissions]: any) => {
                                            const featureFullySelected = isFeatureFullySelected(permissions);
                                            const featurePartiallySelected = isFeaturePartiallySelected(permissions);
                                            const crudCounts = countCrudPermissions(permissions, form.permissions);

                                            return (
                                                <details
                                                    key={feature}
                                                    className="group rounded-md border border-gray-200 transition hover:border-primary"
                                                >
                                                    <summary className="flex cursor-pointer items-center justify-between p-3">
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                checked={featureFullySelected}
                                                                ref={(el: any) => {
                                                                    if (el) el.indeterminate = featurePartiallySelected;
                                                                }}
                                                                onCheckedChange={() => handleSelectAllFeature(permissions)}
                                                            />
                                                            <span className="font-medium">{feature}</span>
                                                        </div>

                                                        {/* CRUD Count */}
                                                        <span className="text-sm text-muted-foreground">
                                                            {crudActions.map((a) => (
                                                                <span key={a} className="mx-1">
                                                                    {a[0]}: {crudCounts[a] ? '✓' : '✗'}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    </summary>

                                                    <div className="mt-2 flex flex-wrap gap-2 p-3">
                                                        {permissions.map((perm: any) => (
                                                            <Tooltip.Provider key={perm.id}>
                                                                <Tooltip.Root>
                                                                    <Tooltip.Trigger asChild>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handlePermissionChange(perm.id)}
                                                                            className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
                                                                                form.permissions.includes(perm.id)
                                                                                    ? 'bg-primary text-white shadow'
                                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                            }`}
                                                                        >
                                                                            {perm.action.slice(0, 1).toUpperCase()}
                                                                        </button>
                                                                    </Tooltip.Trigger>
                                                                    <Tooltip.Portal>
                                                                        <Tooltip.Content
                                                                            side="top"
                                                                            className="rounded-md bg-black px-2 py-1 text-xs text-white shadow-lg"
                                                                        >
                                                                            {perm.action}
                                                                            <Tooltip.Arrow className="fill-black" />
                                                                        </Tooltip.Content>
                                                                    </Tooltip.Portal>
                                                                </Tooltip.Root>
                                                            </Tooltip.Provider>
                                                        ))}
                                                    </div>
                                                </details>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
