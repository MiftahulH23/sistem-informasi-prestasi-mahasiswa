"use client"

import { useEffect, useState } from "react"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { Label } from "./ui/label"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react"

export function PaginationControls({
  table,
}) {
  const pageSizeOpt = [5, 10, 20]

  return (
    <div className="flex items-center justify-between gap-8">
      {/* Results per page */}
      <div className="flex items-center gap-3">
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            localStorage.setItem("pageSize", value)
            table.setPageSize(Number(value))
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
                0,
              ),
              table.getRowCount(),
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
  )
}

export function FilterControls({ table }) {
  
  const statusOpt = ["processing", "pending", "failed"]
  const [status, setStatus] = useState(
    Object.fromEntries(statusOpt.map((key) => [key, false])),
  )

  return (
    <div className="flex gap-3">
      <div className="relative">
        <Input
          type="search"
          placeholder="Cari data"
          className="ps-8 selection:bg-blue-600 [&::-webkit-search-cancel-button]:appearance-none"
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        />
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-2 flex items-center">
          <SearchIcon className="size-4" />
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <FilterIcon className="text-muted-foreground" />
            <span>Status</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="space-y-2 p-3"
        >
          {statusOpt.map((opt, key) => {
            const currenFilterValue = table
              .getColumn("status")  
              ?.getFilterValue()

            const isChecked = Array.isArray(currenFilterValue)
              ? currenFilterValue.includes(opt)
              : false

            return (
              <div
                key={key}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={opt}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    setStatus((prev) => ({ ...prev, [opt]: checked }))
                    table
                      .getColumn("status")
                      ?.setFilterValue(
                        Object.fromEntries(
                          Object.entries(status).filter(([_, value]) => value),
                        ),
                      )
                  }}
                />
                <Label
                  htmlFor={opt}
                  className="select-none capitalize"
                >
                  {opt}
                </Label>
              </div>
            )
          })}
        </PopoverContent>
      </Popover>
    </div>
  )
}


export function DataTable({
  columns,
  data,
  controls = {
    pagination: true,
    sorting: true,
    filter: true,
  },
  state,
}) {
  const [globalFilter, setGlobalFilter] = useState()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = state?.sorting ?? useState()
  const [columnFilters, setColumnFilters] =
    state?.filter ?? useState()

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
  })

  useEffect(() => {
    const storedData = localStorage.getItem("pageSize")
    if (storedData) {
      setPagination((prev) => ({ ...prev, pageSize: Number(storedData) }))
    }
  }, [])

  return (
    <div className="space-y-3">
      {controls.filter && <FilterControls table={table} />}
      <div className="rounded-md border overflow-hidden">
        <Table className="table-fixed">
          <TableHeader className="bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center [&:has(>#nomor)]:w-12 font-bold tex"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() &&
                        controls.sorting ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center gap-2 justify-center",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                          }[header.column.getIsSorted() ] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                className="odd:bg-gray-50"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
  )
}