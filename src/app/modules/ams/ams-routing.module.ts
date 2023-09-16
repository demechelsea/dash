import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditUniverseComponent } from './Audit Universe/audit-universe/audit-universe.component';
import { AnnualPlanComponent } from './Annual plan/annual-plan/annual-plan.component';
import { WeeklyElpasedTimeComponent } from './Dashboards/weeklyElpasedTime/weeklyElpasedTime.component';
import { AuditObjectComponent } from './Audit-objects/audit-object/audit-object.component';
import { AuditableAreaComponent } from './Auditable-area/auditable-area/auditable-area.component';
import { CheckListComponent } from './Checklist/checklist/checkList.component';
import { AuditScheduleComponent } from './Audit-schedule/audit-schedule/audit-schedule.component';
import { AuditObjectDetailComponent } from './Audit-objects/audit-object-detail/audit-object-detail.component';

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
        path: 'audit-object-detail',
        component: AuditObjectDetailComponent,
        data: {
          title: 'Audit Object detail',
        },
      },
      {
        path: 'audit-object-detail/:id',
        component: AuditObjectDetailComponent,
        data: {
          title: 'Audit Object detail',
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
        path: 'audit-schedule',
        component: AuditScheduleComponent,
        data: {
          title: 'Audit Schedule',
        },
      },

      {
        path: 'dash',
        component: WeeklyElpasedTimeComponent,
        data: {
          title: 'Dash',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmsRoutingModule { }
