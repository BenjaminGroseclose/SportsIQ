import { Component, computed, inject, ViewChild } from "@angular/core";
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

	dataSource = computed<MatTableDataSource<MLBPitcher, MatPaginator> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let stats = this.statsResource.value();

		if (stats == null) {
			return null;
		}

		const columnWeights = this.columnWeights();

		const filterColumnWeights = new Map([...columnWeights.entries()].filter((value) => value[1].filterValue != null));

		filterColumnWeights.forEach((value, column) => {
			stats = stats?.filter((x) => {
				const property = value.property as keyof typeof x;
				const prop = x[property];

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

					const aValue = a[property];
					const bValue = b[property];

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
			return this.years();
		},
		loader: ({ request }) => (request == null || request.length === 0 ? of([]) : this.statsService.getPitchers(request))
	});

	constructor() {
		const columns: Column[] = [
			{ name: "Rank", showInFilters: false },
			{ name: "Player", showInFilters: false },
			{ name: "Age", showInFilters: false },
			{ name: "Team", showInFilters: false },
			{ name: "League", showInFilters: false },
			{ name: "Games", showInFilters: true, property: "games" },
			{ name: "Record", showInFilters: true, property: "wins" },
			{ name: "ERA", showInFilters: true, property: "era", isAsc: false },
			{ name: "ERA+", showInFilters: true, property: "eraPlus", isAsc: false },
			{ name: "Shutouts", showInFilters: true, property: "shutouts" },
			{ name: "Saves", showInFilters: true, property: "saves" },
			{ name: "IP", showInFilters: true, property: "ip" },
			{ name: "WHIP", showInFilters: true, property: "whip" },
			{ name: "Hits Allowed", showInFilters: true, property: "hitsAllowed", isAsc: false },
			{ name: "ERA Allowed", showInFilters: true, property: "earnedRunsAllowed", isAsc: false },
			{ name: "HR Allowed", showInFilters: true, property: "homeRunsAllowed", isAsc: false },
			{ name: "BB", showInFilters: true, property: "basesOnBalls", isAsc: false },
			{ name: "Strikeouts", showInFilters: true, property: "strikeouts" },
			{ name: "Hits by Pitch", showInFilters: true, property: "hitsByPitch" },
			{ name: "Balks", showInFilters: true, property: "balks" },
			{ name: "SO/Walk", showInFilters: true, property: "balks" }
		];

		super(columns);
	}
}
