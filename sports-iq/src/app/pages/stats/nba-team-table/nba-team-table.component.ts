import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, signal } from "@angular/core";
import { StatsService } from "../../../services";
import { rxResource } from "@angular/core/rxjs-interop";
import { Column, NBATeam } from "../../../models";
import { of } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { FilterColumn, StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
	selector: "si-nba-team-table",
	imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, StatsFilterComponent, MatTooltipModule],
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

		if (stats == null) {
			return null;
		}

		return new MatTableDataSource<NBATeam>(stats);
	});

	columns: Column[] = [
		{ name: "Rank", showInFilters: false },
		{ name: "Team", showInFilters: false },
		{ name: "Record", showInFilters: false },
		{ name: "Expected Record", showInFilters: false },
		{ name: "Margin of Victory", showInFilters: false },
		{ name: "SOS", showInFilters: false },
		{ name: "SRS", showInFilters: false },
		{ name: "Offensive Rating", showInFilters: false },
		{ name: "Defensive Rating", showInFilters: false },
		{ name: "Net Rating", showInFilters: false },
		{ name: "Pace", showInFilters: false },
		{ name: "FT Rate", showInFilters: false },
		{ name: "3P Rate", showInFilters: false },
		{ name: "TS%", showInFilters: false },
		{ name: "eFG%", showInFilters: false },
		{ name: "TO%", showInFilters: false },
		{ name: "ORB%", showInFilters: false },
		{ name: "FT/FG", showInFilters: false },
		{ name: "Defensive eFG%", showInFilters: false },
		{ name: "Defensive TO%", showInFilters: false },
		{ name: "DRB%", showInFilters: false },
		{ name: "Defensive FT/FG", showInFilters: false }
	];

	displayColumns = this.columns.map((x) => x.name);

	filterColumns = signal<Map<string, FilterColumn>>(
		new Map(
			this.columns
				.filter((x) => x.showInFilters)
				.map((x) => {
					return [x.name, { weight: 1, isAsc: true, filterValue: null, direction: "greaterThan" }];
				})
		)
	);

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
