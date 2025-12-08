import { computed, Signal, signal, WritableSignal } from '@angular/core';

export type BaseState = {
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

export class StateBase<T extends BaseState> {
  private readonly _state: WritableSignal<T>;
  private readonly _initialState: T;

  public state: Signal<T>;
  public loading = computed(() => this.state().loading);
  public loaded = computed(() => this.state().loaded);
  public error = computed(() => this.state().error);

  constructor(initialState: T) {
    this._state = signal<T>(initialState);
    this.state = this._state.asReadonly();
    this._initialState = initialState;
  }

  patchState(partialState: Partial<T>): void {
    this._state.update((currentState) => ({ ...currentState, ...partialState }));
  }

  clearState(): void {
    this._state.set(this._initialState);
  }
}
