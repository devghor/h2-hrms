import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';

interface RoleTableParam<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
}

export default function RoleTable<TData, TValue>({
  data,
  columns,
  pageCount
}: RoleTableParam<TData, TValue>) {
  const { table } = useDataTable({
    data,
    columns,
    debounceMs: 500,
    pageCount
  });
  return <DataTable table={table} />;
}
