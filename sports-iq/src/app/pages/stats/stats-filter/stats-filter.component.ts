import { CommonModule } from "@angular/common";
import { Component, EventEmitter, input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatChipsModule } from "@angular/material/chips";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { FilterColumn } from "@sports-iq/models";

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
		MatSlideToggleModule,
		MatTabsModule,
		MatButtonToggleModule
	],
	templateUrl: "./stats-filter.component.html",
	styleUrl: "./stats-filter.component.scss"
})
export class StatsFilterComponent {
	title = input.required<string>();
	columns = input.required<Map<string, FilterColumn>>();

	@Output() updateFilter = new EventEmitter<{ key: string; value: FilterColumn }>();

	setFilterWeight(columnName: string, event: any): void {
		const currentValue = this.columns().get(columnName)!!;
		this.updateFilter.emit({ key: columnName, value: { ...currentValue, weight: parseInt(event.target.value) } });
	}

	setFilterAsc(columnName: string, event: MatSlideToggleChange): void {
		const currentValue = this.columns().get(columnName)!!;
		this.updateFilter.emit({ key: columnName, value: { ...currentValue, isAsc: event.checked } });
	}

	setFilterDirection(columnName: string, event: MatButtonToggleChange): void {
		const currentValue = this.columns().get(columnName)!!;
		this.updateFilter.emit({ key: columnName, value: { ...currentValue, direction: event.value } });
	}

	setFilterValue(columnName: string, event: any): void {
		const currentValue = this.columns().get(columnName)!!;
		this.updateFilter.emit({ key: columnName, value: { ...currentValue, filterValue: parseInt(event.target.value) } });
	}
}
