export const path = {
    dashboard: {
        title: 'Dashboard',
        href: '/dashboard',
    },
    uam: {
        users: {
            title: 'Users',
            href: '/uam/users',
        },
        roles: {
            title: 'Roles',
            href: '/uam/roles',
        },
        permissions: {
            title: 'Permissions',
            href: '/uam/permissions',
        },
        roleEdit: (id: string) => ({
            title: 'Edit Role',
            href: `/uam/roles/${id}/edit`,
        }),
    },
    configuration: {
        companies: {
            title: 'Companies',
            href: '/configuration/companies',
        },
        divisions: {
            title: 'Divisions',
            href: '/configuration/divisions',
        },
        departments: {
            title: 'Departments',
            href: '/configuration/departments',
        },
        desks: {
            title: 'Desks',
            href: '/configuration/desks',
        },
    },
};
