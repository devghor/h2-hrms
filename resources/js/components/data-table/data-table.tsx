import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead as TableHeadCell, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    ChevronUp,
    EyeOff,
    ListFilter,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TopProgressBarProps {
    loading: boolean;
}

export function TopProgressBar({ loading }: TopProgressBarProps) {
    const [width, setWidth] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (loading) {
            setWidth(0);
            intervalRef.current = window.setInterval(() => {
                setWidth((w) => {
                    if (w >= 70) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        return w;
                    }
                    const increment = w < 20 ? 2 : w < 50 ? 1.5 : 0.8;
                    return Math.min(w + increment, 70);
                });
            }, 180);
        } else {
            setWidth(100);
            const timeout = setTimeout(() => setWidth(0), 300);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return () => clearTimeout(timeout);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [loading]);

    return (
        <div
            className={`fixed top-0 left-0 z-50 h-0.5 bg-primary transition-all duration-300 ease-out`}
            style={{
                width: `${width}%`,
                opacity: width > 0 ? 0.8 : 0,
            }}
        />
    );
}

// Axios interceptor to handle 401 globally
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export interface ColumnDef {
    accessorKey: string;
    header?: string;
    sortable?: boolean;
    /** Mark column as searchable — also renders a filter input in the filter panel */
    searchable?: boolean;
    /** Override filter input type for this column. Defaults to 'text'. */
    filterType?: 'text' | 'date';
    visible?: boolean;
    className?: string;
    cell?: (props: { row: any }) => React.ReactNode;
}

interface DataTableProps {
    columns: ColumnDef[];
    dataUrl: string;
    extraActions?: React.ReactNode;
    tableId?: string;
}

