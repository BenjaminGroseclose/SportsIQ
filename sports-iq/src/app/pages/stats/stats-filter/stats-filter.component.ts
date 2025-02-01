import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatInputModule } from "@angular/material/input";

@Component({
	selector: "si-stats-filter",
	imports: [CommonModule, MatSidenavModule, MatButtonModule, MatFormFieldModule, MatInputModule],
	templateUrl: "./stats-filter.component.html",
	styleUrl: "./stats-filter.component.scss"
})
export class StatsFilterComponent {
	title = input.required<string>();
	columns = input.required<string[]>();
}
