import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ILocation } from '../../../../interfaces/location.interface';
import {  NgFor } from '@angular/common';
import { SortableColumn } from '../../../../interfaces/sortable-column';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [
    NgFor,
    PaginatorComponent
  ],
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsListComponent {
  @Input() locations: ILocation[] = [];
  @Output() onSort = new EventEmitter<{active: string, direction: string}>();

  columnsToDisplay: SortableColumn[] = [
    {
      active: 'name',
      label: 'Name',
      direction: ''
    },
    {
      active: 'latitude',
      label: 'Latitude',
      direction: ''
    },
    {
      active: 'longitude',
      label: 'Longitude',
      direction: ''
    },
  ];

  // method to handle the sort event
  sortChange(index: number) {
    this.resetColumns(index);
    this.setActiveColumn(index);
  }

  // method to reset the direction of all columns except the active one
  resetColumns(i: number) {
    this.columnsToDisplay.forEach((column, index) => {
      if (index !== i) {
        column.direction = '';
      }
    });
  }
  // method to set the active column for styling column adn emi sort event
  setActiveColumn(index: number) {
    const column = this.columnsToDisplay[index];
    column.direction === '' || column.direction === 'desc' ? column.direction = 'asc' : column.direction = 'desc';
    this.onSort.emit(column);
  }
}
