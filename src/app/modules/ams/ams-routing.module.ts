import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditUniverseComponent } from './Audit Universe/audit-universe/audit-universe.component';
import { NewAuditUniverseComponent } from './Audit Universe/new-audit-universe/newAuditUniverse.component';
import { AnnualPlanComponent } from './Annual plan/annual-plan/annual-plan.component';
import { NewAnnualPlanComponent } from './Annual plan/new-annual-plan/newAnnualPlan.component';
import { UnusualChartComponents } from './Dashboards/unusualBar/unusualBar.component';
import { WeeklyElpasedTimeComponent } from './Dashboards/weeklyElpasedTime/weeklyElpasedTime.component';
import { StageLineGraphComponent } from './Dashboards/stageLineGraph/stageLineGraph.component';
import { AuditObjectComponent } from './Audit-objects/audit-object/audit-object.component';
import { NewAuditObjectComponent } from './Audit-objects/new-audit-object/newAuditObject.component';

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
        path: 'audit-object',
        component: AuditObjectComponent,
        data: {
          title: 'Audit Object Table',
        },
      },
      {
        path: 'newAuditObject',
        component: NewAuditObjectComponent,
        data: {
          title: 'New Audit Object',
        },
      },
      {
        path: 'newAuditObject/:id',
        component: NewAuditObjectComponent,
        data: {
          title: 'Update Audit Object',
        },
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
        component: WeeklyElpasedTimeComponent,
        data: {
          title: 'Dash',
        },
      },
      {
        path: 'chart',
        component: StageLineGraphComponent,
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
  exports: [RouterModule],
})
export class AmsRoutingModule {}
