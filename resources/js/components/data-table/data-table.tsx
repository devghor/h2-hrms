import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead as TableHeadCell, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TopProgressBar } from '../progress-bar/top-progress-bar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function DataTable({ columns, dataUrl, extraActions }: any) {
    const [columnSearchInput, setColumnSearchInput] = useState(
        columns.reduce((acc: any, col: any) => {
            acc[col.accessorKey] = '';
            return acc;
        }, {}),
    );
    const [debouncedColumnSearch] = useDebounce(columnSearchInput, 500);
    const [columnSearch, setColumnSearch] = useState({ ...columnSearchInput });

    const [draw, setDraw] = useState(0);
    const [start, setStart] = useState(0);
    const [length, setLength] = useState(10);
    const [order, setOrder] = useState([{ column: 0, dir: 'asc' }]);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [recordsFiltered, setRecordsFiltered] = useState(0);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);

    const [columnVisibility, setColumnVisibility] = useState(
        columns.reduce((acc: any, col: any) => {
            acc[col.accessorKey] = col.visible !== false;
            return acc;
        }, {}),
    );

    useEffect(() => {
        setStart(0);
        setColumnSearch(debouncedColumnSearch);
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
            setData(result.data);
            setDraw(result.draw);
            setRecordsTotal(result.recordsTotal);
            setRecordsFiltered(result.recordsFiltered);
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
        setOrder((prevOrder) => {
            const newDir = prevOrder[0]?.column === columnIndex && prevOrder[0]?.dir === 'asc' ? 'desc' : 'asc';
            return [{ column: columnIndex, dir: newDir }];
        });
    };

    const pageCount = Math.ceil(recordsFiltered / length) || 1;
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
    };

    return (
        <div className="w-full space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                    <label htmlFor="per-page" className="text-sm font-medium">
                        Show
                    </label>
                    <select
                        id="per-page"
                        className="rounded border p-1 text-sm"
                        value={length}
                        onChange={(e) => {
                            setLength(Number(e.target.value));
                            setStart(0);
                        }}
                    >
                        {[10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
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
                                                    checked={columnVisibility[col.accessorKey]}
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
                        <TableHeader>
                            <TableRow>
                                {columns.map(
                                    (col: any, index: number) =>
                                        columnVisibility[col.accessorKey] && (
                                            <TableHeadCell key={col.accessorKey} className={`sticky top-0 z-10 bg-white ${col.className || ''}`}>
                                                {col.sortable !== false ? (
                                                    <Button variant="ghost" onClick={() => handleSort(index)} className="flex items-center space-x-1">
                                                        <span>{col.header}</span>
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    col.header
                                                )}
                                            </TableHeadCell>
                                        ),
                                )}
                            </TableRow>
                            <TableRow>
                                {columns.map(
                                    (col: any) =>
                                        columnVisibility[col.accessorKey] && (
                                            <TableHeadCell key={`${col.accessorKey}-search`} className="bg-white">
                                                {col.searchComponent ? (
                                                    col.searchComponent({
                                                        value: columnSearchInput[col.accessorKey] || '',
                                                        onChange: (val: string) => handleColumnSearchChange(col.accessorKey, val),
                                                    })
                                                ) : col.searchFieldType === 'text' ? (
                                                    <Input
                                                        type="text"
                                                        placeholder={`Search ${col.header}`}
                                                        value={columnSearchInput[col.accessorKey] || ''}
                                                        onChange={(e) => handleColumnSearchChange(col.accessorKey, e.target.value)}
                                                        className="w-full"
                                                    />
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
                    Showing {Math.min(start + 1, recordsFiltered)} to {Math.min(start + length, recordsFiltered)} of {recordsFiltered} entries
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
