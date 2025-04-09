import { Routes } from "@angular/router";
import { LandingComponent } from "./pages/landing/landing.component";
import { StatsComponent } from "./pages/stats/stats.component";
import { RankingComponent } from "./pages/ranking/ranking.component";

export const routes: Routes = [
	{
		path: "home",
		title: "Sports IQ - Home",
		component: LandingComponent
	},
	{
		path: ":sport/stats",
		title: "Sports IQ - Stats",
		component: StatsComponent
	},
	{
		path: ":sport/ranking",
		title: "Sports IQ - Ranking",
		component: RankingComponent
	},
	{ path: "", redirectTo: "/home", pathMatch: "full" }
];
