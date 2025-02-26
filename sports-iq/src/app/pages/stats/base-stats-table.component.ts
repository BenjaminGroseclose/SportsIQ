import { AfterViewInit, Component, Inject, input, signal } from "@angular/core";
import { Column, FilterColumn } from "@sports-iq/models";

@Component({
	selector: "si-base-stats-table",
	template: ""
})
export class BaseStatsTableComponent implements AfterViewInit {
	seasons = input.required<number[]>();
	viewInit = signal<boolean>(false);

	displayColumns = signal<string[]>([]);
	columnWeights = signal<Map<string, FilterColumn>>(new Map());

	constructor(@Inject("columns") protected columns: Column[]) {
		this.displayColumns.set(this.columns.map((x) => x.name));
		this.columnWeights.set(
			new Map(
				this.columns
					.filter((x) => x.showInFilters)
					.map((x) => {
						return [
							x.name,
							{
								weight: 1,
								isAsc: x.isAsc ?? false,
								filterValue: null,
								direction: "greaterThan",
								isFilterPercentage: x.isFilterPercentage ?? false,
								property: x.property ?? ""
							}
						];
					})
			)
		);
	}

	ngAfterViewInit(): void {
		this.viewInit.set(true);
	}

	updateFilterColumn(event: { key: string; value: FilterColumn }): void {
		const weights = this.columnWeights();
		weights.set(event.key, event.value);

		this.columnWeights.set(new Map(weights));
	}
}
