import { CommonModule } from "@angular/common";
import { Component, computed, input, Input, signal } from "@angular/core";
import { StatsService } from "../../services/stats.service";
import { SidenavComponent } from "../../components/sidenav/sidenav.component";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Observable, of, take } from "rxjs";
import { INBAPlayer } from "../../models/nba-player.model";
import { rxResource } from "@angular/core/rxjs-interop";

interface IRequest {
	sport: string;
	type: string;
	year: number | null;
}

@Component({
	selector: "si-stats",
	imports: [CommonModule, SidenavComponent, MatSelectModule, MatFormFieldModule, MatTableModule, MatProgressSpinnerModule],
	templateUrl: "./stats.component.html",
	styleUrl: "./stats.component.scss",
	providers: [StatsService]
})
export class StatsComponent {
	sport = input.required<string>();

	type = signal<string>("players");
	year = signal<number | null>(null);
	position = signal<string>("all");
	displayedColumns = computed<string[]>(() => {
		if (this.statsResource.status() != 4) {
			return [];
		}

		const data = this.statsResource.value() ?? [];

		if (data.length === 0) {
			return [];
		}

		return Object.keys(data[0]).filter((x) => x != "id");
	});

	statsResource = rxResource({
		request: (): IRequest => {
			return { sport: this.sport(), type: this.type(), year: this.year() };
		},

		loader: ({ request }) => this.fetchStats(request)
	});

	yearsResource = rxResource({
		request: (): string => {
			return this.sport();
		},
		loader: ({ request }) => this.statsService.getYears(request).pipe(take(1))
	});

	constructor(private statsService: StatsService) {}

	fetchStats(request: IRequest): Observable<any[]> {
		if (request.year == null) {
			return of([]);
		}

		if (request.type === "players") {
			return this.statsService.getPlayers<INBAPlayer>(request.sport, request.year);
		}

		return of([]);
	}
}
