import { Routes } from '@angular/router';
import { EmployeeTableComponent } from './table/table.component';
import { NestedTableComponent } from './tree-table';

export const routes: Routes = [
  {
    path: 'te',
    component: EmployeeTableComponent,
  },
  {
    path: 'tt',
    component: NestedTableComponent,
  },
];
