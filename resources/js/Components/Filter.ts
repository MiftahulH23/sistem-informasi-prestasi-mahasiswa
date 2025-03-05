import { FilterFn } from "@tanstack/react-table";
import { isSameYear, isWithinInterval } from "date-fns";

type DataTable = "checkbox" | "date-range" | "date-year";

export class Filter {
    static dataTable<T>(filterType: DataTable): FilterFn<T> {
        switch (filterType) {
            case "checkbox":
                return this.checkboxFilter as FilterFn<T>;
            case "date-range":
                return this.dateRangeFilter as FilterFn<T>;
            case "date-year":
                return this.dateByYearFilter as FilterFn<T>;
            default:
                throw new Error("Invalid filter type");
        }
    }

    static checkboxFilter(
        row: { getValue: (columnId: string) => unknown },
        columnId: string,
        filterValue: string[]
    ): boolean {
        if (!filterValue?.length) return true;
        const column = row.getValue(columnId) as string;
        return filterValue.includes(column);
    }

    static dateRangeFilter(
        row: { getValue: (columnId: string) => unknown },
        columnId: string,
        filterValue: string[]
    ): boolean {
        if (!filterValue || filterValue.length !== 2) return true;

        const rowDate = new Date(row.getValue(columnId) as string);
        const from = new Date(filterValue[0]);
        const to = new Date(filterValue[1]);

        return isWithinInterval(rowDate, { start: from, end: to });
    }

    static dateByYearFilter(
        row: { getValue: (columnId: string) => unknown },
        columnId: string,
        filterValue: string | undefined
    ) {
        if (!filterValue) return true;
        const rowYear = new Date(row.getValue(columnId) as string);
        const selectedYear = new Date(Number(filterValue), 1, 1);
        return isSameYear(rowYear, selectedYear);
    }
}
