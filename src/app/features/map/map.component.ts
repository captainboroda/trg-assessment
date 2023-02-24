import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ILocation } from '../../interfaces/location.interface';
import { LocationsService } from '../locations/data-access/locations.service';
import { IMarker } from '../../interfaces/marker.interface';
import { SidebarDirective } from './UI/sidebar.directive';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, SidebarDirective],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {

  // @ts-ignore
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @Input() data: ILocation[] = [];
  options: google.maps.MapOptions = {
    center: {lat: 35.05292100674326, lng: 33.18887268761972},
    zoom: 7
  };
  private readonly locationsService = inject(LocationsService);
  locations$: Observable<ILocation[]> = this.locationsService.locations$;
  markers$: Observable<IMarker[]>
  infoContent: string | null = null;

  isSideBarOpen = false;
  selectedMarker: MapMarker | null = null;

  constructor() {
    this.markers$ = this.locations$.pipe(
      map((locations) => {
        return locations.map((location) => {
          const {lat, lng} = location.coordinates;
          return {
            position: { lat, lng },
            title: location.name
          };
        });
      })
    )
  }

  openInfo(marker: MapMarker) {
    this.selectedMarker = marker;
    this.infoWindow.open(marker);
    if (!this.isSideBarOpen) {
      this.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }
}
