import { Component, inject } from '@angular/core';
import { FilterStateService } from '@sports-iq/app/state/filter-state.service';

@Component({
  selector: 'siq-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {
  private readonly filterStateService = inject(FilterStateService);
}
