import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, Input, signal } from "@angular/core";
import { StatsService } from "../../services/stats.service";
import { SidenavComponent } from "../../components/sidenav/sidenav.component";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NBAPlayerTableComponent } from "./nba-player-table/nba-player-table.component";
import { StatsTableType } from "../../models";
import { rxResource } from "@angular/core/rxjs-interop";
import { take } from "rxjs";
import { NBATeamTableComponent } from "./nba-team-table/nba-team-table.component";
import { MLBHitterTableComponent } from "./mlb-hitter-table/mlb-hitter-table.component";
import { MLBPitcherTableComponent } from "./mlb-pitcher-table/mlb-pitcher-table.component";

@Component({
	selector: "si-stats",
	imports: [
		CommonModule,
		SidenavComponent,
		MatSelectModule,
		MatFormFieldModule,
		NBAPlayerTableComponent,
		NBATeamTableComponent,
		MLBHitterTableComponent,
		MLBPitcherTableComponent
	],
	templateUrl: "./stats.component.html",
	styleUrl: "./stats.component.scss",
	providers: [StatsService]
})
export class StatsComponent {
	sport = input.required<string>();

	statsService = inject(StatsService);

	type = signal<string>("teams");
	year = signal<number[]>([2025]); // TODO: Get current year programatically
	positions = signal<string[]>([]);

	typeOptions = computed(() => {
		if (this.sport() === "mlb") {
			return ["teams", "hitters", "pitchers"];
		} else {
			return ["teams", "players"];
		}
	});

	tableType = computed<StatsTableType>(() => {
		const type = this.type();

		switch (this.sport()) {
			case "nba":
				return type === "players" ? StatsTableType.NBA_Player : StatsTableType.NBA_Team;

			case "mlb":
				if (type === "hitters") {
					return StatsTableType.MLB_Hitter;
				} else if (type === "pitchers") {
					return StatsTableType.MLB_Pitcher;
				} else {
					return StatsTableType.MLB_Team;
				}

			default:
				return StatsTableType.Unknown;
		}
	});

	yearsResource = rxResource<number[], string>({
		request: () => {
			return this.sport();
		},
		loader: ({ request }) => this.statsService.getYears(request).pipe(take(1))
	});

	positionResource = rxResource<string[], string>({
		request: () => {
			return this.sport();
		},
		loader: ({ request }) => this.statsService.getPositions(request).pipe(take(1))
	});
}
