import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, map } from "rxjs";

export function intercept(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	if (req.responseType === "json") {
		// If the expected response type is JSON then handle it here.

		req = req.clone({ responseType: "text" });
		// return handleJsonResponse(req, next);
		return next(req).pipe(map((event) => parseJsonResponse(event)));
	} else {
		return next(req);
	}
}

function parseJsonResponse(event: HttpEvent<unknown>): HttpEvent<unknown> {
	if (event instanceof HttpResponse && typeof event.body === "string" && event.body.length > 0) {
		return event.clone({ body: parse(event.body) });
	} else {
		return event;
	}
}

function parse(text: string): unknown {
	return JSON.parse(text, dateReviver);
}

function dateReviver(key: string, value: unknown) {
	if (typeof value === "string" && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*/.exec(value)) {
		return new Date(value);
	}

	if (value === "NaN") {
		return 0.0;
	}

	return value;
}
