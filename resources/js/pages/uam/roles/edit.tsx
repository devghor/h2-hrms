import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RawPermission {
    id: number;
    display_name: string;
    group: string;
    module: string;
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

// Standard actions rendered first in this order; any extras appear after, sorted A-Z
const PRIORITY_ORDER = ['Create', 'Read', 'Update', 'Delete'];

// Color map — CRUD has specific colors; any unknown action falls back to violet
const ACTION_COLORS: Record<string, { active: string; inactive: string; header: string }> = {
    Create: {
        active:   'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
        inactive: 'bg-white text-gray-300 border-gray-200 hover:border-blue-300 hover:text-blue-500',
        header:   'text-blue-600',
    },
    Read: {
        active:   'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700',
        inactive: 'bg-white text-gray-300 border-gray-200 hover:border-emerald-300 hover:text-emerald-500',
        header:   'text-emerald-600',
    },
    Update: {
        active:   'bg-amber-500 text-white border-amber-500 hover:bg-amber-600',
        inactive: 'bg-white text-gray-300 border-gray-200 hover:border-amber-300 hover:text-amber-500',
        header:   'text-amber-500',
    },
    Delete: {
        active:   'bg-red-600 text-white border-red-600 hover:bg-red-700',
        inactive: 'bg-white text-gray-300 border-gray-200 hover:border-red-300 hover:text-red-500',
        header:   'text-red-600',
    },
    // Fallback for any custom action (Export, Approve, Publish, SuperAdmin, etc.)
    _custom: {
        active:   'bg-violet-600 text-white border-violet-600 hover:bg-violet-700',
        inactive: 'bg-white text-gray-300 border-gray-200 hover:border-violet-300 hover:text-violet-500',
        header:   'text-violet-600',
    },
};

function getActionColor(action: string) {
    return ACTION_COLORS[action] ?? ACTION_COLORS._custom;
}

/** Returns actions sorted: CRUD priority order first, then remaining A-Z */
function sortActions(actions: string[]): string[] {
    const priority = PRIORITY_ORDER.filter((a) => actions.includes(a));
    const extras = actions.filter((a) => !PRIORITY_ORDER.includes(a)).sort();
    return [...priority, ...extras];
}

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

    const handleSelectAllFeature = (featurePermissions: Permission[]) => {
        const ids = featurePermissions.map((p) => p.id);
        const allSelected = ids.every((id) => form.permissions.includes(id));
        setForm((prev) => ({
            ...prev,
            permissions: allSelected ? prev.permissions.filter((id) => !ids.includes(id)) : [...new Set([...prev.permissions, ...ids])],
        }));
    };

    const handleSelectAllModule = (modulePermissions: Permission[]) => {
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
        setForm((prev) => ({ ...prev, permissions: allSelected ? [] : allIds }));
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
                        .filter(([_, perms]) => (perms as Permission[]).length > 0),
                ),
            ])
            .filter(([_, features]) => Object.keys(features as object).length > 0),
    );

    const isFeatureFullySelected = (perms: Permission[]) => perms.every((p) => form.permissions.includes(p.id));
    const isFeaturePartiallySelected = (perms: Permission[]) =>
        perms.some((p) => form.permissions.includes(p.id)) && !isFeatureFullySelected(perms);
    const isModuleFullySelected = (perms: Permission[]) => perms.every((p) => form.permissions.includes(p.id));
    const isModulePartiallySelected = (perms: Permission[]) =>
        perms.some((p) => form.permissions.includes(p.id)) && !isModuleFullySelected(perms);

    // All unique action types present in the full dataset (for the legend)
    const globalActions = sortActions([...new Set(allPermissions.map((p) => p.action))]);

    const selectedCount = form.permissions.length;
    const totalCount = allPermissions.length;
    const allSelected = selectedCount === totalCount;

    return (
        <AppLayout title="Edit Role" breadcrumbs={breadcrumbs}>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── Sticky Toolbar ── */}
                <div className="sticky top-0 z-20 -mx-4 border-b bg-background/95 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-foreground">Edit Role</span>
                            <Separator orientation="vertical" className="h-4" />
                            <Badge variant={selectedCount > 0 ? 'default' : 'secondary'} className="font-mono text-xs tabular-nums">
                                {selectedCount} / {totalCount} permissions granted
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => router.visit(route('uam.roles.index'))}>
                                Cancel
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={handleSelectAllPermissions}>
                                {allSelected ? 'Revoke All' : 'Grant All'}
                            </Button>
                            <Button type="submit" size="sm" className="min-w-[120px]">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Role Information ── */}
                <Card>
                    <div className="flex items-center gap-3 border-b px-5 py-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold leading-none text-foreground">Role Information</p>
                            <p className="mt-1 text-xs text-muted-foreground">Define the role name and its purpose</p>
                        </div>
                    </div>
                    <CardContent className="grid grid-cols-1 gap-5 pt-5 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Role Name <span className="text-destructive">*</span>
                            </Label>
                            <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. HR Manager" />
                            {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Briefly describe this role's purpose"
                            />
                            {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Permissions ── */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-foreground">Access Permissions</h3>
                            <p className="text-sm text-muted-foreground">
                                Configure what actions this role can perform across each module.
                            </p>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search modules or features..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Dynamic legend — reflects whatever action types exist in this dataset */}
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-2.5 text-xs">
                        <span className="font-medium text-muted-foreground">Available actions:</span>
                        {globalActions.map((action) => {
                            const colors = getActionColor(action);
                            return (
                                <span key={action} className={`rounded border px-2 py-0.5 font-medium ${colors.active}`}>
                                    {action}
                                </span>
                            );
                        })}
                        <span className="ml-1 text-muted-foreground">
                            — click to toggle · row checkbox = all actions · module checkbox = entire module
                        </span>
                    </div>

                    {/* Module Cards */}
                    <div className="space-y-4">
                        {Object.entries(filteredPermissionsByModuleAndFeature).map(([module, features]: any) => {
                            const allModulePermissions: Permission[] = Object.values(features).flat() as Permission[];

                            // Compute actions present in THIS module — may differ between modules
                            const moduleActionSet = new Set<string>(allModulePermissions.map((p) => p.action));
                            const moduleActions = sortActions([...moduleActionSet]);
                            const hasCustomActions = moduleActions.some((a) => !PRIORITY_ORDER.includes(a));

                            const moduleFullySelected = isModuleFullySelected(allModulePermissions);
                            const modulePartiallySelected = isModulePartiallySelected(allModulePermissions);
                            const moduleSelectedCount = form.permissions.filter((id) =>
                                allModulePermissions.map((p) => p.id).includes(id),
                            ).length;

                            // Dynamic grid: sticky feature column (200px) + 88px per action
                            const gridTemplate = `200px repeat(${moduleActions.length}, 88px)`;

                            return (
                                <Card key={module} className="overflow-hidden">
                                    {/* Module Header */}
                                    <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={moduleFullySelected}
                                                ref={(el: any) => {
                                                    if (el) el.indeterminate = modulePartiallySelected;
                                                }}
                                                onCheckedChange={() => handleSelectAllModule(allModulePermissions)}
                                            />
                                            <span className="text-sm font-semibold text-foreground">{module}</span>
                                            {hasCustomActions && (
                                                <Badge variant="outline" className="text-xs text-violet-600 border-violet-300">
                                                    Custom actions
                                                </Badge>
                                            )}
                                        </div>
                                        <Badge
                                            variant={moduleSelectedCount > 0 ? 'default' : 'secondary'}
                                            className="font-mono text-xs tabular-nums"
                                        >
                                            {moduleSelectedCount} / {allModulePermissions.length}
                                        </Badge>
                                    </div>

                                    {/* Scrollable table area */}
                                    <div className="overflow-x-auto">
                                        {/* Column Headers */}
                                        <div
                                            className="grid items-center border-b bg-muted/20 px-4 py-2 text-xs font-medium text-muted-foreground"
                                            style={{ gridTemplateColumns: gridTemplate }}
                                        >
                                            <span>Feature</span>
                                            {moduleActions.map((action) => {
                                                const colors = getActionColor(action);
                                                return (
                                                    <span key={action} className={`text-center font-semibold ${colors.header}`}>
                                                        {action}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        {/* Feature Rows */}
                                        <CardContent className="p-0">
                                            {Object.entries(features).map(([feature, permissions]: any, idx: number, arr: any[]) => {
                                                const featureFullySelected = isFeatureFullySelected(permissions);
                                                const featurePartiallySelected = isFeaturePartiallySelected(permissions);
                                                const permByAction: Record<string, Permission> = {};
                                                (permissions as Permission[]).forEach((p) => {
                                                    permByAction[p.action] = p;
                                                });

                                                return (
                                                    <div
                                                        key={feature}
                                                        className={`grid items-center px-4 py-2.5 transition-colors hover:bg-muted/25 ${
                                                            idx < arr.length - 1 ? 'border-b border-border/60' : ''
                                                        }`}
                                                        style={{ gridTemplateColumns: gridTemplate }}
                                                    >
                                                        {/* Feature name + row checkbox */}
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <Checkbox
                                                                checked={featureFullySelected}
                                                                ref={(el: any) => {
                                                                    if (el) el.indeterminate = featurePartiallySelected;
                                                                }}
                                                                onCheckedChange={() => handleSelectAllFeature(permissions)}
                                                            />
                                                            <span className="truncate text-sm font-medium text-foreground" title={feature}>
                                                                {feature}
                                                            </span>
                                                        </div>

                                                        {/* One cell per action — dash if this feature doesn't have that action */}
                                                        {moduleActions.map((action) => {
                                                            const perm = permByAction[action];
                                                            const colors = getActionColor(action);
                                                            const isActive = perm && form.permissions.includes(perm.id);

                                                            return (
                                                                <div key={action} className="flex justify-center">
                                                                    {perm ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handlePermissionChange(perm.id)}
                                                                            className={`rounded border px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
                                                                                isActive ? colors.active : colors.inactive
                                                                            }`}
                                                                        >
                                                                            {action}
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-xs text-muted-foreground/25">—</span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </CardContent>
                                    </div>
                                </Card>
                            );
                        })}

                        {Object.keys(filteredPermissionsByModuleAndFeature).length === 0 && (
                            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12 text-center text-muted-foreground">
                                <Search className="h-8 w-8 opacity-30" />
                                <p className="text-sm font-medium">No permissions match your search</p>
                                <p className="text-xs">Try a different module or feature name</p>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
