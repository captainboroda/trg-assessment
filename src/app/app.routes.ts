import { Routes } from '@angular/router';


export const APP_ROUTES: Routes = [
  { path: '',
    redirectTo: 'locations',
    pathMatch: 'full'
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./features/map/map.component').then(({MapComponent}) => MapComponent),
  },
  {
    path: 'locations',
    loadComponent: () =>
      import('./features/locations/locations.component').then(({LocationsComponent}) => LocationsComponent),
  },
  {
    path: '**',
    redirectTo: 'locations'
  }
];
