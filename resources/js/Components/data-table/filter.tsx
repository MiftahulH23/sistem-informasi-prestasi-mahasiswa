
import React from "react";
import { Column } from "@tanstack/react-table";
import { addHours, addMinutes, format, getYear } from "date-fns";
import { DateRange } from "react-day-picker";

import { camelToKebab, cn } from "@/lib/utils";

import type {
  DataTableFilter,
  FilterComponent,
  FilterContext,
  FilterMap,
  FilterMapItem,
  FilterVariant,
  GroupedFilter,
  StandaloneFilter,
} from "./types";
import { customFilterFns } from "./utils";

import {
  CalendarIcon,
  CalendarRangeIcon,
  ChevronLeftIcon,
  CircleCheckIcon,
  FilterIcon,
  ListFilterIcon,
  SquareCheckIcon,
} from "lucide-react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Calendar } from "../ui/calendar";

// eslint-disable-next-line
const FilterContext = React.createContext<FilterContext<any> | null>(null);

/**
 * @function hooks for filter context
 *
 * @property
 * - `state` current active filter for grouped filter
 * - `filters` list of filter variant based on `utils.ts`
 * - `clearFilter` reset filter value column
 * - `isFilterActive` check if column is filtering
 * - `formatFilterName` format column filter name to match custom `filters`
 */
function useFilter<T>() {
  const context = React.useContext(FilterContext);

  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider.");
  }

  return context as FilterContext<T>;
}

/**
 * @function FilterContext provider
 */
function FilterProvider<T>({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<keyof T>();

  // Get all filter variant based on `utils.ts`
  const filters = React.useMemo<FilterVariant[]>(() => {
    return Object.keys(customFilterFns) as FilterVariant[];
  }, []);

  // Check if column is filtering
  const isFilterActive = React.useCallback((column: Column<T>) => {
    return column.getFilterValue() !== undefined;
  }, []);

  // Format column filter name to match custom `filters`
  const formatFilterName = React.useCallback((column: Column<T>) => {
    const filterFnName = column?.getFilterFn()?.name ?? "unknown";
    const formatName = camelToKebab(filterFnName) as FilterVariant;
    return formatName;
  }, []);

  // Reset filter value column
  const clearFilter = React.useCallback((column: Column<T>) => {
    setState(undefined);
    column.setFilterValue(undefined);
  }, []);

  const contextValue = React.useMemo<FilterContext<T>>(
    () => ({
      state,
      setState,
      filters,
      clearFilter,
      isFilterActive,
      formatFilterName,
    }),
    [state, setState, filters, clearFilter, isFilterActive, formatFilterName],
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

function CheckboxFilter<T>(props: FilterComponent<T>) {
  const { column, data, label, standalone, className, ...rest } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // check is filter active
  const isFiltering = isFilterActive(column);

  // get current filter value
  const filterValue = column.getFilterValue() as string[];

  // get unique values from exist data
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const uniqueValues = React.useMemo(() => {
    if (!facetedUniqueValues) return [];
    const values = Array.from(facetedUniqueValues.keys());
    return values.sort();
  }, [facetedUniqueValues]);

  // get current selected filter value
  const selectedValue = React.useMemo(() => {
    return filterValue ?? [];
  }, [filterValue]);

  const handleCheckboxChange = (checked: boolean, value: string) => {
    const filterValue = column.getFilterValue() as string[];
    const newFilterValue = Array.isArray(filterValue) ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      newFilterValue.splice(index, 1);
    }

    column.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  // use custom data if exist
  const mapData = data ?? uniqueValues;

  function Filter() {
    return (
      <div
        data-large={mapData.length >= 10}
        className="grid gap-2 data-[large=true]:grid-cols-2"
      >
        {mapData.map((item, key) => (
          <Label
            key={key}
            htmlFor={item}
            className="flex select-none gap-2 capitalize"
          >
            <Checkbox
              id={item}
              checked={selectedValue.includes(item)}
              onCheckedChange={(checked: boolean) => {
                handleCheckboxChange(checked, item);
              }}
            />
            <span>{item}</span>
          </Label>
        ))}
      </div>
    );
  }

  if (standalone) {
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("capitalize", className)}
            {...rest}
          >
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <FilterIcon className="text-muted-foreground" />
            </div>
            <span>{label ?? column.id}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="group !w-fit !min-w-32 !gap-2 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setOpen(false);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="mb-3 mt-2" />
          <Filter />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-fit gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState(undefined)}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">{label ?? column.id}</span>
        </Button>
        <button
          onClick={() => clearFilter(column)}
          disabled={selectedValue.length === 0}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:hover:underline not-disabled:cursor-pointer text-xs underline-offset-2"
        >
          Reset
        </button>
      </div>
      <Separator className="my-1" />
      <Filter />
    </>
  );
}

function RadioFilter<T>(props: FilterComponent<T>) {
  const { column, data, label, standalone, className, ...rest } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // check is filter active
  const isFiltering = isFilterActive(column);

  // get unique values from exist data
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const uniqueValues = React.useMemo(() => {
    if (!facetedUniqueValues) return [];
    const values = Array.from(facetedUniqueValues.keys());
    return values.sort();
  }, [facetedUniqueValues]);

  // use custom data if exist
  const mapData = data ?? uniqueValues;

  function Filter() {
    return (
      <RadioGroup
        value={column.getFilterValue() as string}
        onValueChange={(value: string) => column.setFilterValue(value)}
        data-large={mapData.length >= 10}
        className="grid gap-2.5 data-[large=true]:grid-cols-2"
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
    );
  }

  if (standalone) {
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("capitalize", className)}
            {...rest}
          >
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <FilterIcon className="text-muted-foreground" />
            </div>
            <span>{label ?? column.id}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="group !w-fit !min-w-32 !gap-2 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setOpen(false);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="mb-3 mt-2" />
          <Filter />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-fit gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState(undefined)}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">{label ?? column.id}</span>
        </Button>
        <button
          onClick={() => clearFilter(column)}
          disabled={column.getFilterValue() === undefined}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:hover:underline not-disabled:cursor-pointer text-xs underline-offset-2"
        >
          Reset
        </button>
      </div>
      <Separator className="my-1" />
      <Filter />
    </>
  );
}

