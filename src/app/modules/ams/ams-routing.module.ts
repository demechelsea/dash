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
import { NewAuditableAreaComponent } from './Auditable-area/new-auditable-area/newAuditableArea.component';
import { AuditableAreaComponent } from './Auditable-area/auditable-area/auditable-area.component';
import { NewCheckListComponent } from './Checklist/new-checklist/newChecklist.component';
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
        path: 'checklist',
        component: CheckListComponent,
        data: {
          title: 'Checklist Table',
        },
      },
      {
        path: 'newCkeckList',
        component: NewCheckListComponent,
        data: {
          title: 'New Checklist',
        },
      },
      {
        path: 'newCkeckList/:id',
        component: NewCheckListComponent,
        data: {
          title: 'Update Checklist',
        },
      },

      {
        path: 'auditable-area',
        component: AuditableAreaComponent,
        data: {
          title: 'Auditable Area Table',
        },
      },

      {
        path: 'newCkeckList',
        component: NewAuditableAreaComponent,
        data: {
          title: 'New Checklist',
        },
      },
      {
        path: 'checklist',
        component: AuditableAreaComponent,
        data: {
          title: 'Checklist Table',
        },
      },
      {
        path: 'newCkeckList/:id',
        component: NewAuditableAreaComponent,
        data: {
          title: 'Update Checklist',
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
        path: 'newAnnualPlan/:id',
        component: NewAnnualPlanComponent,
        data: {
          title: 'Update Annual Plan',
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
