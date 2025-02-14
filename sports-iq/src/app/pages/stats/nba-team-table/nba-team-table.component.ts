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

	columns: Column[] = [
		{ name: "Rank", showInFilters: false },
		{ name: "Team", showInFilters: false },
		{ name: "Record", showInFilters: true },
		{ name: "Expected Record", showInFilters: true },
		{ name: "Margin of Victory", showInFilters: true },
		{ name: "SOS", showInFilters: true },
		{ name: "SRS", showInFilters: true },
		{ name: "Offensive Rating", showInFilters: true, isAsc: false },
		{ name: "Defensive Rating", showInFilters: true },
		{ name: "Net Rating", showInFilters: true },
		{ name: "Pace", showInFilters: true },
		{ name: "FT Rate", showInFilters: true, isFilterPercentage: true },
		{ name: "3P Rate", showInFilters: true, isFilterPercentage: true },
		{ name: "TS%", showInFilters: true, isFilterPercentage: true },
		{ name: "eFG%", showInFilters: true, isFilterPercentage: true },
		{ name: "TO%", showInFilters: true, isFilterPercentage: true },
		{ name: "ORB%", showInFilters: true, isFilterPercentage: true },
		{ name: "FT/FG", showInFilters: true },
		{ name: "Defensive eFG%", showInFilters: true, isFilterPercentage: true },
		{ name: "Defensive TO%", showInFilters: true, isFilterPercentage: true },
		{ name: "DRB%", showInFilters: true, isFilterPercentage: true },
		{ name: "Defensive FT/FG", showInFilters: true }
	];

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
							isAsc: true,
							filterValue: null,
							direction: "greaterThan",
							isFilterPercentage: x.isFilterPercentage ?? false
						}
					];
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

	updateFilterColumn(event: { key: string; value: FilterColumn }): void {
		const weights = this.columnWeights();
		weights.set(event.key, event.value);

		this.columnWeights.set(new Map(weights));
	}
}
