import { BaseState, StateServiceBase } from '@sports-iq/libs';
import { ISeason, ISport, ITeam } from '../models';
import { CoreService } from '../services';
import { inject } from '@angular/core/primitives/di';
import { forkJoin, take } from 'rxjs';
import { computed, Injectable } from '@angular/core';

type CoreState = BaseState & {
  sports: ISport[];
  seasons: ISeason[];
};

@Injectable({
  providedIn: 'root',
})
export class CoreStateService extends StateServiceBase<CoreState> {
  private readonly coreService = inject(CoreService);

  sports = computed(() => this.state().sports);
  seasons = computed(() => this.state().seasons);

  constructor() {
    super({
      sports: [],
      seasons: [],
      loading: false,
      loaded: false,
      error: null,
    });
  }

  public initialize(): void {
    this.patchState({ loading: true });

    forkJoin([this.coreService.getSports(), this.coreService.getAllSeasons()])
      .pipe(take(1))
      .subscribe({
        next: ([sports, seasons]) => {
          this.patchState({
            sports: sports,
            seasons: seasons,
            loaded: true,
            loading: false,
            error: null,
          });
        },
        error: (error) => {
          this.patchState({
            error: error.message,
            loading: false,
          });
        },
      });
  }
}
