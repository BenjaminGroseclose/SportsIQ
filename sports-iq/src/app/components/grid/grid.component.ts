import { Component, input } from "@angular/core";
import { IColumnConfig } from "./grid.type";

@Component({
	selector: "si-grid",
	imports: [],
	templateUrl: "./grid.component.html",
	styleUrl: "./grid.component.scss"
})
export class GridComponent {
	columns = input<IColumnConfig>();
	data = input.required<any[]>();
}
