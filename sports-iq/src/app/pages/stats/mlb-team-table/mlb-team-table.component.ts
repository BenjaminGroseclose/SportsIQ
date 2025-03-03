import { Component, computed, inject } from "@angular/core";
import { Column, MLBTeamStats } from "@sports-iq/models";
import { BaseStatsTableComponent } from "../base-stats-table.component";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";
import { rxResource } from "@angular/core/rxjs-interop";
import { of } from "rxjs";
import { StatsService } from "@sports-iq/services";
import { compare } from "@sports-iq/functions";

@Component({
	selector: "si-mlb-team-table",
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
	templateUrl: "./mlb-team-table.component.html",
	styleUrl: "./mlb-team-table.component.scss"
})
export class MLBTeamTableComponent extends BaseStatsTableComponent {
	statsService = inject(StatsService);

	dataSource = computed<MatTableDataSource<MLBTeamStats> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let stats = this.statsResource.value();

		if (stats == null) {
			return null;
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

		return new MatTableDataSource<MLBTeamStats>(stats);
	});

	statsResource = rxResource<MLBTeamStats[], number[]>({
		request: () => {
			return this.seasons();
		},
		loader: ({ request }) =>
			request == null || request.length === 0 ? of([]) : this.statsService.getTeamStats<MLBTeamStats>("mlb", request)
	});

	constructor() {
		const columns: Column[] = [
			{ name: "Rank", showInFilters: false },
			{ name: "Name", showInFilters: false },
			{ name: "W/L", showInFilters: true, property: "wins" },
			{ name: "At Bats", showInFilters: true, property: "atBats" },
			{ name: "Runs", showInFilters: true, property: "runs" },
			{ name: "Hits", showInFilters: true, property: "hits" },
			{ name: "2B", showInFilters: true, property: "doubles" },
			{ name: "3B", showInFilters: true, property: "triples" },
			{ name: "HR", showInFilters: true, property: "homeRuns" },
			{ name: "Batting Avg", showInFilters: true, property: "battingAverage" },
			{ name: "Batting Strikeouts", showInFilters: true, property: "battingStrikeouts" },
			{ name: "Steals", showInFilters: true, property: "steals" },
			{ name: "OBP", showInFilters: true, property: "obp" },
			{ name: "Slug", showInFilters: true, property: "slug" },
			{ name: "OBP+", showInFilters: true, property: "obpPlus" },
			{ name: "Pitching Strikeouts", showInFilters: true, property: "pitchingStrikeouts" },
			{ name: "Saves", showInFilters: true, property: "saves" },
			{ name: "ERA", showInFilters: true, property: "era" },
			{ name: "Run Given Up", showInFilters: true, property: "runsScoredByOpponent" },
			{ name: "Pitching Hits", showInFilters: true, property: "pitchingHits" },
			{ name: "Pitching Home Runs", showInFilters: true, property: "pitchingHomeRuns" }
		];

		super(columns);
	}
}
