import { ISport } from './sport.type';

export interface ISeason {
  seasonID: number;
  year: number;
  sportID: number;
  sport: ISport;
  isCurrent: boolean;
}
