import { CommonModule } from "@angular/common";
import { Component, inject, input, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { Router, RouterModule } from "@angular/router";
import { MatDividerModule } from "@angular/material/divider";

@Component({
	selector: "si-sidenav",
	imports: [CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, RouterModule, MatDividerModule],
	templateUrl: "./sidenav.component.html",
	styleUrl: "./sidenav.component.scss"
})
export class SidenavComponent {
	router = inject(Router);

	sport = input.required<string>();

	navigate(path: string[]) {
		console.log(path)
		this.router.navigate([this.sport(), ...path]);
	}
}
