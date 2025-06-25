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
  "array-includes": arrayIncludesFilter,
};

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function checkbox(
  row,
  columnId,
  filterValue
) {
  if (!filterValue?.length) return true;
  const column = row.getValue(columnId);
  return filterValue.includes(column);
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function radio(row, columnId, filterValue){
  if (!filterValue) return true;
  const column = String(row.getValue(columnId));
  return String(filterValue) === column;
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function dateRange(
  row,
  columnId,
  filterValue,
){
  if (!filterValue || filterValue.length !== 2) return true;

  const rowDate = new Date(row.getValue(columnId));
  const from = new Date(filterValue[0]);
  const to = new Date(filterValue[1]);

  return isWithinInterval(rowDate, { start: from, end: to });
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function dateYear(
  row,
  columnId,
  filterValue,
) {
  if (!filterValue) return true;
  const rowYear = new Date(row.getValue(columnId));
  const selectedYear = new Date(Number(filterValue), 1, 1);
  return isSameYear(rowYear, selectedYear);
}

function arrayIncludesFilter(row, columnId, filterValue) {
  if (!filterValue?.length) return true;
  const columnArray = row.getValue(columnId) || [];
  
  if (!Array.isArray(columnArray)) return false;

  // Baris tetap tampil kalau minimal 1 value cocok
  return columnArray.some((val) => filterValue.includes(val));
}