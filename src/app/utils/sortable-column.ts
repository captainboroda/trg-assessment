export interface SortableColumn {
  active: string;
  label:string;
  direction: SortDirection;
}

export type SortDirection = 'asc' | 'desc' | '';
