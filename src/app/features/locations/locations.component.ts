import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLocationFormComponent } from './UI/add-location-form/add-location-form.component';
import { LocationsListComponent } from './UI/locations-list/locations-list.component';
import { LocationsService } from './data-access/locations.service';
import { ILocation } from '../../interfaces/location.interface';
import { SortableColumn } from '../../utils/sortable-column';
import { PaginatorComponent } from './UI/paginator/paginator.component';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule,
    AddLocationFormComponent,
    LocationsListComponent,
    PaginatorComponent
  ],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {

  private locationService = inject(LocationsService);
  readonly vm$ = this.locationService.vm$

  onAdd(event: any) {
    this.locationService.addLocation(event as ILocation);
  }

  onSort(event: any) {
    this.locationService.sortLocations(event as SortableColumn);
  }

  onPageChange(event: any) {
    this.locationService.changePage(event as number);
  }
}
