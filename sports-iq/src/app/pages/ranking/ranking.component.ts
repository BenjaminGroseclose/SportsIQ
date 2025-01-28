import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SidenavComponent } from "../../components/sidenav/sidenav.component";

@Component({
	selector: "si-ranking",
	imports: [CommonModule, SidenavComponent],
	templateUrl: "./ranking.component.html",
	styleUrl: "./ranking.component.scss"
})
export class RankingComponent {
	@Input() sport = "";

	constructor() {}
}
