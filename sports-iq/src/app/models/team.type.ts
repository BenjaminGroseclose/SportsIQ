import { ISport } from './sport.type';

export interface ITeam {
  teamID: number;
  name: string;
  city: string;
  abbreviation: string;
  sportID: number;
  sport: ISport;
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
}
