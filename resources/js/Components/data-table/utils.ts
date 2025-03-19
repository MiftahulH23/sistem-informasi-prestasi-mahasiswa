/**
 * @file Define custom filter functions for data table.
 *
 * @description
 * filterFn naming must be consistent with the filter variant.
 * do not use prefix or suffix for filterFn name.
 *
 * filterFn name use `camelCase`.
 * variant name use `kebab-case`.
 *
 * @example
 * filterFn: dateYear
 * variant: "date-year"
 *
 * define variant name as key in `customFilterFns` with it's filterFn.
 * export only `customFilterFns`.
 *
 * @author hibatillah
 */
import { Row } from "@tanstack/react-table";
import { isSameYear, isWithinInterval } from "date-fns";

/**
 * @function store all custom filter functions.
 *
 * @description
 * - key: FilterVariant
 * - value: FilterFn
 */
export const customFilterFns = {
  checkbox,
  radio,
  "date-range": dateRange,
  "date-year": dateYear,
};

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function checkbox<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue?.length) return true;
  const column = row.getValue(columnId) as string;
  return filterValue.includes(column);
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function radio<T>(row: Row<T>, columnId: string, filterValue: string): boolean {
  if (!filterValue) return true;
  const column = String(row.getValue(columnId));
  return String(filterValue) === column;
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function dateRange<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue || filterValue.length !== 2) return true;

  const rowDate = new Date(row.getValue(columnId) as string);
  const from = new Date(filterValue[0]);
  const to = new Date(filterValue[1]);

  return isWithinInterval(rowDate, { start: from, end: to });
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function dateYear<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string | undefined,
) {
  if (!filterValue) return true;
  const rowYear = new Date(row.getValue(columnId) as string);
  const selectedYear = new Date(Number(filterValue), 1, 1);
  return isSameYear(rowYear, selectedYear);
}