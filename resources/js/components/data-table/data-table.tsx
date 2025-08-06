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
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TopProgressBar } from '../progress-bar/top-progress-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface DataTableProps {
    columns: any[];
    dataUrl: string;
    extraActions?: React.ReactNode;
    tableId?: string; // optional explicit ID for localStorage keys
}

export default function DataTable({ columns, dataUrl, extraActions, tableId }: DataTableProps) {
    // Helper to encode URL safely for localStorage keys
    const encodeUrlKey = (url: string) => encodeURIComponent(url);

    // Determine unique key suffix: use tableId if provided, else fallback to encoded dataUrl
    const keySuffix = tableId ?? encodeUrlKey(dataUrl);

    // localStorage keys unique per table instance
    const ORDER_KEY = `datatable_order_${keySuffix}`;
    const SEARCH_KEY = `datatable_search_${keySuffix}`;
    const LENGTH_KEY = `datatable_length_${keySuffix}`;
    const START_KEY = `datatable_start_${keySuffix}`;
    const VISIBILITY_KEY = `datatable_visibility_${keySuffix}`;

    // Helpers to safely read/write localStorage (guard SSR)
    const safeGet = (key: string) => {
        try {
            if (typeof window === 'undefined') return null;
            const v = localStorage.getItem(key);
            return v ? JSON.parse(v) : null;
        } catch (e) {
            console.warn('localStorage read failed for', key, e);
            return null;
        }
    };

    const safeSet = (key: string, value: any) => {
        try {
            if (typeof window === 'undefined') return;
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage write failed for', key, e);
        }
    };

    // initial columnSearchInput built from columns
    const defaultColumnSearch = useMemo(
        () =>
            columns.reduce((acc: any, col: any) => {
                acc[col.accessorKey] = '';
                return acc;
            }, {}),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // Restore search state (columnSearchInput) from localStorage if present
    const [columnSearchInput, setColumnSearchInput] = useState(() => {
        const saved = safeGet(SEARCH_KEY);
        return saved ? { ...defaultColumnSearch, ...saved } : { ...defaultColumnSearch };
    });

    // debounced search (keeps behavior)
    const [debouncedColumnSearch] = useDebounce(columnSearchInput, 500);
    const [columnSearch, setColumnSearch] = useState({ ...columnSearchInput });

    // order persists
    const [order, setOrder] = useState(() => {
        const saved = safeGet(ORDER_KEY);
        return saved ?? [{ column: 0, dir: 'asc' }];
    });

    // length (per-page) persists
    const [length, setLength] = useState<number>(() => {
        const saved = safeGet(LENGTH_KEY);
        return saved ?? 10;
    });

    // start (offset) persists
    const [start, setStart] = useState<number>(() => {
        const saved = safeGet(START_KEY);
        return saved ?? 0;
    });

    // column visibility persists
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

    // Whenever columnSearchInput changes, persist immediately
    useEffect(() => {
        safeSet(SEARCH_KEY, columnSearchInput);
    }, [columnSearchInput]);

    // Persist order whenever it changes
    useEffect(() => {
        safeSet(ORDER_KEY, order);
    }, [order]);

    // Persist length whenever it changes
    useEffect(() => {
        safeSet(LENGTH_KEY, length);
    }, [length]);

    // Persist start whenever it changes
    useEffect(() => {
        safeSet(START_KEY, start);
    }, [start]);

    // Persist visibility whenever it changes
    useEffect(() => {
        safeSet(VISIBILITY_KEY, columnVisibility);
    }, [columnVisibility]);

    // Keep columnSearch in sync with debounced input (this triggers fetch)
    useEffect(() => {
        setStart(0); // reset to first page when search changes
        setColumnSearch(debouncedColumnSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedColumnSearch]);

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

    const handleSort = (columnIndex: number) => {
        setOrder((prevOrder: any) => {
            const newOrder =
                prevOrder[0]?.column === columnIndex
                    ? [{ column: columnIndex, dir: prevOrder[0].dir === 'asc' ? 'desc' : 'asc' }]
                    : [{ column: columnIndex, dir: 'asc' }];
            // saved via effect
            return newOrder;
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

        // Clear states
        setColumnSearchInput(emptySearch);
        setColumnSearch(emptySearch);
        setStart(0);
        setLength(10);
        setOrder([{ column: 0, dir: 'asc' }]);

        // Reset column visibility to defaults
        const defaultVisibility = columns.reduce((acc: any, col: any) => {
            acc[col.accessorKey] = col.visible !== false;
            return acc;
        }, {});
        setColumnVisibility(defaultVisibility);

        // Remove saved keys from localStorage
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(SEARCH_KEY);
                localStorage.removeItem(ORDER_KEY);
                localStorage.removeItem(LENGTH_KEY);
                localStorage.removeItem(START_KEY);
                localStorage.removeItem(VISIBILITY_KEY);
            }
        } catch (e) {
            console.warn('Failed to clear localStorage during reset', e);
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                    <label htmlFor="per-page" className="text-sm font-medium">
                        Show
                    </label>
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

            {/* Scrollable + Responsive Table Wrapper */}
            <div className="relative overflow-x-auto rounded-md border">
                <TopProgressBar loading={loading} />

                <div className="w-full min-w-[900px]">
                    <Table>
                        <TableHeader className="sticky top-0 z-20 bg-white">
                            {/* Column headers */}
                            <TableRow>
                                {columns.map(
                                    (col: any, index: number) =>
                                        columnVisibility[col.accessorKey] && (
                                            <TableHeadCell
                                                key={col.accessorKey}
                                                className={`sticky top-0 z-20 bg-white ${col.className || ''} ${
                                                    order[0]?.column === index ? 'font-semibold' : ''
                                                }`}
                                            >
                                                {col.sortable !== false ? (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleSort(index)}
                                                        className="flex items-center space-x-1"
                                                        aria-label={`Sort by ${col.header}`}
                                                    >
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

                            {/* Search inputs row */}
                            <TableRow className="sticky top-[40px] z-10 border-b border-border bg-muted/40">
                                {columns.map(
                                    (col: any) =>
                                        columnVisibility[col.accessorKey] && (
                                            <TableHeadCell key={`${col.accessorKey}-search`} className="p-1">
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
                            {data && data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <TableRow key={row.id || rowIndex}>
                                        {columns.map(
                                            (col: any) =>
                                                columnVisibility[col.accessorKey] && (
                                                    <TableCell className={col.className || ''} key={col.accessorKey}>
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
}
