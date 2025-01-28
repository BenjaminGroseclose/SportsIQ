import { Component, Input } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: "si-root",
	imports: [RouterLink, RouterOutlet, MatToolbarModule, MatButtonModule, MatMenuModule],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss"
})
export class AppComponent {
	@Input() sport = "";

	constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
		this.matIconRegistry.addSvgIcon(
			"network_intelligence",
			this.domSanitizer.bypassSecurityTrustResourceUrl("svgs/network_intelligence.svg")
		);
	}
}
