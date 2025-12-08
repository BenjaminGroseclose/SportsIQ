import { Injectable } from "@angular/core";
import { BaseState, StateBase } from "@sports-iq/libs";


type FilterState = BaseState & {
    selectedSeason: number | null;
    selectedSport: number | null;
    selectedLeague: number | null;

    seasonOptions: number[];
    sportOptions: number[];
    leagueOptions: number[];
}

const initialFilterState: FilterState = {
    selectedSeason: null,
    selectedSport: null,
    selectedLeague: null,
    seasonOptions: [],
    sportOptions: [],
    leagueOptions: [],
    loading: false,
    loaded: false,
    error: null,
};

@Injectable({
    providedIn: 'root',
})
export class FilterStateService extends StateBase<FilterState> {
    constructor() {
        super(initialFilterState);
    }

    

    clearSelections() {
        this.patchState({ selectedLeague: null, selectedSeason: null, selectedSport: null });
    }
}