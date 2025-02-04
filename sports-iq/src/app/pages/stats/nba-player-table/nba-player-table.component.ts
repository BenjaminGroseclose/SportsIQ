import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, signal, ViewChild } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StatsService } from "../../../services/stats.service";
import { INBAPlayer } from "../../../models";
import { of } from "rxjs";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";

@Component({
	selector: "si-nba-player-table",
	imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule, StatsFilterComponent, MatTooltipModule],
	templateUrl: "./nba-player-table.component.html",
	styleUrl: "./nba-player-table.component.scss"
})
export class NBAPlayerTableComponent implements AfterViewInit {
	statsService = inject(StatsService);

	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

	year = input.required<number>();
	position = signal<string>("all");
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

	dataSource = computed<MatTableDataSource<INBAPlayer, MatPaginator> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		this.statsResource.value();

		const dataSource = new MatTableDataSource<INBAPlayer>(this.statsResource.value());
		dataSource.paginator = this.paginator;

		return dataSource;
	});

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

	statsResource = rxResource<INBAPlayer[], number | null>({
		request: () => {
			return this.year();
		},
		loader: ({ request }) => (request == null ? of([]) : this.statsService.getPlayers<INBAPlayer>("nba", request))
	});

	ngAfterViewInit() {
		this.viewInit.set(true);
	}

	updateFilterColumn(event: { key: string; value: number }): void {
		this.filterColumns.update((x) => x.set(event.key, event.value));

		console.log(this.filterColumns());
	}
}
