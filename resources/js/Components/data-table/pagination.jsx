import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/Components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import {
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";

export function DataTablePaginations(props, pagination) {
    const { table } = props;
    const pageSizeOpt = [5, 10, 20];
    const currentPage =
        pagination?.current_page ?? table.getState().pagination.pageIndex + 1;
    const totalPages =
        pagination?.last_page ??
        Math.ceil(table.getRowCount() / table.getState().pagination.pageSize);

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
            {/* Page number information */}
            {/* <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
                <p
                    className="text-muted-foreground text-sm whitespace-nowrap"
                    aria-live="polite"
                >
                    <span className="me-1">Halaman</span>
                    <span className="text-foreground">{currentPage}</span>
                    <span className="mx-1">/</span>
                    <span className="text-foreground">{totalPages}</span>
                </p>
            </div> */}
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
