import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, signal, ViewChild } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StatsService } from "../../../services/stats.service";
import { NBAPlayer } from "../../../models";
import { of } from "rxjs";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

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

	position = signal<string[]>([]);
	viewInit = signal<boolean>(false);
	filterColumns = signal<Map<string, number>>(
		new Map([
			["Game", 1],
			["Points", 1],
			["FG%", 1],
			["3P%", 1],
			["2P%", 1],
			["eFG%", 1],
			["FT%", 1],
			["Rebounds", 1],
			["Assists", 1],
			["Steals", 1],
			["Blocks", 1],
			["Turnovers", 1],
			["PF", 1]
		])
	);

	dataSource = computed<MatTableDataSource<NBAPlayer, MatPaginator> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let stats = this.statsResource.value();
		const position = this.position();

		if (position != null && position.length > 0) {
			stats = stats?.filter((x) => x.position != null && position.includes(x.position));
		}

		const dataSource = new MatTableDataSource<NBAPlayer>(stats);
		dataSource.paginator = this.paginator;

		return dataSource;
	});

	positions = ["PG", "SG", "SF", "PF", "C"];
	displayColumns = [
		"Name",
		"Position",
		"Age",
		"Team",
		"Games",
		"Points",
		"FG%",
		"3P%",
		"2P%",
		"eFG%",
		"FT%",
		"Rebounds",
		"Assists",
		"Steals",
		"Blocks",
		"Turnovers",
		"PF"
	];

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
		this.filterColumns.update((x) => x.set(event.key, event.value));

		console.log(this.filterColumns());
	}
}
