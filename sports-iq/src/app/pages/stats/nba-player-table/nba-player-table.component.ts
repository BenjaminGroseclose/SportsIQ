import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, signal, ViewChild } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { of } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { Column, NBAPlayer } from "@sports-iq/models";
import { compare } from "@sports-iq/functions";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { StatsService } from "@sports-iq/services";

const columnPropertyMap = new Map<string, string>([
	["Games", "games"],
	["Points", "pointsPerGame"],
	["FG%", "fieldGoalPercent"],
	["3P%", "threePointPercent"],
	["2P%", "twoPointPercent"],
	["eFG%", "efieldGoalPercent"],
	["FT%", "freeThrowPercent"],
	["Rebounds", "totalRebounds"],
	["Assists", "assists"],
	["Steals", "steals"],
	["Blocks", "blocks"],
	["Turnovers", "turnover"],
	["PF", "personalFouls"]
]);

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
export class NBAPlayerTableComponent implements AfterViewInit {
	statsService = inject(StatsService);

	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

	years = input.required<number[]>();
	positions = input<string[]>();

	columns: Column[] = [
		{ name: "Rank", showInFilters: false },
		{ name: "Name", showInFilters: false },
		{ name: "Position", showInFilters: false },
		{ name: "Age", showInFilters: false },
		{ name: "Team", showInFilters: false },
		{ name: "Games", showInFilters: true },
		{ name: "Points", showInFilters: true },
		{ name: "FG%", showInFilters: true },
		{ name: "3P%", showInFilters: true },
		{ name: "2P%", showInFilters: true },
		{ name: "eFG%", showInFilters: true },
		{ name: "FT%", showInFilters: true },
		{ name: "Rebounds", showInFilters: true },
		{ name: "Assists", showInFilters: true },
		{ name: "Steals", showInFilters: true },
		{ name: "Blocks", showInFilters: true },
		{ name: "Turnovers", showInFilters: true },
		{ name: "PF", showInFilters: true }
	];

	displayColumns = this.columns.map((x) => x.name);

	viewInit = signal<boolean>(false);
	columnWeights = signal<Map<string, { weight: number; isAsc: boolean }>>(
		new Map(
			this.columns
				.filter((x) => x.showInFilters)
				.map((x) => {
					return [x.name, { weight: 1, isAsc: true }];
				})
		)
	);

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

		const sortedColumnWeights = new Map(
			[...columnWeights.entries()].filter((value) => value[1].weight > 1).sort((a, b) => compare(a[1].weight, b[1].weight, true))
		);

		console.log(sortedColumnWeights);

		sortedColumnWeights.forEach((value, column) => {
			console.log(column, value);

			stats = stats?.sort((a, b) => {
				const property = columnPropertyMap.get(column)!! as keyof typeof a;

				const aValue = a[property];
				const bValue = b[property];

				return compare(aValue, bValue, value.isAsc);
			});
		});

		console.log(stats.find((x) => x.player === "Justin Minaya"));
		console.log(stats.find((x) => x.player === "Shai Gilgeous-Alexander"));

		const dataSource = new MatTableDataSource<NBAPlayer>(stats);
		dataSource.paginator = this.paginator;

		return dataSource;
	});

	statsResource = rxResource<NBAPlayer[], number[]>({
		request: () => {
			return this.years();
		},
		loader: ({ request }) => (request == null ? of([]) : this.statsService.getPlayers<NBAPlayer>("nba", request))
	});

	ngAfterViewInit() {
		this.viewInit.set(true);
	}

	updateFilterColumnWeight(event: { key: string; value: number }): void {
		const weights = this.columnWeights();
		const isAsc = weights.get(event.key)?.isAsc ?? true;
		weights.set(event.key, { weight: event.value, isAsc: isAsc });

		this.columnWeights.set(new Map(weights));
	}

	updateFilterColumnAsc(event: { key: string; value: boolean }): void {
		const weights = this.columnWeights();
		const weight = weights.get(event.key)?.weight ?? 1;
		weights.set(event.key, { weight: weight, isAsc: event.value });

		this.columnWeights.set(new Map(weights));
	}
}
