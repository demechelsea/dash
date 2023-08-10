import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditUniverseComponent } from './Audit Universe/audit-universe/audit-universe.component';
import { NewAuditUniverseComponent } from './Audit Universe/new-audit-universe/newAccount.component';
import { AnnualPlanComponent } from './Annual plan/annual-plan/annual-plan.component';
import { NewAnnualPlanComponent } from './Annual plan/new-annual-plan/newAnnualPlan.component';
import { DashComponent } from './Audit Universe/dash/dash.component';
import { ChartComponent } from 'ng-apexcharts';
import { ChartsComponent } from 'src/app/views/charts/charts.component';
import { ChartComponents } from './Audit Universe/chart/chart.component';
import { UnusualChartComponents } from './Audit Universe/unusualBar/unusualBar.component';

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
        path: 'audit-universe',
        component: AuditUniverseComponent,
        data: {
          title: 'Audit Universe Table',
        },
      },
      {
        path: 'newAuditUniverse',
        component: NewAuditUniverseComponent,
        data: {
          title: 'New Audit Universe',
        },
      },
      {
        path: 'newAuditUniverse/:id',
        component: NewAuditUniverseComponent,
        data: {
          title: 'Update Audit Universe',
        },
      },
      {
        path: 'annual-plan',
        component: AnnualPlanComponent,
        data: {
          title: 'Annual Plan Table',
        },
      },
      {
        path: 'newAnnualPlan',
        component: NewAnnualPlanComponent,
        data: {
          title: 'New Annual Plan',
        },
      },
      {
        path: 'dash',
        component: DashComponent,
        data: {
          title: 'Dash',
        },
      },
      {
        path: 'chart',
        component: ChartComponents,
        data: {
          title: 'chart',
        },
      },
      {
        path: 'unUsual',
        component: UnusualChartComponents,
        data: {
          title: 'chart',
        },
      },
      {
        path: 'newAuditUniverse/:id',
        component: NewAuditUniverseComponent,
        data: {
          title: 'Update Audit Universe',
        },
      },
    ],
  },
];





@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AmsRoutingModule {
  }
  