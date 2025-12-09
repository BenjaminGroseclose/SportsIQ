import { Injectable } from "@angular/core";
import { BaseState, StateBase } from "@sports-iq/libs";

export interface IFilter {
    key: string;
    label: string;
    options: { value: number; label: string }[];
    selectedOptions: number[];
    isMultiple: boolean;
}

type FilterState = BaseState & {
   filters: IFilter[]; 
}

const initialFilterState: FilterState = {
    filters: [],
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
        const newFilters = this.state().filters.map(filter => ({
            ...filter,
            selectedOptions: [],
        }));

        this.patchState({ filters: newFilters });
    }
}