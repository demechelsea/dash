import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewDivisonComponent } from './newDivision/newDivision.component';
import { DivisionTableComponent } from './divisionTable/divisionTable.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Division'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'divisionTable'
      },
      {
        path: 'newDivison',
        component: NewDivisonComponent,
        data: {
          title: 'New Divison'
        }
      },
      {
        path: 'divisionTable',
        component: DivisionTableComponent,
        data: {
          title: 'Division Table'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisonRoutingModule {
}
