import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, ResourceStatus, signal, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { StatsService } from "@sports-iq/services";
import { rxResource } from "@angular/core/rxjs-interop";
import { of } from "rxjs";
import { MLBBatter } from "@sports-iq/models/mlb-batter.model";
import { Column } from "@sports-iq/models";
import { compare } from "@sports-iq/functions";
import { BaseStatsTableComponent } from "../base-stats-table.component";

@Component({
	selector: "si-mlb-hitter-table",
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
	templateUrl: "./mlb-hitter-table.component.html",
	styleUrl: "./mlb-hitter-table.component.scss"
})
export class MLBHitterTableComponent extends BaseStatsTableComponent {
	statsService = inject(StatsService);

	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
	positions = input<string[]>();

	dataSource = computed<MatTableDataSource<MLBBatter, MatPaginator> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let stats = this.statsResource.value();
		const positions = this.positions();

		if (stats == null) {
			return null;
		}

		if (positions != null && positions.length > 0) {
			stats = stats?.filter((x) => x.position != null && positions.includes(x.position));
		}

		const columnWeights = this.columnWeights();

		const filterColumnWeights = new Map([...columnWeights.entries()].filter((value) => value[1].filterValue != null));

		filterColumnWeights.forEach((value, column) => {
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

		const dataSource = new MatTableDataSource<MLBBatter>(stats);
		dataSource.paginator = this.paginator;

		return dataSource;
	});

	statsResource = rxResource<MLBBatter[], number[]>({
		request: () => this.seasons(),
		loader: ({ request }) => (request == null || request.length === 0 ? of([]) : this.statsService.getHitters(request))
	});

	constructor() {
		const columns: Column[] = [
			{ name: "Rank", showInFilters: false },
			{ name: "Name", showInFilters: false },
			{ name: "Team", showInFilters: false },
			{ name: "Position", showInFilters: false },
			{ name: "Games", showInFilters: true, property: "games" },
			{ name: "At Bats", showInFilters: true, isAsc: false, property: "atBats" },
			{ name: "Runs", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "runs" },
			{ name: "Hits", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "hits" },
			{ name: "Doubles", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "doubles" },
			{ name: "Triples", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "triples" },
			{ name: "Home Runs", showInFilters: true, isAsc: false, isFilterPercentage: true, property: "homeRuns" },
			{ name: "RBI", showInFilters: true, isAsc: false, property: "rbi" },
			{ name: "Batting Avg", showInFilters: true, isAsc: false, property: "battingAverage" },
			{ name: "Steals", showInFilters: true, isAsc: false, property: "stolenBases" },
			{ name: "Walks", showInFilters: true, isAsc: false, property: "walks" },
			{ name: "Hit by Pitch", showInFilters: true, isAsc: false, property: "hitsByPitch" },
			{ name: "Strikeouts", showInFilters: true, isAsc: false, property: "strikeouts" },
			{ name: "OBP", showInFilters: true, isAsc: false, property: "obp" },
			{ name: "Slug", showInFilters: true, isAsc: false, property: "slug" },
			{ name: "OPS+", showInFilters: true, isAsc: false, property: "opsPlus" }
		];

		super(columns);
	}
}
