import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, inject, input, signal, ViewChild } from "@angular/core";
import { SidenavComponent } from "../../components/sidenav/sidenav.component";
import { rxResource, toSignal } from "@angular/core/rxjs-interop";
import { PlayerRanking } from "@sports-iq/models";
import { take } from "rxjs";
import { RankingService, StatsService } from "@sports-iq/services";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatDialog } from "@angular/material/dialog";
import { MatchupDialogComponent } from "@sports-iq/components/matchup-dialog/matchup-dialog.component";

@Component({
	selector: "si-ranking",
	imports: [
		CommonModule,
		SidenavComponent,
		MatProgressSpinnerModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		MatTableModule,
		MatPaginatorModule,
		MatSelectModule
	],
	templateUrl: "./ranking.component.html",
	styleUrl: "./ranking.component.scss",
	providers: [RankingService, StatsService]
})
export class RankingComponent implements AfterViewInit {
	sport = input.required<string>();
	readonly rankingService = inject(RankingService);
	readonly statsService = inject(StatsService);
	readonly dialog = inject(MatDialog);

	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

	searchTerm = new FormControl<string>("");
	search = toSignal(this.searchTerm.valueChanges);
	viewInit = signal<boolean>(false);
	positions = signal<string[]>([]);

	dataSource = computed<MatTableDataSource<PlayerRanking, MatPaginator> | null>(() => {
		if (this.rankingResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		let ranking = this.rankingResource.value();
		const position = this.positions();
		const search = this.search();

		if (ranking == null) {
			return null;
		}

		if (position != null && position.length > 0) {
			ranking = ranking?.filter((x) => x.position != null && position.includes(x.position));
		}

		if (search != null && search.length > 0) {
			ranking = ranking.filter((x) => x.name.includes(search));
		}

		const dataSource = new MatTableDataSource<PlayerRanking>(ranking);
		dataSource.paginator = this.paginator;

		return dataSource;
	});

	rankingResource = rxResource<PlayerRanking[], string>({
		request: () => {
			return this.sport();
		},
		loader: ({ request }) => this.rankingService.getRanking(request).pipe(take(1))
	});

	positionResource = rxResource<string[], string>({
		request: () => {
			return this.sport();
		},
		loader: ({ request }) => this.statsService.getPositions(request).pipe(take(1))
	});

	displayColumns = ["Rank", "Name", "Age", "Position", "Rating", "Actions"];

	constructor() {}

	ngAfterViewInit(): void {
		this.viewInit.set(true);
	}

	openMatchupDialog(): void {
		console.log("openMatchupDialog");

		this.dialog.open(MatchupDialogComponent);
	}
}
