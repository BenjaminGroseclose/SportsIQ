import { CommonModule } from "@angular/common";
import { Component, EventEmitter, input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatChipsModule } from "@angular/material/chips";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
	selector: "si-stats-filter",
	imports: [
		CommonModule,
		MatSidenavModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatTooltipModule,
		MatChipsModule,
		MatSlideToggleModule
	],
	templateUrl: "./stats-filter.component.html",
	styleUrl: "./stats-filter.component.scss"
})
export class StatsFilterComponent {
	title = input.required<string>();
	columns = input.required<Map<string, { weight: number; isAsc: boolean }>>();

	@Output() updateFilterWeight = new EventEmitter<{ key: string; value: number }>();
	@Output() updateFilterAsc = new EventEmitter<{ key: string; value: boolean }>();

	setFilterWeight(columnName: string, event: any): void {
		this.updateFilterWeight.emit({ key: columnName, value: Number(event.target.value) });
	}

	setFilterAsc(columnName: string, event: any): void {
		console.log(event);
		this.updateFilterWeight.emit({ key: columnName, value: event.value });
	}
}
