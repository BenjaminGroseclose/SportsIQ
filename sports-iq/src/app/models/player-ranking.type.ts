import { IPlayer } from './player.type';

export interface IPlayerRanking {
  playerRankingID: number;
  playerID: number;
  player: IPlayer;
  rating: number;
  createDate: Date;
  lastModified: Date;
  ranking: number;
}
