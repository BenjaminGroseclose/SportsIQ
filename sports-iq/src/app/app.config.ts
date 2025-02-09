import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from "./app.routes";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { environment } from "../environments/environment";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { intercept } from "./services";

// console.log(environment)

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withComponentInputBinding()),
		// provideClientHydration(withEventReplay()),
		provideAnimationsAsync(),
		provideHttpClient(withFetch(), withInterceptors([intercept])),
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: {
				subscriptSizing: "dynamic"
			}
		}
	]
};
