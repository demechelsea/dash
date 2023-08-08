import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewEmployeeComponent } from './newEmployee/newEmployee.component';
import { EmployeeTableComponent } from './employeeTable/employeeTable.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Employee'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'employeeTable'
      },
      {
        path: 'newEmployee',
        component: NewEmployeeComponent,
        data: {
          title: 'New Employee'
        }
      },
      {
        path: 'employeeTable',
        component: EmployeeTableComponent,
        data: {
          title: 'Employee Table'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
