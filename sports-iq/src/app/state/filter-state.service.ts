import { computed, inject, Injectable, Signal } from '@angular/core';
import { BaseState, StateBase } from '@sports-iq/libs';
import { CoreService } from '../services/core.service';
import { take } from 'rxjs/internal/operators/take';
import { FilterLocation, IFilter, IFilterOption } from '../models';

type FilterState = BaseState & {
  filters: IFilter[];
};

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
  private readonly coreService = inject(CoreService);

  selectedOptions = computed<{ key: string; selectedOptions: IFilterOption[] }[]>(() =>
    this.state().filters.map((x) => ({
      key: x.key,
      selectedOptions: x.options.filter((o) => o.isSelected),
    })),
  );

  public filters = computed<IFilter[]>(() => this.state().filters);
  public topFilters = computed(() =>
    this.filters()
      .filter((f) => f.location === FilterLocation.Top)
      .map((f) => {
        const selectedOptions = f.options.filter((o) => o.isSelected).map((o) => o.value);
        return { ...f, selectedOptions };
      }),
  );
  public sideFilters = computed<IFilter[]>(() =>
    this.filters()
      .filter((f) => f.location === FilterLocation.Side)
      .map((f) => {
        const selectedOptions = f.options.filter((o) => o.isSelected).map((o) => o.value);
        return { ...f, selectedOptions };
      }),
  );

  constructor() {
    super(initialFilterState);
  }

  initializeFilters(): void {
    this.coreService
      .getFilters()
      .pipe(take(1))
      .subscribe({
        next: (filters) => this.patchState({ filters }),
        error: (error) => this.patchState({ error: error.message }),
      });
  }

  selectMultipleOptions(key: string, values: number[]): void {
    const newFilters = this.filters().map((filter) => {
      if (filter.key !== key) {
        return filter;
      }

      const newOptions = filter.options.map((option) => {
        if (values.includes(option.value)) {
          return { ...option, isSelected: true };
        }

        return { ...option, isSelected: false };
      });

      return { ...filter, options: newOptions };
    });

    this.patchState({ filters: newFilters });
  }

  selectOption(key: string, value: number): void {
    const newFilters = this.filters().map((filter) => {
      if (filter.key !== key) {
        return filter;
      }

      const newOptions = filter.options.map((option) => {
        if (option.value === value) {
          return { ...option, isSelected: true };
        }

        return { ...option, isSelected: false };
      });

      return { ...filter, options: newOptions };
    });

    this.patchState({ filters: newFilters });
  }

  getSelectedOptions(key: string): Signal<number[]> {
    return computed<number[]>(() => {
      const filter = this.state().filters.find((f) => f.key === key);
      return filter ? filter.options.filter((o) => o.isSelected).map((o) => o.value) : [];
    });
  }

  getSelectedOption(key: string): Signal<number | null> {
    return computed<number | null>(() => {
      const filter = this.state().filters.find((f) => f.key === key);
      return filter?.options.find((o) => o.isSelected)?.value ?? null;
    });
  }

  clearSelections(): void {
    const newFilters = this.state().filters.map((filter) => ({
      ...filter,
      selectedOptions: [],
    }));

    this.patchState({ filters: newFilters });
  }
}
