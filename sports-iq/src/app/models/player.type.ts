import { ISport } from './sport.type';
import { ITeam } from './team.type';
import { IPlayerStatus } from './player-status.type';

export interface IPlayer {
  playerID: number;
  firstName: string;
  lastName: string;
  playerName: string;
  sportID: number;
  sport: ISport;
  position: string;
  birthDate?: Date;
  college?: string;
  teamID?: number;
  team: ITeam | null;
  height?: string;
  weight?: number;
  statusID: number;
  status: IPlayerStatus;
  jerseyNumber?: number;
  rookieYear?: number;
  experienceYears?: number;
  externalPlayerID?: string;
}
