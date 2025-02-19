import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, signal, ViewChild } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { filter, of } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { Column, FilterColumn, NBAPlayer } from "@sports-iq/models";
import { compare } from "@sports-iq/functions";
import { StatsService } from "@sports-iq/services";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { BaseStatsTableComponent } from "../base-stats-table.component";

@Component({
	selector: "si-nba-player-table",
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
	templateUrl: "./nba-player-table.component.html",
	styleUrl: "./nba-player-table.component.scss"
})
export class NBAPlayerTableComponent extends BaseStatsTableComponent {
	statsService = inject(StatsService);

	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
	positions = input<string[]>();

	dataSource = computed<MatTableDataSource<NBAPlayer, MatPaginator> | null>(() => {
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

		const dataSource = new MatTableDataSource<NBAPlayer>(stats);
		dataSource.paginator = this.paginator;

		return dataSource;
	});

	statsResource = rxResource<NBAPlayer[], number[]>({
		request: () => {
			return this.years();
		},
		loader: ({ request }) =>
			request == null || request.length === 0 ? of([]) : this.statsService.getPlayers<NBAPlayer>("nba", request)
	});

	constructor() {
		const columns: Column[] = [
			{ name: "Rank", showInFilters: false },
			{ name: "Name", showInFilters: false },
			{ name: "Position", showInFilters: false },
			{ name: "Age", showInFilters: false },
			{ name: "Team", showInFilters: false },
			{ name: "Games", showInFilters: true, isAsc: false, property: "games" },
			{ name: "Points", showInFilters: true, isAsc: false, property: "pointsPerGame" },
			{ name: "FG%", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "fieldGoalPercent" },
			{ name: "3P%", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "threePointPercent" },
			{ name: "2P%", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "twoPointPercent" },
			{ name: "eFG%", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "efieldGoalPercent" },
			{ name: "FT%", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "freeThrowPercent" },
			{ name: "Rebounds", showInFilters: true, isAsc: false, property: "totalRebounds" },
			{ name: "Assists", showInFilters: true, isAsc: false, property: "assists" },
			{ name: "Steals", showInFilters: true, isAsc: false, property: "steals" },
			{ name: "Blocks", showInFilters: true, isAsc: false, property: "blocks" },
			{ name: "Turnovers", showInFilters: true, isAsc: false, property: "turnover" },
			{ name: "PF", showInFilters: true, isAsc: false, property: "personalFouls" }
		];

		super(columns);
	}
}
