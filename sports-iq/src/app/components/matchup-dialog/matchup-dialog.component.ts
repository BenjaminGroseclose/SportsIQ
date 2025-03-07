import { CommonModule } from "@angular/common";
import { Component, inject, Inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PlayerRanking } from "@sports-iq/models";
import { RankingService, StatsService } from "@sports-iq/services";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { PositionChipsComponent } from "../position-chips/position-chips.component";

@Component({
	selector: "si-matchup-dialog",
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		MatDividerModule,
		MatChipsModule,
		MatTooltipModule,
		MatCheckboxModule,
		PositionChipsComponent
	],
	templateUrl: "./matchup-dialog.component.html",
	styleUrl: "./matchup-dialog.component.scss",
	providers: [RankingService]
})
export class MatchupDialogComponent {
	readonly rankingService = inject(RankingService);

	readonly playerOne: PlayerRanking;
	readonly playerTwo: PlayerRanking;

	selected = signal<number>(-1);

	constructor(
		private dialogRef: MatDialogRef<MatchupDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { players: PlayerRanking[]; sport: string }
	) {
		this.playerOne = this.data.players[0];
		this.playerTwo = this.data.players[1];
	}

	submit(): void {
		this.rankingService
			.saveMatchupResult(this.data.sport, this.playerOne, this.playerTwo, this.selected())
			.subscribe((x) => this.dialogRef.close(true));
	}
}
