'use client';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '../type';

export const columns: ColumnDef<User>[] = [
    {
        id: 'id',
        accessorKey: 'id',
        header: 'ID'
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: 'Name'
    },
    {
        id: 'email',
        accessorKey: 'email',
        header: 'Email'
    }
];