function DateRangeFilter<T>(props: FilterComponent<T>) {
  const { column, label, standalone } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [date, setDate] = React.useState<DateRange | undefined>();

  // check is filter active
  const isFiltering = isFilterActive(column);

  const filterValue = column.getFilterValue() as string[];

  // get date range from filter value
  const from = filterValue?.[0] ? new Date(filterValue[0]) : undefined;
  const to = filterValue?.[1] ? new Date(filterValue[1]) : undefined;

  // get date range object
  const formatDate = {
    from: isNaN(from?.getTime() || NaN) ? undefined : from,
    to: isNaN(to?.getTime() || NaN) ? undefined : to,
  };

  function handleDateChange(selectedDate: DateRange | undefined) {
    column.setFilterValue(
      selectedDate?.from && selectedDate?.to
        ? [selectedDate.from, addMinutes(addHours(selectedDate.to, 23), 59)]
        : undefined,
    );
  }

  if (standalone) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="capitalize"
          >
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <CalendarRangeIcon className="text-muted-foreground" />
            </div>
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                (label ?? "Tanggal")
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setDate(undefined);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="mb-3 mt-2" />
          <Calendar
            mode="range"
            selected={date}
            onSelect={(e) => {
              setDate(e);
              handleDateChange(e);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-fit gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState(undefined)}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">Tanggal</span>
        </Button>
        <button
          onClick={() => clearFilter(column)}
          disabled={!from && !to}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
        >
          Reset
        </button>
      </div>
      <Separator className="my-1" />
      <Calendar
        mode="range"
        selected={date}
        onSelect={(e) => handleDateChange(e)}
        defaultMonth={formatDate.from ?? formatDate.to ?? new Date()}
      />
    </>
  );
}

