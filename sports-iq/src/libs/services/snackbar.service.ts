import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly _snackbar = inject(MatSnackBar);

  showSuccess(
    message: string,
    actionLabel: string = 'OK',
    duration: number = 3000,
  ): MatSnackBarRef<MatSnackBarLabel & MatSnackBarActions> {
    return this._snackbar.open(message, actionLabel, {
      duration,
      panelClass: ['snackbar-success'],
    });
  }

  showInfo(
    message: string,
    actionLabel: string = 'OK',
    duration: number = 3000,
  ): MatSnackBarRef<MatSnackBarLabel & MatSnackBarActions> {
    return this._snackbar.open(message, actionLabel, {
      duration,
      panelClass: ['snackbar-info'],
    });
  }

  showError(
    message: string,
    actionLabel: string = 'OK',
    duration: number = 5000,
  ): MatSnackBarRef<MatSnackBarLabel & MatSnackBarActions> {
    return this._snackbar.open(message, actionLabel, {
      duration,
      panelClass: ['snackbar-error'],
    });
  }
}
