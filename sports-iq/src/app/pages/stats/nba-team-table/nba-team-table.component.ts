import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, signal, ViewChild } from "@angular/core";
import { StatsService } from "../../../services";
import { rxResource } from "@angular/core/rxjs-interop";
import { NBATeam } from "../../../models";
import { of } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { MatPaginator } from "@angular/material/paginator";

@Component({
	selector: "si-nba-team-table",
	imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, StatsFilterComponent],
	templateUrl: "./nba-team-table.component.html",
	styleUrl: "./nba-team-table.component.scss"
})
export class NBATeamTableComponent implements AfterViewInit {
	statsService = inject(StatsService);

	years = input.required<number[]>();

	viewInit = signal<boolean>(false);
	dataSource = computed<MatTableDataSource<NBATeam> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let stats = this.statsResource.value();

		return new MatTableDataSource<NBATeam>(stats);
	});

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

	displayColumns = [
		"Team",
		"Record",
		"Expected Record",
		"Margin of Victory",
		"SOS",
		"SRS",
		"Offensive Rating",
		"Defensive Rating",
		"Net Rating",
		"Pace",
		"Free Throw Rate",
		"Three point Rate",
		"eFG%",
		"Turnover%",
		"OREB %",
		"Free Throws Per Field Goal",
		"Defensive eFG%",
		"Defensive Turnover%",
		"Defensive OREB %",
		"DefensiveFree Throws Per Field Goal"
	];

	statsResource = rxResource<NBATeam[], number[]>({
		request: () => {
			return this.years();
		},
		loader: ({ request }) => (request == null ? of([]) : this.statsService.getTeams<NBATeam>("nba", request))
	});

	ngAfterViewInit(): void {
		this.viewInit.set(true);
	}
}
