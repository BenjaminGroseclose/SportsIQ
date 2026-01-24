import { IContractYear } from './contract-year.type';
import { IPlayer } from './player.type';

export interface IContract {
  contractID: number;
  playerID: number;
  player: IPlayer | null;
  yearSigned: number;
  years: number;
  totalValue: number;
  averageSalary: number;
  guaranteedMoney: number;
  isActive: boolean;
  sourceUrl: string;
  contractYears: IContractYear[];
  createDate: Date;
  lastModified: Date | null;
}
