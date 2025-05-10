'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Post } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Post>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID'
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title'
  },
  {
    id: 'body',
    accessorKey: 'body',
    header: 'Body'
  }
];
