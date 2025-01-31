import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, inject, input, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatsService } from '../../../services/stats.service';
import { INBAPlayer } from '../../../models';
import { of } from 'rxjs';

@Component({
  selector: 'si-nba-player-table',
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './nba-player-table.component.html',
  styleUrl: './nba-player-table.component.scss'
})
export class NBAPlayerTableComponent implements AfterViewInit {
	statsService = inject(StatsService)

	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

	year = input.required<number | null>()
	position = signal<string>("all");
	viewInit = signal<boolean>(false);

	dataSource = computed<MatTableDataSource<INBAPlayer, MatPaginator> | null>(() => {
		if (this.statsResource.status() !== 4 || !this.viewInit()) {
			return null;
		}

		this.statsResource.value();

		const dataSource = new MatTableDataSource<INBAPlayer>(this.statsResource.value());
		dataSource.paginator = this.paginator;

		return dataSource;
	})

	displayColumns = [
		"Name",
		"Position",
		"Age",
		"Team",
		"G / GS",
		"Points",
		"FG%",
		"3P%",
		"2P%",
		"eFG%",
		"FT%",
		"Rebounds",
		"Assists",
		"Steals",
		"Blocks",
		"Turnovers",
		"PF"
	];

  ngAfterViewInit() {
    this.viewInit.set(true);
  }

	statsResource = rxResource<INBAPlayer[], number | null>({
		request: () => { return  this.year(); },
		loader: ({ request }) => request == null ? of([]) : this.statsService.getPlayers<INBAPlayer>('nba', request)
	});
}
