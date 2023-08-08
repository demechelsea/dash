import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewUserComponent } from './newUser/newUser.component';
import { UserTableComponent } from './userTable/userTable.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'User',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'userTable',
      },
      {
        path: 'newUser',
        component: NewUserComponent,
        data: {
          title: 'New User',
        },
      },
      {
        path: 'userTable',
        component: UserTableComponent,
        data: {
          title: 'User Table',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}

