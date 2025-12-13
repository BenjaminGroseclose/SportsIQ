export interface IFilterOption {
  value: number;
  label: string;
  isSelected: boolean;
  data: any;
}

export interface IFilter {
  key: string;
  label: string;
  options: IFilterOption[];
  isMultiple: boolean;
  location: FilterLocation;
}

export enum FilterLocation {
  Side = 0,
  Top = 1,
}
