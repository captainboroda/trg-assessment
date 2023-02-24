import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILocation } from '../../../interfaces/location.interface';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { SortableColumn } from '../../../utils/sortable-column';
import { IPagination } from '../../../utils/pagination.interface';

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
    return inject(HttpClient).get<ILocation[]>('assets/locations.json');
  }

  private locationsLength() {
    return this.locations.getValue().length;
  }

  private sortPaginated(paginated: ILocation[], sort: SortableColumn) {
    return paginated.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'latitude': return this.compare(a.coordinates[0], b.coordinates[0], isAsc);
        case 'longitude': return this.compare(a.coordinates[1], b.coordinates[1], isAsc);
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
