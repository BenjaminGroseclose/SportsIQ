import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "si-position-chips",
	imports: [CommonModule],
	templateUrl: "./position-chips.component.html",
	styleUrl: "./position-chips.component.scss"
})
export class PositionChipsComponent {
	position = input.required<string>();

	color = computed<string>(() => {
		return "red";
	});
}
