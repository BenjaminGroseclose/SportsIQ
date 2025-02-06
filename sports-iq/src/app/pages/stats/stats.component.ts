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

@Component({
	selector: "si-stats",
	imports: [CommonModule, SidenavComponent, MatSelectModule, MatFormFieldModule, NBAPlayerTableComponent, NBATeamTableComponent],
	templateUrl: "./stats.component.html",
	styleUrl: "./stats.component.scss",
	providers: [StatsService]
})
export class StatsComponent {
	sport = input.required<string>();

	statsService = inject(StatsService);

	type = signal<"players" | "teams">("teams");
	year = signal<number[]>([2025]); // TODO: Get current year programatically
	positions = signal<string[]>([]);

	tableType = computed<StatsTableType>(() => {
		const type = this.type();

		switch (this.sport()) {
			case "nba":
				return type === "players" ? StatsTableType.NBA_Player : StatsTableType.NBA_Team;

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