function DateYearFilter<T>(props: FilterComponent<T>) {
  const { column, label, data, standalone, className, ...rest } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // check is filter active
  const isFiltering = isFilterActive(column);

  // get unique year values from exist data
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const uniqueValues = React.useMemo(() => {
    if (!facetedUniqueValues) return [];

    const years = Array.from(facetedUniqueValues.keys()).map((date) => {
      return getYear(new Date(date));
    });

    const uniqueYears = [...new Set(years)];
    return uniqueYears.sort((a, b) => b - a);
  }, [facetedUniqueValues]);

  // use custom data if exist
  const mapData = data ?? uniqueValues;

  function Filter() {
    return (
      <RadioGroup
        value={column.getFilterValue() as string}
        onValueChange={(value: string) => column.setFilterValue(value)}
        data-large={mapData.length >= 10}
        className="grid gap-2 data-[large=true]:grid-cols-2"
      >
        {mapData.map((item, key) => (
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
    );
  }

  if (standalone) {
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("capitalize", className)}
            {...rest}
          >
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <CalendarIcon className="text-muted-foreground" />
            </div>
            <span>{label ?? column.id}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="group !w-fit !min-w-32 !gap-2 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setOpen(false);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="mb-3 mt-2" />
          <Filter />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-fit gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState(undefined)}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">Tahun</span>
        </Button>
        <button
          onClick={() => clearFilter(column)}
          disabled={!isFiltering}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
        >
          Reset
        </button>
      </div>
      <Separator className="my-1" />
      <Filter />
    </>
  );
}

/**
 * Define each filter component based on filter variant
 * @returns components, icon
 */
function filterMap<T>(variant?: FilterVariant) {
  const filterComponents: FilterMap<T> = {
    checkbox: { component: CheckboxFilter, icon: SquareCheckIcon },
    radio: { component: RadioFilter, icon: CircleCheckIcon },
    "date-range": { component: DateRangeFilter, icon: CalendarRangeIcon },
    "date-year": { component: DateYearFilter, icon: CalendarIcon },
  };

  return variant ? filterComponents[variant] : filterComponents;
}

/**
 * @function Filter list for grouped filter
 * @description Manage filter state to show active filter component on popover
 */
function FilterList<T>(props: FilterComponent<T>) {
  const { column, data, label } = props;
  const { state, setState, isFilterActive, formatFilterName } = useFilter<T>();

  // get current filter value
  const filterValue = column.getFilterValue();
  const isFiltering = isFilterActive(column);

  const selectedValue = React.useMemo(() => {
    return Array.isArray(filterValue) ? filterValue : [];
  }, [filterValue]);

  const filterText: Record<FilterVariant, string> = {
    checkbox: column.id,
    radio: column.id,
    "date-range": "Tanggal",
    "date-year": "Tahun",
  };

  // get and check column filter name match {filters}
  const filterKey = formatFilterName(column);

  // define filter components and icon
  const filterComponents = filterMap<T>() as FilterMap<T>;
  const Icon = filterComponents[filterKey].icon;
  const Component = filterComponents[filterKey].component;

  // active state not match this filter
  if (state && state !== column.id) return null;

  // return active filter component
  if (state === column.id) {
    return (
      <Component
        column={column}
        data={data}
        label={label}
      />
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 justify-start !ps-2 text-sm"
      onClick={() => setState(column.id as keyof T)}
    >
      <Icon className="text-muted-foreground size-4" />
      <span className="capitalize">{label ?? filterText[filterKey]}</span>

      {isFiltering && (
        <span className="text-primary max-w-18 -me-1 ms-auto line-clamp-1 inline-flex h-5 max-h-full items-center rounded px-1 font-[inherit] text-xs capitalize dark:text-teal-600">
          {filterKey === "checkbox"
            ? `${selectedValue.length} dipilih`
            : "Dipilih"}
        </span>
      )}
    </Button>
  );
}

function FilterComponent<T>(props: DataTableFilter<T>) {
  const { table, standalone = false, className, ...rest } = props;
  const { state, setState, filters, formatFilterName, isFilterActive } =
    useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // separate props
  const { extend } = props as GroupedFilter<T>;
  const { filter: filterKey, label, data } = props as StandaloneFilter<T>;

  const detachedColumns = extend?.filter((item) => item.detached) ?? [];
  let excludeColumns = ["actions"];

  // exclude columns from detached extend data
  if (extend) {
    excludeColumns = excludeColumns.concat(
      detachedColumns.map((item) => item.id) as string[],
    );
  }

  /**
   * Get all columns
   *
   * except includes in `excludeColumns` and filter name includes in `filters`
   */
  const columns = table
    .getAllColumns()
    .filter((column) => !excludeColumns.includes(column.id))
    .filter((column) => {
      const filterKey = formatFilterName(column);
      return filters.includes(filterKey);
    });

  React.useEffect(() => {
    if (!open) setState(undefined); // back to filter list view if popover closed
  }, [open, setState]);

  // get standalone column
  const standaloneColumn = columns.find((column) => column.id === filterKey);

  if (standalone && standaloneColumn) {
    // get and check column filter name match {filters}
    const filterKey = formatFilterName(standaloneColumn);

    // get filter components
    const filterComponents = filterMap<T>(filterKey) as FilterMapItem<T>;
    const Component = filterComponents.component;

    return (
      <Component
        column={standaloneColumn!}
        data={data}
        label={label}
        className={className}
        standalone
        {...rest}
      />
    );
  }

  // check if some column is filtering
  const isFiltering = columns.some((column) => isFilterActive(column));

  // reset filter columns in used
  function resetColumnsFilter() {
    columns.forEach((column) => column.setFilterValue(undefined));
  }

  // get extend data fn
  function extendItems<T>(column: Column<T>) {
    return extend?.find((item) => item.id === column.id);
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={className}
          {...rest}
        >
          <div
            data-active={isFiltering}
            className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
          >
            <ListFilterIcon className="text-muted-foreground" />
          </div>
          <span className="@2xl:not-sr-only sr-only">Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="group flex !w-max !min-w-52 flex-col !gap-1 p-3">
        {!state && (
          <>
            <div className="flex items-center justify-between px-1">
              <div className="text-foreground/90 text-xs">Pilih Filter</div>
              <button
                onClick={resetColumnsFilter}
                disabled={!isFiltering}
                className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
              >
                Reset
              </button>
            </div>
            <Separator className="my-1" />
          </>
        )}
        {columns.map((column, i) => (
          <FilterList
            key={i}
            column={column}
            data={extendItems(column)?.data ?? undefined}
            label={extendItems(column)?.label ?? undefined}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function DataTableFilter<T>(props: DataTableFilter<T>) {
  return (
    <FilterProvider>
      <FilterComponent {...props} />
    </FilterProvider>
  );
}