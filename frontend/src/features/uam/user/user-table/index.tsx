'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface UserTableParam<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
  page: number;
  perPage: number;
}

export function UserTable<TData, TValue>({
  data,
  columns,
  pageCount,
  page,
  perPage
}: UserTableParam<TData, TValue>) {
  const { table } = useDataTable({
    data,
    columns,
    debounceMs: 500,
    pageCount,
    page,
    perPage
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
