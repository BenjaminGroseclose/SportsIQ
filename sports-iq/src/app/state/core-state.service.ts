import { BaseState } from "@sports-iq/libs";
import { ISport, ITeam } from "../models";

type CoreState = BaseState & {
	teams: ITeam[];
	sports: ISport[];
	seasons: 
};