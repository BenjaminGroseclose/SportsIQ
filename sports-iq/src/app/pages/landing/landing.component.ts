import { Component } from "@angular/core";
import { PositionChipsComponent } from "@sports-iq/components/position-chips/position-chips.component";

@Component({
	selector: "si-landing",
	imports: [PositionChipsComponent],
	templateUrl: "./landing.component.html",
	styleUrl: "./landing.component.scss"
})
export class LandingComponent {}
