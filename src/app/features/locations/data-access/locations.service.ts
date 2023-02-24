import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILocation } from '../../../interfaces/location.interface';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { SortableColumn } from '../../../interfaces/sortable-column';
import { IPagination } from '../../../interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class
LocationsService {

  private sort = new BehaviorSubject<SortableColumn | null>(null);
  readonly sort$ = this.sort.asObservable();

  private pagination = new BehaviorSubject<{ page: number, size: number }>({ page: 1, size: 10 });
  readonly pagination$ = this.pagination.asObservable();

  private locations = new BehaviorSubject<ILocation[]>([]);
  readonly locations$ = this.locations.asObservable();

  readonly vm$: Observable<{
    data: ILocation[],
    pagination: IPagination
  }> = combineLatest([this.sort$, this.pagination$]).pipe(
    switchMap(([sort, pagination]) => {
      return this.locations$.pipe(
        map((locations) => this.paginator(locations, pagination.size, pagination.page)),
        map((paginated: ILocation[]) => !sort ?  paginated : this.sortPaginated(paginated, sort)),
        map((sorted: ILocation[]) => ({ data: sorted, pagination: {
            pages: this.paginationItems(),
            activePage: pagination.page
          } }))
      );
    }
  ));

  constructor() {
    this.getAllLocations().subscribe((locations) => this.locations.next(locations));
  }

  addLocation(location: ILocation) {
    this.locations.next([location, ...this.locations.getValue()]);
  }

  sortLocations(sort: SortableColumn) {
    this.sort.next(sort);
  }

  changePage(page: number) {
    this.pagination.next({ ...this.pagination.getValue(), page });
  }
  //
  // deleteLocation(location: ILocation) {
  //   this.locations.next(this.locations.getValue().filter((l) => l !== location));
  // }

  // editLocation(location: ILocation) {
  //   const locations = this.locations.getValue();
  //   const index = locations.findIndex((l) => l === location);
  //   locations[index] = location;
  //   this.locations.next(locations);
  // }

  private getAllLocations() {
    return inject(HttpClient).get<{
      name: string,
      coordinates: [number, number]
    }[]>('assets/locations.json')
      .pipe(
        map((locations) => locations.map((location) => {
          const [lat, lng] = location.coordinates;
          return {...location, coordinates: { lat, lng}};
      })));
  }

  private locationsLength() {
    return this.locations.getValue().length;
  }

  private sortPaginated(paginated: ILocation[], sort: SortableColumn) {
    return paginated.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'latitude': return this.compare(a.coordinates.lat, b.coordinates.lat, isAsc);
        case 'longitude': return this.compare(a.coordinates.lng, b.coordinates.lng, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private paginator(source: ILocation[], size: number, page: number) {
    return source.slice((page - 1) * size, page * size);
  }

  private paginationItems() {
    const rounded = Math.ceil(this.locationsLength() / this.pagination.getValue().size);
    return Array.from({ length: rounded }, (_, i) => i + 1);
  }
}
