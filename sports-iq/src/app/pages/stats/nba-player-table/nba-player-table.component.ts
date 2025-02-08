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
	columnWeights = signal<Map<string, number>>(
		new Map(
			this.columns
				.filter((x) => x.showInFilters)
				.map((x) => {
					return [x.name, 1];
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
		console.log(columnWeights);
		console.log("SORTING");
		stats = stats.sort((a: any, b: any) => {
			let sortValue = 0;

			columnWeights.forEach((weight, column) => {
				if (weight === 1) {
					return;
				}

				const aValue = a[columnPropertyMap.get(column)!!];
				const bValue = b[columnPropertyMap.get(column)!!];

				sortValue += compare(aValue, bValue, false) * weight;
			});

			return sortValue;
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

	updateFilterColumn(event: { key: string; value: number }): void {
		const weights = this.columnWeights();
		weights.set(event.key, event.value);

		this.columnWeights.set(new Map(weights));
	}
}
