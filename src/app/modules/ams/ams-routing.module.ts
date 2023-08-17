import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditUniverseComponent } from './Audit Universe/audit-universe/audit-universe.component';
import { AnnualPlanComponent } from './Annual plan/annual-plan/annual-plan.component';
import { UnusualChartComponents } from './Dashboards/unusualBar/unusualBar.component';
import { WeeklyElpasedTimeComponent } from './Dashboards/weeklyElpasedTime/weeklyElpasedTime.component';
import { StageLineGraphComponent } from './Dashboards/stageLineGraph/stageLineGraph.component';
import { AuditObjectComponent } from './Audit-objects/audit-object/audit-object.component';
import { NewAuditObjectComponent } from './Audit-objects/new-audit-object/newAuditObject.component';
import { AuditableAreaComponent } from './Auditable-area/auditable-area/auditable-area.component';
import { CheckListComponent } from './Checklist/checklist/checkList.component';

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
          title: 'Audit Object',
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
          title: 'Audit Universe',
        },
      },

      {
        path: 'checklist',
        component: CheckListComponent,
        data: {
          title: 'Checklist',
        },
      },

      {
        path: 'auditable-area',
        component: AuditableAreaComponent,
        data: {
          title: 'Auditable Area',
        },
      },

      {
        path: 'annual-plan',
        component: AnnualPlanComponent,
        data: {
          title: 'Annual Plan',
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmsRoutingModule {}