const DataTable = forwardRef(function DataTable({ columns, dataUrl, extraActions, tableId }: DataTableProps, ref) {
    const encodeUrlKey = (url: string) => encodeURIComponent(url);
    const keySuffix = tableId ?? encodeUrlKey(dataUrl);

    const ORDER_KEY = `datatable_order_${keySuffix}`;
    const LENGTH_KEY = `datatable_length_${keySuffix}`;
    const START_KEY = `datatable_start_${keySuffix}`;
    const VISIBILITY_KEY = `datatable_visibility_${keySuffix}`;

    const safeGet = (key: string) => {
        try {
            if (typeof window === 'undefined') return null;
            const v = localStorage.getItem(key);
            return v ? JSON.parse(v) : null;
        } catch {
            return null;
        }
    };

    const safeSet = (key: string, value: any) => {
        try {
            if (typeof window === 'undefined') return;
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Ignore write errors (e.g. quota exceeded, private mode)
        }
    };

    const [order, setOrder] = useState(() => safeGet(ORDER_KEY) ?? [{ column: 0, dir: 'asc' }]);
    const [length, setLength] = useState<number>(() => safeGet(LENGTH_KEY) ?? 10);
    const [start, setStart] = useState<number>(() => safeGet(START_KEY) ?? 0);
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

    const [columnVisibility, setColumnVisibility] = useState(() => {
        const saved = safeGet(VISIBILITY_KEY);
        if (saved) return saved;
        return columns.reduce((acc: any, col: any) => {
            acc[col.accessorKey] = col.visible !== false;
            return acc;
        }, {});
    });

    const [draw, setDraw] = useState(0);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [recordsFiltered, setRecordsFiltered] = useState(0);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => safeSet(ORDER_KEY, order), [order]);
    useEffect(() => safeSet(LENGTH_KEY, length), [length]);
    useEffect(() => safeSet(START_KEY, start), [start]);
    useEffect(() => safeSet(VISIBILITY_KEY, columnVisibility), [columnVisibility]);

    const fetchData = useCallback(async (currentStart = start) => {
        setLoading(true);
        try {
            const response = await axios.get(dataUrl, {
                params: {
                    draw: draw + 1,
                    start: currentStart,
                    length,
                    order,
                    columns: columns.map((col: ColumnDef) => ({
                        data: col.accessorKey,
                        name: col.accessorKey,
                        searchable: col.searchable !== false,
                        orderable: col.sortable !== false,
                        search: { value: columnFilters[col.accessorKey] ?? '', regex: false },
                    })),
                },
            });

            const result = response.data;
            setData(result.data || []);
            setDraw(result.draw ?? draw + 1);
            setRecordsTotal(result.recordsTotal ?? 0);
            setRecordsFiltered(result.recordsFiltered ?? 0);
            setSelectedRows(new Set());
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataUrl, start, length, order, columnFilters]);

    useImperativeHandle(ref, () => ({
        refetch: () => fetchData(),
    }));

    // Debounce filter changes
    const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
        filterDebounceRef.current = setTimeout(() => {
            setStart(0);
            fetchData(0);
        }, 350);
        return () => {
            if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnFilters]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, length, order]);

    const pageCount = Math.max(1, Math.ceil((recordsFiltered || recordsTotal) / length));
    const currentPage = Math.floor(start / length) + 1;

    const goToPage = (page: number) => {
        if (page < 1 || page > pageCount) return;
        setStart((page - 1) * length);
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = data.map((row, i) => row.id ?? i);
            setSelectedRows(new Set(allIds));
        } else {
            setSelectedRows(new Set());
        }
    };

    const toggleSelectRow = (id: string | number) => {
        setSelectedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const allSelected = data.length > 0 && data.every((row, i) => selectedRows.has(row.id ?? i));
    const someSelected = selectedRows.size > 0 && !allSelected;

    const filterableColumns = columns.filter((col) => col.searchable === true);
    const activeFilterCount = Object.values(columnFilters).filter(Boolean).length;

    const clearAllFilters = () => setColumnFilters({});

    return (
        <div className="w-full space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Filter toggle button */}
                    {filterableColumns.length > 0 && (
                        <Button
                            variant={showFilters || activeFilterCount > 0 ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 gap-1.5 text-sm font-normal"
                            onClick={() => setShowFilters((v) => !v)}
                        >
                            <ListFilter className="h-3.5 w-3.5" />
                            Filter
                            {activeFilterCount > 0 && (
                                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-xs text-primary">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    )}

                    {/* Clear filters shortcut */}
                    {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm font-normal text-muted-foreground" onClick={clearAllFilters}>
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </Button>
                    )}

                    {extraActions}
                </div>

                {/* View (column visibility) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm font-normal">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {columns
                            .filter((col: any) => col.header)
                            .map((col: any) => (
                                <DropdownMenuCheckboxItem
                                    key={col.accessorKey}
                                    className="capitalize"
                                    checked={!!columnVisibility[col.accessorKey]}
                                    onCheckedChange={(value) =>
                                        setColumnVisibility((prev: any) => ({
                                            ...prev,
                                            [col.accessorKey]: !!value,
                                        }))
                                    }
                                >
                                    {col.header}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Filter panel */}
            {showFilters && filterableColumns.length > 0 && (
                <div className="flex flex-wrap gap-3 rounded-md border bg-muted/40 p-3">
                    {filterableColumns.map((col) => (
                        <div key={col.accessorKey} className="flex min-w-[160px] flex-1 flex-col gap-1">
                            <label className="text-xs font-medium text-muted-foreground">{col.header}</label>
                            <div className="relative">
                                <Input
                                    type={col.filterType === 'date' ? 'date' : 'text'}
                                    placeholder={col.filterType === 'date' ? '' : `Search ${col.header?.toLowerCase()}…`}
                                    value={columnFilters[col.accessorKey] ?? ''}
                                    onChange={(e) =>
                                        setColumnFilters((prev) => ({
                                            ...prev,
                                            [col.accessorKey]: e.target.value,
                                        }))
                                    }
                                    className="h-8 pr-7 text-sm"
                                />
                                {columnFilters[col.accessorKey] && (
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() =>
                                            setColumnFilters((prev) => {
                                                const next = { ...prev };
                                                delete next[col.accessorKey];
                                                return next;
                                            })
                                        }
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="relative overflow-x-auto rounded-md border">
                <TopProgressBar loading={loading} />
                <div className="w-full">
                    <Table>
                        <TableHeader className="sticky top-0 z-20 bg-white">
                            <TableRow>
                                {/* Select all checkbox */}
                                <TableHeadCell className="w-10">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                                        aria-label="Select all"
                                        className={someSelected ? 'data-[state=unchecked]:bg-primary/20' : ''}
                                        data-state={someSelected ? 'indeterminate' : allSelected ? 'checked' : 'unchecked'}
                                    />
                                </TableHeadCell>

                                {columns.map(
                                    (col: any, index: number) =>
                                        columnVisibility[col.accessorKey] && (
                                            <TableHeadCell
                                                key={col.accessorKey}
                                                className={`${col.className || ''} ${order[0]?.column === index ? 'font-semibold' : ''}`}
                                            >
                                                {col.sortable !== false ? (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="-ml-3 flex items-center gap-1.5 data-[state=open]:bg-accent">
                                                                <span>{col.header}</span>
                                                                {order[0]?.column === index ? (
                                                                    order[0]?.dir === 'asc' ? (
                                                                        <ChevronUp className="h-4 w-4" />
                                                                    ) : (
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    )
                                                                ) : (
                                                                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                                                )}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setOrder([{ column: index, dir: 'asc' }])
                                                                }
                                                            >
                                                                <ChevronUp className="mr-2 h-3.5 w-3.5" />
                                                                Asc
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setOrder([{ column: index, dir: 'desc' }])
                                                                }
                                                            >
                                                                <ChevronDown className="mr-2 h-3.5 w-3.5" />
                                                                Desc
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setColumnVisibility((prev: any) => ({
                                                                        ...prev,
                                                                        [col.accessorKey]: false,
                                                                    }))
                                                                }
                                                            >
                                                                <EyeOff className="mr-2 h-3.5 w-3.5" />
                                                                Hide
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : (
                                                    col.header
                                                )}
                                            </TableHeadCell>
                                        ),
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.length > 0 ? (
                                data.map((row, rowIndex) => {
                                    const rowId = row.id ?? rowIndex;
                                    const isSelected = selectedRows.has(rowId);
                                    return (
                                        <TableRow key={rowId} data-state={isSelected ? 'selected' : undefined}>
                                            <TableCell className="w-10">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleSelectRow(rowId)}
                                                    aria-label="Select row"
                                                />
                                            </TableCell>
                                            {columns.map(
                                                (col: any) =>
                                                    columnVisibility[col.accessorKey] && (
                                                        <TableCell key={col.accessorKey} className={col.className || ''}>
                                                            {col.cell ? col.cell({ row }) : row[col.accessorKey]}
                                                        </TableCell>
                                                    ),
                                            )}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {selectedRows.size} of {data.length} row(s) selected.
                </div>

                <div className="flex items-center gap-4">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rows per page</span>
                        <Select
                            value={String(length)}
                            onValueChange={(value) => {
                                setLength(Number(value));
                                setStart(0);
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px] text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 100].map((size) => (
                                    <SelectItem key={size} value={String(size)}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Page info + navigation */}
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {pageCount}
                        </span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === pageCount}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(pageCount)}
                            disabled={currentPage === pageCount}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default DataTable;
