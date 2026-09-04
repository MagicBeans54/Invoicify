import React, { useEffect, useRef, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { KbdKey } from '@/components/ui/kbd-key';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

/**
 * Generic data table built on TanStack Table, rendered with the project's
 * shadcn table primitives. Supports column sorting, a global text filter,
 * and client-side pagination.
 */
export default function DataTable({ columns, data, searchPlaceholder = 'Search…', isLoading = false }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const searchRef = useRef(null);

    // ⌘K / Ctrl+K focuses the table search from anywhere on the page.
    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();

    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="relative w-full max-w-xs">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        ref={searchRef}
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="pl-8 pr-16"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                        <KbdKey keyName="meta" listen={false} size="sm">
                            ⌘
                        </KbdKey>
                        <KbdKey keyName="k" listen={false} size="sm">
                            K
                        </KbdKey>
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} row
                    {table.getFilteredRowModel().rows.length === 1 ? '' : 's'}
                </p>
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={
                                            header.column.columnDef.meta?.align === 'right'
                                                ? 'text-right'
                                                : undefined
                                        }
                                    >
                                        {header.isPlaceholder ? null : (
                                            <button
                                                type="button"
                                                onClick={header.column.getToggleSortingHandler()}
                                                disabled={!header.column.getCanSort()}
                                                className={
                                                    header.column.getCanSort()
                                                        ? 'inline-flex items-center gap-1 hover:text-foreground'
                                                        : 'cursor-default'
                                                }
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() &&
                                                    (header.column.getIsSorted() === 'asc' ? (
                                                        <ArrowUp className="h-3.5 w-3.5" />
                                                    ) : header.column.getIsSorted() === 'desc' ? (
                                                        <ArrowDown className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                                                    ))}
                                            </button>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                                        <Spinner size="small" />
                                        Loading…
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={
                                                cell.column.columnDef.meta?.align === 'right'
                                                    ? 'text-right'
                                                    : undefined
                                            }
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pageCount > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Page {pageIndex + 1} of {pageCount}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}