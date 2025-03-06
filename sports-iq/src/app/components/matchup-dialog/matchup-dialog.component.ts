import { CommonModule } from "@angular/common";
import { Component, inject, Inject, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MLBBatter, MLBPitcher, PlayerRanking } from "@sports-iq/models";
import { StatsService } from "@sports-iq/services";

@Component({
	selector: "si-matchup-dialog",
	imports: [CommonModule, MatDialogModule, MatButtonModule],
	templateUrl: "./matchup-dialog.component.html",
	styleUrl: "./matchup-dialog.component.scss",
	providers: [StatsService]
})
export class MatchupDialogComponent implements OnInit {
	readonly statsService = inject(StatsService);

	playerOne = signal<MLBBatter | MLBPitcher | null>(null);
	playerTwo = signal<MLBBatter | MLBPitcher | null>(null);

	constructor(
		private dialogRef: MatDialogRef<MatchupDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { players: PlayerRanking[]; sport: string }
	) {}

	ngOnInit(): void {
		this.data.players.forEach((player, index) => {
			if (player.position === "P" || player.position === "RP") {
				this.statsService
					.getPitcher(player.playerID)
					.subscribe((x) => (index === 0 ? this.playerOne.set(x) : this.playerTwo.set(x)));
			} else {
				this.statsService
					.getBatter(player.playerID)
					.subscribe((x) => (index === 0 ? this.playerOne.set(x) : this.playerTwo.set(x)));
			}
		});
	}
}
