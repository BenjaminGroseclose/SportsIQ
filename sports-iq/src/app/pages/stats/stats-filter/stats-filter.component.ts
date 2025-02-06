import { CommonModule } from "@angular/common";
import { Component, EventEmitter, input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
	selector: "si-stats-filter",
	imports: [CommonModule, MatSidenavModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule],
	templateUrl: "./stats-filter.component.html",
	styleUrl: "./stats-filter.component.scss"
})
export class StatsFilterComponent {
	title = input.required<string>();
	columns = input.required<Map<string, number>>();

	@Output() updateFilter = new EventEmitter<{ key: string; value: number }>();

	setFilter(columnName: string, event: any): void {
		this.updateFilter.emit({ key: columnName, value: Number(event.data) });
	}
}
