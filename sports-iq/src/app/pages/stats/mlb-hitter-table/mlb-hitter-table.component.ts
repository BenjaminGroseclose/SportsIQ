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
import { MLBHitter } from "@sports-iq/models/mlb-hitter.model";
import { Column, FilterColumn } from "@sports-iq/models";
import { compare } from "@sports-iq/functions";

const columnPropertyMap = new Map<string, string>([
	["Plate Apperances", "plateAppearances"],
	["At Bats", "atBats"],
	["Runs", "runs"],
	["Hits", "hits"],
	["Doubles", "doubles"],
	["Triples", "triples"],
	["Home Runs", "homeRuns"],
	["RBI", "rbi"],
	["Steals", "stolenBases"],
	["Base on Balls", "baseOnBalls"],
	["Strikeouts", "strikeouts"],
	["Batting Avg", "battingAverage"],
	["OBP", "onBasePercentage"],
	["Slug", "slug"],
	["OPS+", "opsPlus"],
	["rOBA", "roba"]
]);

// TODO: Create a base stats component

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
export class MLBHitterTableComponent implements AfterViewInit {
	statsService = inject(StatsService);

	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

	years = input.required<number[]>();

	columns: Column[] = [
		{ name: "Rank", showInFilters: false },
		{ name: "Age", showInFilters: false },
		{ name: "Name", showInFilters: false },
		{ name: "League", showInFilters: false },
		{ name: "Games", showInFilters: true },
		{ name: "WAR", showInFilters: false },
		{ name: "Plate Apperances", showInFilters: true, isAsc: false },
		{ name: "At Bats", showInFilters: true, isAsc: false },
		{ name: "Batting Avg", showInFilters: true, isAsc: false },
		{ name: "Runs", showInFilters: true, isAsc: false, isFilterPercentage: true },
		{ name: "Hits", showInFilters: true, isAsc: false, isFilterPercentage: true },
		{ name: "Doubles", showInFilters: true, isAsc: false, isFilterPercentage: true },
		{ name: "Triples", showInFilters: true, isAsc: false, isFilterPercentage: true },
		{ name: "Home Runs", showInFilters: true, isAsc: false, isFilterPercentage: true },
		{ name: "RBI", showInFilters: true, isAsc: false },
		{ name: "Steals", showInFilters: true, isAsc: false },
		{ name: "Base on Balls", showInFilters: true, isAsc: false },
		{ name: "Strikeouts", showInFilters: true, isAsc: false },
		{ name: "OBP", showInFilters: true, isAsc: false },
		{ name: "Slug", showInFilters: true, isAsc: false },
		{ name: "OPS+", showInFilters: true, isAsc: false },
		{ name: "rOBA", showInFilters: true, isAsc: false }
	];

	viewInit = signal<boolean>(false);
	displayColumns = this.columns.map((x) => x.name);
	columnWeights = signal<Map<string, FilterColumn>>(
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
							isFilterPercentage: x.isFilterPercentage ?? false
						}
					];
				})
		)
	);

	dataSource = computed<MatTableDataSource<MLBHitter, MatPaginator> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let stats = this.statsResource.value();

		if (stats == null) {
			return null;
		}

		console.log(stats);

		const columnWeights = this.columnWeights();

		const filterColumnWeights = new Map([...columnWeights.entries()].filter((value) => value[1].filterValue != null));

		filterColumnWeights.forEach((value, column) => {
			stats = stats?.filter((x) => {
				const property = columnPropertyMap.get(column)!! as keyof typeof x;
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

					const property = columnPropertyMap.get(column)!! as keyof typeof a;

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

		const dataSource = new MatTableDataSource<MLBHitter>(stats);
		dataSource.paginator = this.paginator;

		return dataSource;
	});

	statsResource = rxResource<MLBHitter[], number[]>({
		request: () => {
			return this.years();
		},
		loader: ({ request }) => (request == null || request.length === 0 ? of([]) : this.statsService.getHitters(request))
	});

	ngAfterViewInit(): void {
		this.viewInit.set(true);
	}

	updateFilterColumn(event: { key: string; value: FilterColumn }): void {
		const weights = this.columnWeights();
		weights.set(event.key, event.value);

		this.columnWeights.set(new Map(weights));
	}
}
