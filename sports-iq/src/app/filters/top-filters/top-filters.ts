import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FilterStateService } from '@sports-iq/app/state/filter-state.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'siq-top-filters',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './top-filters.html',
  styleUrl: './top-filters.scss',
})
export class TopFilters {
  private readonly filterStateService = inject(FilterStateService);

  public topFilters = this.filterStateService.topFilters;

  onFilterChange(key: string, selectedValue: any, isMultiple: boolean): void {
    if (isMultiple) {
      this.filterStateService.selectMultipleOptions(key, selectedValue);
    } else {
      this.filterStateService.selectOption(key, selectedValue);
    }
  }
}
