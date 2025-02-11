export interface Column {
	name: string;
	showInFilters: boolean;
	isAsc?: boolean;
}

export interface FilterColumn {
	direction: "greaterThan" | "lessThan";
	filterValue: number | null;
	weight: number;
	isAsc: boolean;
}
