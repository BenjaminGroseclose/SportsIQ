import { Component, computed, inject, input, ViewChild } from "@angular/core";
import { BaseStatsTableComponent } from "../base-stats-table.component";
import { Column } from "@sports-iq/models";
import { rxResource } from "@angular/core/rxjs-interop";
import { StatsService } from "@sports-iq/services";
import { of } from "rxjs";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MLBPitcher } from "@sports-iq/models/mlb-pitcher.model";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { compare } from "@sports-iq/functions";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

@Component({
	selector: "si-mlb-pitcher-table",
	imports: [
		CommonModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		StatsFilterComponent,
		MatTooltipModule,
		MatFormFieldModule,
		MatSelectModule
	],
	templateUrl: "./mlb-pitcher-table.component.html",
	styleUrl: "./mlb-pitcher-table.component.scss"
})
export class MLBPitcherTableComponent extends BaseStatsTableComponent {
	statsService = inject(StatsService);

	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
	positions = input<string[]>();

	dataSource = computed<MatTableDataSource<MLBPitcher, MatPaginator> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let stats = this.statsResource.value();
		const position = this.positions();

		if (stats == null) {
			return null;
		}

		if (position != null && position.length > 0) {
			stats = stats?.filter((x) => x.position != null && position.includes(x.position));
		}

		const columnWeights = this.columnWeights();

		const filterColumnWeights = new Map([...columnWeights.entries()].filter((value) => value[1].filterValue != null));

		filterColumnWeights.forEach((value, _) => {
			stats = stats?.filter((x) => {
				const property = value.property as keyof typeof x;
				const prop = Number(x[property]);

				let filterValue = value.filterValue ?? 0;

				if (value.isFilterPercentage) {
					filterValue = filterValue / 100;
				}

				// already filtered out nulls above
				return value.direction === "greaterThan" ? prop > filterValue : prop < filterValue;
			});
		});

		const sortedColumnWeights = new Map(
			[...columnWeights.entries()].filter((value) => value[1].weight > 1).sort((a, b) => compare(a[1].weight, b[1].weight, false))
		);

		if (sortedColumnWeights.size > 0) {
			stats = stats?.sort((a, b) => {
				let sortValue: number | null = null;

				sortedColumnWeights.forEach((value, column) => {
					if (sortValue != null) {
						return;
					}

					const property = value.property as keyof typeof a;

					const aValue = Number(a[property]);
					const bValue = Number(b[property]);

					if (aValue > bValue) {
						sortValue = 1 * (value.isAsc ? 1 : -1);
					}

					if (aValue < bValue) {
						sortValue = -1 * (value.isAsc ? 1 : -1);
					}
				});

				return sortValue ?? 0;
			});
		}

		const dataSource = new MatTableDataSource<MLBPitcher>(stats);
		dataSource.paginator = this.paginator;

		return dataSource;
	});

	statsResource = rxResource<MLBPitcher[], number[]>({
		request: () => {
			return this.seasons();
		},
		loader: ({ request }) => (request == null || request.length === 0 ? of([]) : this.statsService.getPitchers(request))
	});

	constructor() {
		const columns: Column[] = [
			{ name: "Rank", showInFilters: false },
			{ name: "Name", showInFilters: false },
			{ name: "Team", showInFilters: false },
			{ name: "Position", showInFilters: true, property: "position" },
			{ name: "Games", showInFilters: true, property: "games" },
			{ name: "W/L", showInFilters: true, property: "wins" },
			{ name: "Saves", showInFilters: true, property: "saves" },
			{ name: "IP", showInFilters: true, property: "inningsPitched" },
			{ name: "ERA", showInFilters: true, property: "era", isAsc: true },
			{ name: "Earned Runs", showInFilters: true, property: "earnedRuns", isAsc: false },
			{ name: "Shutouts", showInFilters: true, property: "shutouts" },
			{ name: "WHIP", showInFilters: true, property: "whip" },
			{ name: "Hits", showInFilters: true, property: "hits", isAsc: false },
			{ name: "Strikeouts", showInFilters: true, property: "strikeouts" },
			{ name: "HR", showInFilters: true, property: "homeRuns", isAsc: false },
			{ name: "Walks", showInFilters: true, property: "walks", isAsc: false },
			{ name: "Avg Against", showInFilters: true, property: "battingAverage", isFilterPercentage: true },
			{ name: "OBP", showInFilters: true, property: "obp", isFilterPercentage: true }
		];

		super(columns);
	}
}
