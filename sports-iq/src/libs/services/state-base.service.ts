import { Signal, signal, WritableSignal } from '@angular/core';

export type BaseState = {
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

export class StateBase<T> {
  private _state: WritableSignal<T>;

  public state: Signal<T>;

  constructor(initialState: T) {
    this._state = signal<T>(initialState);
    this.state = this._state.asReadonly();
  }

  patchState(partialState: Partial<T>): void {
    this._state.update((currentState) => ({ ...currentState, ...partialState }));
  }
}
