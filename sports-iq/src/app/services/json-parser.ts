import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

@Injectable()
export abstract class JsonParser {
	abstract parse(text: string): unknown;
}

@Injectable()
export class JsonInterceptor implements HttpInterceptor {
	constructor(private jsonParser: JsonParser) {}

	intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		if (req.responseType === "json") {
			// If the expected response type is JSON then handle it here.
			return this.handleJsonResponse(req, next);
		} else {
			return next.handle(req);
		}
	}

	private handleJsonResponse(httpRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		// Override the responseType to disable the default JSON parsing.
		httpRequest = httpRequest.clone({ responseType: "text" });
		// Handle the response using the custom parser.
		return next.handle(httpRequest).pipe(map((event) => this.parseJsonResponse(event)));
	}

	private parseJsonResponse(event: HttpEvent<unknown>): HttpEvent<unknown> {
		if (event instanceof HttpResponse && typeof event.body === "string" && event.body.length > 0) {
			return event.clone({ body: this.jsonParser.parse(event.body) });
		} else {
			return event;
		}
	}
}

@Injectable()
export class SportsIQJsonParser implements JsonParser {
	parse(text: string): unknown {
		return JSON.parse(text, dateReviver);
	}
}

function dateReviver(key: string, value: unknown) {
	if (typeof value === "string" && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*/.exec(value)) {
		return new Date(value);
	}

	if (typeof value === "number" && !isNaN(value)) {
		return 0.0;
	}

	if (value === "NaN") {
		return 0.0;
	}

	return value;
}
