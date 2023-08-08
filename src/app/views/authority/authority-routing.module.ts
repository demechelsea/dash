import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewAuthorityComponent } from './newAuthority/newAuthority.component';
import { AuthorityTableComponent } from './authorityTable/authorityTable.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Authority',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'authorityTable',
      },
      {
        path: 'newAuthority',
        component: NewAuthorityComponent,
        data: {
          title: 'New Authority',
        },
      },
      {
        path: 'authorityTable',
        component: AuthorityTableComponent,
        data: {
          title: 'Authority Table',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorityRoutingModule {}

