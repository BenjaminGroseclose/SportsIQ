import { Injectable, signal, computed, Signal } from '@angular/core';
import { ISeason, ISport } from '../models';

export type SportId = number | null;
export type SeasonId = number | null;

@Injectable({
  providedIn: 'root',
})
export class AppContextService {
  // Core app-wide context
  private readonly _sport = signal<ISport | null>(null);
  private readonly _season = signal<ISeason | null>(null);

  // Public readonly signals
  readonly sport = this._sport.asReadonly();
  readonly season = this._season.asReadonly();

  sportID = computed<number | null>(() => this._sport()?.sportID ?? null);
  seasonID = computed<number | null>(() => this._season()?.seasonID ?? null);

  // Convenience combined context if you ever need both at once
  readonly context = computed(() => ({
    sport: this._sport(),
    season: this._season(),
  }));

  // Minimal setters for when route/user selection changes
  setSport(sport: ISport | null): void {
    this._sport.set(sport);
  }

  setSeason(season: ISeason | null): void {
    this._season.set(season);
  }

  clearSeason(): void {
    this._season.set(null);
  }
}
