// DataTable.tsx
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead as TableHeadCell, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RotateCcw,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { TopProgressBar } from '../progress-bar/top-progress-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// Axios interceptor to handle 401 globally
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            window.location.href = '/login'; // Redirect to login
        }
        return Promise.reject(error);
    },
);

interface DataTableProps {
    columns: any[];
    dataUrl: string;
    extraActions?: React.ReactNode;
    tableId?: string; // optional explicit ID for localStorage keys
}

const DataTable = forwardRef(function DataTable({ columns, dataUrl, extraActions, tableId }: DataTableProps, ref) {
    const encodeUrlKey = (url: string) => encodeURIComponent(url);
    const keySuffix = tableId ?? encodeUrlKey(dataUrl);

    const ORDER_KEY = `datatable_order_${keySuffix}`;
    const SEARCH_KEY = `datatable_search_${keySuffix}`;
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
        } catch {}
    };

    const defaultColumnSearch = useMemo(
        () =>
            columns.reduce((acc: any, col: any) => {
                acc[col.accessorKey] = '';
                return acc;
            }, {}),
        [columns],
    );

    const [columnSearchInput, setColumnSearchInput] = useState(() => {
        const saved = safeGet(SEARCH_KEY);
        return saved ? { ...defaultColumnSearch, ...saved } : { ...defaultColumnSearch };
    });

    const [columnSearch, setColumnSearch] = useState({ ...columnSearchInput });
    const [order, setOrder] = useState(() => safeGet(ORDER_KEY) ?? [{ column: 0, dir: 'asc' }]);
    const [length, setLength] = useState<number>(() => safeGet(LENGTH_KEY) ?? 10);
    const [start, setStart] = useState<number>(() => safeGet(START_KEY) ?? 0);

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

    useEffect(() => safeSet(SEARCH_KEY, columnSearchInput), [columnSearchInput]);
    useEffect(() => safeSet(ORDER_KEY, order), [order]);
    useEffect(() => safeSet(LENGTH_KEY, length), [length]);
    useEffect(() => safeSet(START_KEY, start), [start]);
    useEffect(() => safeSet(VISIBILITY_KEY, columnVisibility), [columnVisibility]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(dataUrl, {
                params: {
                    draw: draw + 1,
                    start,
                    length,
                    order,
                    columns: columns.map((col: any) => ({
                        data: col.accessorKey,
                        name: col.accessorKey,
                        searchable: col.searchable !== false,
                        orderable: col.sortable !== false,
                        search: {
                            value: columnSearch[col.accessorKey] || '',
                            regex: false,
                        },
                    })),
                },
            });

            const result = response.data;
            setData(result.data || []);
            setDraw(result.draw ?? draw + 1);
            setRecordsTotal(result.recordsTotal ?? 0);
            setRecordsFiltered(result.recordsFiltered ?? 0);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Expose fetchData via ref
    useImperativeHandle(ref, () => ({
        refetch: () => fetchData(),
    }));

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, length, order, columnSearch]);

    const handleColumnSearchChange = (accessorKey: string, value: string) => {
        setColumnSearchInput((prev: any) => ({
            ...prev,
            [accessorKey]: value,
        }));
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Enter') return;
            const active = document.activeElement as HTMLElement | null;
            if (!active) return;
            if (!active.closest || !active.closest('[data-search-input]')) return;

            e.preventDefault();
            setStart(0);
            setColumnSearch({ ...columnSearchInput });
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [columnSearchInput]);

    const handleSort = (columnIndex: number) => {
        setOrder((prevOrder: any) => {
            const isSameCol = prevOrder[0]?.column === columnIndex;
            return [
                {
                    column: columnIndex,
                    dir: isSameCol && prevOrder[0]?.dir === 'asc' ? 'desc' : 'asc',
                },
            ];
        });
    };

    const pageCount = Math.max(1, Math.ceil((recordsFiltered || recordsTotal) / length));
    const currentPage = Math.floor(start / length) + 1;

    const goToPage = (page: number) => {
        if (page < 1 || page > pageCount) return;
        setStart((page - 1) * length);
    };

    const handleReset = () => {
        const emptySearch = columns.reduce((acc: any, col: any) => {
            acc[col.accessorKey] = '';
            return acc;
        }, {});
        setColumnSearchInput(emptySearch);
        setColumnSearch(emptySearch);
        setStart(0);
        setLength(10);
        setOrder([{ column: 0, dir: 'asc' }]);
        const defaultVisibility = columns.reduce((acc: any, col: any) => {
            acc[col.accessorKey] = col.visible !== false;
            return acc;
        }, {});
        setColumnVisibility(defaultVisibility);
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(SEARCH_KEY);
                localStorage.removeItem(ORDER_KEY);
                localStorage.removeItem(LENGTH_KEY);
                localStorage.removeItem(START_KEY);
                localStorage.removeItem(VISIBILITY_KEY);
            }
        } catch {}
    };

    return (
        <div className="w-full space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Show</label>
                    <Select
                        value={String(length)}
                        onValueChange={(value) => {
                            setLength(Number(value));
                            setStart(0);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[80px] rounded border text-sm">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 25, 50, 100].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm font-medium">entries</span>
                </div>

                <TooltipProvider>
                    <div className="flex items-center justify-end space-x-2">
                        {/* Toggle Columns */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="cursor-pointer">
                                            <SlidersHorizontal className="h-4 w-4" />
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
                            </TooltipTrigger>
                            <TooltipContent>Toggle Columns</TooltipContent>
                        </Tooltip>

                        {/* Reset Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={handleReset} className="cursor-pointer">
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset Table</TooltipContent>
                        </Tooltip>

                        {extraActions}
                    </div>
                </TooltipProvider>
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto rounded-md border">
                <TopProgressBar loading={loading} />
                <div className="w-full">
                    <Table>
                        <TableHeader className="sticky top-0 z-20 bg-white">
                            <TableRow>
                                {columns.map(
                                    (col: any, index: number) =>
                                        columnVisibility[col.accessorKey] && (
                                            <TableHeadCell
                                                key={col.accessorKey}
                                                className={`${col.className || ''} ${order[0]?.column === index ? 'font-semibold' : ''}`}
                                            >
                                                {col.sortable !== false ? (
                                                    <Button variant="ghost" onClick={() => handleSort(index)} className="flex items-center space-x-1">
                                                        <span>{col.header}</span>
                                                        {order[0]?.column === index ? (
                                                            order[0]?.dir === 'asc' ? (
                                                                <ArrowUp className="ml-2 h-4 w-4" />
                                                            ) : (
                                                                <ArrowDown className="ml-2 h-4 w-4" />
                                                            )
                                                        ) : (
                                                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                        )}
                                                    </Button>
                                                ) : (
                                                    col.header
                                                )}
                                            </TableHeadCell>
                                        ),
                                )}
                            </TableRow>

                            {/* Search Row */}
                            <TableRow className="sticky top-[40px] z-10 border-b border-border bg-muted/40">
                                {columns.map(
                                    (col: any) =>
                                        columnVisibility[col.accessorKey] && (
                                            <TableHeadCell key={`${col.accessorKey}-search`} className="p-1" data-search-input>
                                                {col.searchComponent ? (
                                                    col.searchComponent({
                                                        value: columnSearchInput[col.accessorKey] || '',
                                                        onChange: (val: string) => handleColumnSearchChange(col.accessorKey, val),
                                                    })
                                                ) : col.searchFieldType === 'text' ? (
                                                    <div className="relative">
                                                        <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            type="text"
                                                            placeholder="Search..."
                                                            value={columnSearchInput[col.accessorKey] || ''}
                                                            onChange={(e) => handleColumnSearchChange(col.accessorKey, e.target.value)}
                                                            className="h-8 pl-7 text-sm"
                                                        />
                                                    </div>
                                                ) : null}
                                            </TableHeadCell>
                                        ),
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <TableRow key={row.id || rowIndex}>
                                        {columns.map(
                                            (col: any) =>
                                                columnVisibility[col.accessorKey] && (
                                                    <TableCell key={col.accessorKey} className={col.className || ''}>
                                                        {col.cell ? col.cell({ row }) : row[col.accessorKey]}
                                                    </TableCell>
                                                ),
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2">
                <div className="text-sm text-muted-foreground">
                    Showing {recordsFiltered ? Math.min(start + 1, recordsFiltered) : 0} to{' '}
                    {recordsFiltered ? Math.min(start + length, recordsFiltered) : 0} of {recordsFiltered || recordsTotal} entries
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {pageCount}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => goToPage(pageCount)} disabled={currentPage === pageCount}>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default DataTable;
