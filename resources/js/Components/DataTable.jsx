"use client";

import * as React from "react";

import {
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
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
    XIcon,
} from "lucide-react";

export function DataTablePaginations({ table }) {
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
                                className="text-icon-accent hover:text-sidebar-icon-accent cursor-pointer disabled:pointer-events-none disabled:opacity-50"
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
                                className="text-icon-accent hover:text-sidebar-icon-accent cursor-pointer disabled:pointer-events-none disabled:opacity-50"
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
                                className="text-icon-accent hover:text-sidebar-icon-accent cursor-pointer disabled:pointer-events-none disabled:opacity-50"
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
                                className="text-icon-accent hover:text-sidebar-icon-accent cursor-pointer disabled:pointer-events-none disabled:opacity-50"
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

export function DataTableControls({
    table,
    search = true,
    className,
    children,
}) {
    const inputRef = React.useRef(null);

    const isInputEmpty = inputRef.current
        ? inputRef.current.value.trim() === ""
        : true;

    function resetSearch() {
        table.resetGlobalFilter();

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className={cn("flex gap-3", className)}>
            {search && (
                <div className="relative">
                    <Input
                        ref={inputRef}
                        type="search"
                        placeholder="Cari data"
                        className="pe-6 ps-8 selection:bg-blue-600 [&::-webkit-search-cancel-button]:appearance-none"
                        onChange={(e) =>
                            table.setGlobalFilter(String(e.target.value))
                        }
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-2 flex items-center">
                        <SearchIcon className="size-4" />
                    </div>
                    {!isInputEmpty && (
                        <button
                            type="button"
                            onClick={resetSearch}
                            className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 flex cursor-pointer items-center px-2"
                        >
                            <XIcon className="size-4" />
                        </button>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

export function DataTableFilter({ filter, table, className, data, label }) {
    const filterKey = filter;

    const uniqueStatusValues = React.useMemo(() => {
        const statusColumn = table.getColumn(filterKey);
        if (!statusColumn) return [];

        const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
        return values.sort();
    }, [table.getColumn(filterKey)?.getFacetedUniqueValues()]);

    const selectedStatuses = React.useMemo(() => {
        const filterValue = table.getColumn(filterKey)?.getFilterValue();
        return filterValue ?? [];
    }, [table.getColumn(filterKey)?.getFilterValue()]);

    const handleStatusChange = (checked, value) => {
        const filterValue = table.getColumn(filterKey)?.getFilterValue();
        const newFilterValue = filterValue ? [...filterValue] : [];

        if (checked) {
            newFilterValue.push(value);
        } else {
            const index = newFilterValue.indexOf(value);
            newFilterValue.splice(index, 1);
        }

        table
            .getColumn(filterKey)
            ?.setFilterValue(
                newFilterValue.length ? newFilterValue : undefined
            );
    };
    const result = data ?? uniqueStatusValues;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("gap-1 capitalize", className)}
                >
                    <FilterIcon
                        className="-ms-1 me-1 opacity-50"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                    />

                    {label ?? filterKey}
                    {selectedStatuses.length > 0 && (
                        <span className="border-border text-black -me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                            {selectedStatuses.length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="!w-fit !min-w-max space-y-3 p-4"
            >
                <div className="text-muted-foreground text-xs font-medium">
                    Filter
                </div>
                <div
                    data-density={uniqueStatusValues.length > 5 && "large"}
                    data-is-medium={
                        uniqueStatusValues.length > 5 &&
                        uniqueStatusValues.length <= 10
                    }
                    data-is-large={uniqueStatusValues.length > 10}
                    className="grid gap-3 data-[density=large]:grid-flow-row-dense data-[is-large=true]:grid-cols-3 data-[is-medium=true]:grid-cols-2"
                >
                    {result.map((item, key) => (
                        <Label
                            key={key}
                            htmlFor={item}
                            className="flex select-none gap-2 capitalize"
                        >
                            <Checkbox
                                id={item}
                                checked={selectedStatuses.includes(item)}
                                onCheckedChange={(checked) => {
                                    handleStatusChange(checked, item);
                                }}
                            />
                            <span>{item}</span>
                        </Label>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function customDataFilter() {
    function filterFn(row, columnId, filterValue) {
        if (!filterValue?.length) return true;
        const column = row.getValue(columnId);
        return filterValue.includes(column);
    }

    return filterFn;
}

export function DataTable({
    columns,
    data,
    controls = {
        pagination: true,
        sorting: true,
    },
    children,
}) {
    const [globalFilter, setGlobalFilter] = React.useState();
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
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

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const storedData = localStorage.getItem("pageSize");
            if (storedData) {
                setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(storedData),
                }));
            }
        }
    }, []);

    return (
        <div className="space-y-3">
            {typeof children === "function" ? children({ table }) : children}
            <div className="dark:bg-card overflow-hidden rounded-md border bg-zinc-50">
                <Table className="w-full">
                    <TableHeader className="bg-[#4F94C8]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-[#4F94C8]">
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
            {controls.pagination && <DataTablePaginations table={table} />}
        </div>
    );
}
