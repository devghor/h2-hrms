'use client';

import {
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { ExtendedColumnSort } from '@/types/data-table';

const ARRAY_SEPARATOR = ',';

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  enableAdvancedFilter?: boolean;
  page?: number;
  perPage?: number;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount,
    initialState,
    debounceMs = 1000,
    throttleMs = 50,
    clearOnDefault = false,
    enableAdvancedFilter = false,
    page = 1,
    perPage = 10,
    ...tableProps
  } = props;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getParam = (key: string, fallback: any) =>
    searchParams?.get(key) ?? fallback;

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: perPage
    }),
    [page, perPage]
  );

  const updateQueryParams = (params: Record<string, string | null>) => {
    const updated = new URLSearchParams(searchParams?.toString() ?? '');

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
    });

    router.replace(`${pathname}?${updated.toString()}`);
  };

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue;

      updateQueryParams({
        page: String(newPagination.pageIndex + 1),
        perPage: String(newPagination.pageSize)
      });
    },
    [pagination]
  );

  // Sorting
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    const sort = getParam('sort', '');
    if (!sort) return initialState?.sorting ?? [];

    return sort.split(ARRAY_SEPARATOR).map((s: any) => {
      const [id, desc] = s.split('.');
      return { id, desc: desc === 'desc' };
    });
  });

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(sorting)
          : updaterOrValue;

      setSorting(newSorting);
      updateQueryParams({
        sort: newSorting
          .map((s) => `${s.desc ? '-' + s.id : s.id}`)
          .join(ARRAY_SEPARATOR)
      });
    },
    [sorting]
  );

  // Filtering
  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return [];
    return columns.filter((c) => c.enableColumnFilter);
  }, [columns, enableAdvancedFilter]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => {
      if (enableAdvancedFilter) return [];

      return filterableColumns.reduce<ColumnFiltersState>((acc, col) => {
        const raw = getParam(col.id ?? '', null);
        if (raw) {
          const value = col.meta?.options ? raw.split(ARRAY_SEPARATOR) : raw;
          acc.push({ id: col.id!, value });
        }
        return acc;
      }, []);
    }
  );

  const debouncedSetFilterValues = useDebouncedCallback(
    (filters: ColumnFiltersState) => {
      const update: Record<string, string | null> = {};
      filters.forEach((f) => {
        const value = Array.isArray(f.value)
          ? f.value.join(ARRAY_SEPARATOR)
          : String(f.value);
        update[f.id] = value;
      });

      const currentIds = columnFilters.map((f) => f.id);
      currentIds.forEach((id) => {
        if (!filters.find((f) => f.id === id)) {
          update[id] = null;
        }
      });

      update.page = '1';

      updateQueryParams(update);
    },
    debounceMs
  );

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return;

      const next =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(columnFilters)
          : updaterOrValue;

      setColumnFilters(next);
      debouncedSetFilterValues(next);
    },
    [columnFilters]
  );

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  return { table, debounceMs, throttleMs };
}
