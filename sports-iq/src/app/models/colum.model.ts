export interface Column {
	name: string;
	showInFilters: boolean;
	isAsc?: boolean;
	isFilterPercentage?: boolean;
}

export interface FilterColumn {
	direction: "greaterThan" | "lessThan";
	filterValue: number | null;
	isFilterPercentage: boolean;
	weight: number;
	isAsc: boolean;
}
