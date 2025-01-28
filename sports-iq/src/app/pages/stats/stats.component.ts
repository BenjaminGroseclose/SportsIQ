import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, signal } from "@angular/core";
import { StatsService } from "../../services/stats.service";
import { SidenavComponent } from "../../components/sidenav/sidenav.component";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { combineLatest } from "rxjs";

@Component({
	selector: "si-stats",
	imports: [CommonModule, SidenavComponent, MatSelectModule, MatFormFieldModule, MatTableModule, MatProgressSpinnerModule],
	templateUrl: "./stats.component.html",
	styleUrl: "./stats.component.scss",
	providers: [StatsService]
})
export class StatsComponent implements OnInit {
	@Input() sport = "";

	type = signal<string>("players");
	year = signal<number>(-1);
	loading = signal<boolean>(true);
	displayedColumns = signal<string[]>([]);

	constructor(private statsService: StatsService) {
		console.log(this.sport);
	}

	ngOnInit(): void {
		// combineLatest([toObservable()])
	}
}
