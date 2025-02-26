import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, signal } from "@angular/core";
import { StatsService } from "../../../services";
import { rxResource } from "@angular/core/rxjs-interop";
import { Column, FilterColumn, NBATeam } from "../../../models";
import { filter, of } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { StatsFilterComponent } from "../stats-filter/stats-filter.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { compare } from "@sports-iq/functions";
import { BaseStatsTableComponent } from "../base-stats-table.component";

const columnPropertyMap = new Map<string, string>([
	["Record", "wins"],
	["Expected Record", "expectedWins"],
	["Margin of Victory", "marginOfVictory"],
	["SOS", "strengthOfSchedule"],
	["SRS", "simpleRatingSystem"],
	["Offensive Rating", "offensiveRating"],
	["Defensive Rating", "defensiveRating"],
	["Net Rating", "netRating"],
	["Pace", "pace"],
	["FT Rate", "freeThrowRate"],
	["3P Rate", "threePointRate"],
	["TS%", "trueShootingPercent"],
	["eFG%", "efieldGoalPercent"],
	["TO%", "turnoverPercent"],
	["ORB%", "offensiveReboundPercent"],
	["FT/FG", "freeThrowPerFieldGoal"],
	["Defensive eFG%", "defensiveEFieldGoalPercent"],
	["Defensive TO%", "defensiveTurnoverPercent"],
	["DRB%", "defensiveReboundPercent"],
	["Defensive FT/FG", "defensiveFreeThrowPerFieldGoal"]
]);

@Component({
	selector: "si-nba-team-table",
	imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, StatsFilterComponent, MatTooltipModule],
	templateUrl: "./nba-team-table.component.html",
	styleUrl: "./nba-team-table.component.scss"
})
export class NBATeamTableComponent extends BaseStatsTableComponent {
	statsService = inject(StatsService);

	dataSource = computed<MatTableDataSource<NBATeam> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let stats = this.statsResource.value();

		if (stats == null) {
			return null;
		}

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

		return new MatTableDataSource<NBATeam>(stats);
	});

	statsResource = rxResource<NBATeam[], number[]>({
		request: () => {
			return this.seasons();
		},
		loader: ({ request }) => (request == null || request.length === 0 ? of([]) : this.statsService.getTeams<NBATeam>("nba", request))
	});

	constructor() {
		const columns: Column[] = [
			{ name: "Rank", showInFilters: false },
			{ name: "Team", showInFilters: false },
			{ name: "Record", showInFilters: true, property: "wins" },
			{ name: "Expected Record", showInFilters: true, property: "expectedWins" },
			{ name: "Margin of Victory", showInFilters: true, property: "marginOfVictory" },
			{ name: "SOS", showInFilters: true, property: "strengthOfSchedule" },
			{ name: "SRS", showInFilters: true, property: "simpleRatingSystem" },
			{ name: "Offensive Rating", showInFilters: true, isAsc: false, property: "offensiveRating" },
			{ name: "Defensive Rating", showInFilters: true, property: "defensiveRating" },
			{ name: "Net Rating", showInFilters: true, property: "netRating" },
			{ name: "Pace", showInFilters: true, property: "pace" },
			{ name: "FT Rate", showInFilters: true, isFilterPercentage: true, property: "freeThrowRate" },
			{ name: "3P Rate", showInFilters: true, isFilterPercentage: true, property: "threePointRate" },
			{ name: "TS%", showInFilters: true, isFilterPercentage: true, property: "trueShootingPercent" },
			{ name: "eFG%", showInFilters: true, isFilterPercentage: true, property: "efieldGoalPercent" },
			{ name: "TO%", showInFilters: true, isFilterPercentage: true, property: "turnoverPercent" },
			{ name: "ORB%", showInFilters: true, isFilterPercentage: true, property: "offensiveReboundPercent" },
			{ name: "FT/FG", showInFilters: true, property: "freeThrowPerFieldGoal" },
			{ name: "Defensive eFG%", showInFilters: true, isFilterPercentage: true, property: "defensiveEFieldGoalPercent" },
			{ name: "Defensive TO%", showInFilters: true, isFilterPercentage: true, property: "defensiveTurnoverPercent" },
			{ name: "DRB%", showInFilters: true, isFilterPercentage: true, property: "defensiveReboundPercent" },
			{ name: "Defensive FT/FG", showInFilters: true, property: "defensiveFreeThrowPerFieldGoal" }
		];

		super(columns);
	}
}
