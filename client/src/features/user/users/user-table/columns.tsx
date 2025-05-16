'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { User } from '.';

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
