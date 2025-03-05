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
    CalendarIcon,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getYear } from "date-fns";

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

export function DataTableFilter(props) {
    const {
        filter,
        table,
        className,
        data,
        label,
        variant = "checkbox",
    } = props;
    const filterKey = String(filter);

    const [date, setDate] = React.useState();
    const [selected, setSelected] = React.useState();
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [selectedYear, setSelectedYear] = React.useState();

    const filterColumn = table.getColumn(filterKey);
    const facetedUniqueValues = filterColumn?.getFacetedUniqueValues();
    const filterValue = filterColumn?.getFilterValue();

    const uniqueValues = React.useMemo(() => {
        if (!facetedUniqueValues) return [];
        const values = Array.from(facetedUniqueValues.keys());
        return values.sort();
    }, [facetedUniqueValues]);

    const uniqueYearValues = React.useMemo(() => {
        if (!facetedUniqueValues) return [];

        const years = Array.from(facetedUniqueValues.keys()).map((date) => {
            const year = getYear(new Date(date));
            return year;
        });

        const uniqueYears = [...new Set(years)];
        return uniqueYears.sort((a, b) => b - a);
    }, [facetedUniqueValues]);

    const selectedValue = React.useMemo(() => {
        return filterValue ?? [];
    }, [filterValue]);

    const handleCheckboxChange = (checked, value) => {
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

    function handleRadioChange(value) {
        setSelected(value);
        table.getColumn(filterKey)?.setFilterValue(value);
    }

    function handleDateChange(selectedDate) {
        setDate(selectedDate);

        table
            .getColumn(filterKey)
            ?.setFilterValue(
                selectedDate?.from && selectedDate?.to
                    ? [selectedDate.from, addHours(selectedDate.to, 23)]
                    : undefined
            );
    }

    function handleClearFilter() {
        setPopoverOpen(false);
        setSelected(undefined);
        setSelectedYear(undefined);
        table.getColumn(filterKey)?.setFilterValue(undefined);
    }

    const mapData = data ?? uniqueValues;

    if (variant === "date-range") {
        return (
            <DatePickerRange
                placeholder={label ?? "Tanggal"}
                state={[date, setDate]}
                handleSelect={(e) => handleDateChange(e)}
            />
        );
    }

    if (variant === "date-year") {
        function handleDateYearChange(value) {
            setSelectedYear(value);
            table.getColumn(filterKey)?.setFilterValue(value);
        }

        return (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn("gap-1 capitalize", className)}
                    >
                        <CalendarIcon
                            className="-ms-1 me-1 opacity-50"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                        {label ?? filterKey}
                        {selectedYear && (
                            <span className="bg-primary/80 -me-1 ms-1 size-2 rounded-full" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    data-density={mapData.length > 5 && "large"}
                    data-is-medium={mapData.length > 5 && mapData.length <= 10}
                    data-is-large={mapData.length > 10}
                    className="group !w-fit !min-w-28 !gap-2 p-4"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground mb-2 text-xs font-medium">
                            Filter
                        </span>
                        {selectedYear && (
                            <button
                                onClick={handleClearFilter}
                                className="text-foreground mb-2 cursor-pointer text-xs font-medium hover:underline hover:underline-offset-2"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <RadioGroup
                        value={selectedYear}
                        onValueChange={(value) => handleDateYearChange(value)}
                        className="group-has-data-[density=large]:grid-flow-row-dense group-has-data-[is-large=true]:grid-cols-3 group-has-data-[is-medium=true]:grid-cols-2 grid gap-2.5"
                    >
                        {uniqueYearValues.map((item, key) => (
                            <Label
                                key={key}
                                htmlFor={key.toString()}
                                className="flex select-none gap-2 capitalize"
                            >
                                <RadioGroupItem
                                    value={item.toString()}
                                    id={key.toString()}
                                />
                                <span>{item}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                    {variant === "radio" && selected && (
                        <span className="bg-primary/80 -me-1 ms-1 size-2 rounded-full" />
                    )}
                    {variant === "checkbox" && selectedValue.length > 0 && (
                        <span className="border-border bg-primary/80 text-primary-foreground -me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                            {selectedValue.length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                data-density={mapData.length > 5 && "large"}
                data-is-medium={mapData.length > 5 && mapData.length <= 10}
                data-is-large={mapData.length > 10}
                className="group !w-fit !min-w-max !gap-2 p-4"
            >
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground mb-2 text-xs font-medium">
                        Filter
                    </span>
                    {(selected || selectedValue.length > 0) && (
                        <button
                            onClick={handleClearFilter}
                            className="text-foreground mb-2 cursor-pointer text-xs font-medium hover:underline hover:underline-offset-2"
                        >
                            Clear
                        </button>
                    )}
                </div>
                {variant === "checkbox" && (
                    <div className="group-has-data-[density=large]:grid-flow-row-dense group-has-data-[is-large=true]:grid-cols-3 group-has-data-[is-medium=true]:grid-cols-2 grid gap-3">
                        {mapData.map((item, key) => (
                            <Label
                                key={key}
                                htmlFor={item}
                                className="flex select-none gap-2 capitalize"
                            >
                                <Checkbox
                                    id={item}
                                    checked={selectedValue.includes(item)}
                                    onCheckedChange={(checked) => {
                                        handleCheckboxChange(checked, item);
                                    }}
                                />
                                <span>{item}</span>
                            </Label>
                        ))}
                    </div>
                )}
                {variant === "radio" && (
                    <RadioGroup
                        value={selected}
                        onValueChange={handleRadioChange}
                        className="group-has-data-[density=large]:grid-flow-row-dense group-has-data-[is-large=true]:grid-cols-3 group-has-data-[is-medium=true]:grid-cols-2 grid gap-2.5"
                    >
                        {mapData.map((item, key) => (
                            <Label
                                key={key}
                                htmlFor={key.toString()}
                                className="flex select-none gap-2 capitalize"
                            >
                                <RadioGroupItem
                                    value={item}
                                    id={key.toString()}
                                />
                                <span>{item}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                )}
            </PopoverContent>
        </Popover>
    );
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
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-[#4F94C8]"
                            >
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
