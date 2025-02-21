"use client";

import { useEffect, useState, useMemo } from "react";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Label } from "./ui/label";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

import {
    ChevronDownIcon,
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    FilterIcon,
    SearchIcon,
} from "lucide-react";

export function PaginationControls({ table }) {
    const pageSizeOpt = [5, 10, 20];

    return (
        <div className="flex items-center justify-between gap-8">
            {/* Results per page */}
            <div className="flex items-center gap-3">
                <Select
                    value={table.getState().pagination.pageSize.toString()}
                    onValueChange={(value) => {
                        localStorage.setItem("pageSize", value);
                        table.setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="w-fit whitespace-nowrap">
                        <SelectValue placeholder="Select number of results" />
                    </SelectTrigger>
                    <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                        {pageSizeOpt.map((pageSize) => (
                            <SelectItem
                                key={pageSize}
                                value={pageSize.toString()}
                            >
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Label className="max-sm:sr-only">Baris per halaman</Label>
            </div>
            {/* Page number information */}
            <div className="text-muted-foreground flex grow justify-end whitespace-nowrap text-sm">
                <p
                    className="text-muted-foreground whitespace-nowrap text-sm"
                    aria-live="polite"
                >
                    <span className="text-foreground">
                        {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1}
                        {" - "}
                        {Math.min(
                            Math.max(
                                table.getState().pagination.pageIndex *
                                    table.getState().pagination.pageSize +
                                    table.getState().pagination.pageSize,
                                0
                            ),
                            table.getRowCount()
                        )}
                    </span>{" "}
                    dari{" "}
                    <span className="text-foreground">
                        {table.getRowCount().toString()}
                    </span>
                </p>
            </div>

            {/* Pagination buttons */}
            <div>
                <Pagination>
                    <PaginationContent>
                        {/* First page button */}
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label="Go to first page"
                            >
                                <ChevronFirstIcon
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </Button>
                        </PaginationItem>
                        {/* Previous page button */}
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label="Go to previous page"
                            >
                                <ChevronLeftIcon
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </Button>
                        </PaginationItem>
                        {/* Next page button */}
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label="Go to next page"
                            >
                                <ChevronRightIcon
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </Button>
                        </PaginationItem>
                        {/* Last page button */}
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label="Go to last page"
                            >
                                <ChevronLastIcon
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

export function Controls({ table, search = true, filtering, children }) {
    return (
        <div className="flex gap-3">
            {search && (
                <div className="relative">
                    <Input
                        type="search"
                        placeholder="Cari data"
                        className="ps-8 selection:bg-blue-600 [&::-webkit-search-cancel-button]:appearance-none"
                        onChange={(e) =>
                            table.setGlobalFilter(String(e.target.value))
                        }
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-2 flex items-center">
                        <SearchIcon className="size-4" />
                    </div>
                </div>
            )}
            {filtering?.map((item, key) => (
                <Filter
                    key={key}
                    title={item.title}
                    data={item.data}
                    table={table}
                />
            ))}
            {children}
        </div>
    );
}

export function Filter({ title, data, table }) {
    const selectedStatuses = useMemo(() => {
        const filterValue = table.getColumn(title)?.getFilterValue();
        return filterValue ?? [];
    }, [table.getColumn(title)?.getFilterValue()]);

    const handleStatusChange = (checked, value) => {
        const filterValue = table.getColumn(title)?.getFilterValue();
        const newFilterValue = filterValue ? [...filterValue] : [];

        if (checked) {
            newFilterValue.push(value);
        } else {
            const index = newFilterValue.indexOf(value);
            newFilterValue.splice(index, 1);
        }

        table
            .getColumn(title)
            ?.setFilterValue(
                newFilterValue.length ? newFilterValue : undefined
            );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="capitalize">
                    <FilterIcon
                        className="-ms-1 me-2 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    {title}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-36 p-3" align="start">
                <div className="space-y-3">
                    <div className="text-muted-foreground text-xs font-medium">
                        Filter
                    </div>
                    <div className="space-y-3">
                        {data.map((item, key) => (
                            <div key={key} className="flex gap-2">
                                <Checkbox
                                    id={item}
                                    checked={selectedStatuses.includes(item)}
                                    onCheckedChange={(checked) => {
                                        handleStatusChange(checked, item);
                                    }}
                                />
                                <Label
                                    htmlFor={item}
                                    className="capitalize select-none"
                                >
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export const customFilterFn = (row, columnId, filterValue) => {
    if (!filterValue?.length) return true;
    const column = row.getValue(columnId);
    return filterValue.includes(column);
};

export function DataTable({
    columns,
    data,
    controls = {
        pagination: true,
        sorting: true,
    },
    filtering,
    state,
}) {
    const [globalFilter, setGlobalFilter] = useState();
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        state: {
            pagination,
            sorting,
            columnFilters,
            globalFilter,
        },
    });

    useEffect(() => {
        const storedData = localStorage.getItem("pageSize");
        if (storedData) {
            setPagination((prev) => ({
                ...prev,
                pageSize: Number(storedData),
            }));
        }
    }, []);

    return (
        <div className="space-y-3">
            <Controls table={table} filtering={filtering} />
            <div className="rounded-md border overflow-y-hidden overflow-x-auto w-full">
                <Table className="w-full">
                    <TableHeader className="bg-[#4F94C8]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-center [&:has(>#nomor)]:w-12 font-bold min-w-20 text-white"
                                        >
                                            {header.isPlaceholder ? null : header.column.getCanSort() &&
                                              controls.sorting ? (
                                                <div
                                                    className={cn(
                                                        header.column.getCanSort() &&
                                                            "flex h-full cursor-pointer select-none items-center gap-2 justify-center"
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    onKeyDown={(e) => {
                                                        // Enhanced keyboard handling for sorting
                                                        if (
                                                            header.column.getCanSort() &&
                                                            (e.key ===
                                                                "Enter" ||
                                                                e.key === " ")
                                                        ) {
                                                            e.preventDefault();
                                                            header.column.getToggleSortingHandler()?.(
                                                                e
                                                            );
                                                        }
                                                    }}
                                                    tabIndex={
                                                        header.column.getCanSort()
                                                            ? 0
                                                            : undefined
                                                    }
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: (
                                                            <ChevronUpIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                        desc: (
                                                            <ChevronDownIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                    }[
                                                        header.column.getIsSorted()
                                                    ] ?? null}
                                                </div>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="bg-white">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="odd:bg-[#F8FAFC] even:bg-[#E3F2FD]"
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="text-center text-[#374151]"
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
                                    className="h-24 text-center"
                                >
                                    Tidak ada data yang sesuai.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {controls.pagination && <PaginationControls table={table} />}
        </div>
    );
}
