import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditUniverseComponent } from './Audit Universe/audit-universe/audit-universe.component';
import { AnnualPlanComponent } from './Annual plan/annual-plan/annual-plan.component';
import { NewAnnualPlanComponent } from './Annual plan/new-annual-plan/newAnnualPlan.component';
import { AuditObjectComponent } from './Audit-objects/audit-object/audit-object.component';
import { NewAuditObjectComponent } from './Audit-objects/new-audit-object/newAuditObject.component';
import { RiskScoreComponent } from './Annual plan/risk-score/risk-score.component';
import { NewAuditUniverseComponent } from './Audit Universe/new-audit-universe/newAuditUniverse.component';
import { AuditableAreaComponent } from './Auditable-area/auditable-area/auditable-area.component';
import { NewAuditableAreaComponent } from './Auditable-area/new-auditable-area/newAuditableArea.component';
import { NewCheckListComponent } from './Checklist/new-checklist/newChecklist.component';
import { CheckListComponent } from './Checklist/checklist/checkList.component';
import { NewAuditScheduleComponent } from './Audit-schedule/new-audit-schedule/newAuditSchedule.component';
import { AuditScheduleComponent } from './Audit-schedule/audit-schedule/audit-schedule.component';
import {CalendarModule} from 'primeng/calendar';

import { AmsRoutingModule } from './ams-routing.module';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  CardModule,
  CollapseModule,
  GridModule,
  UtilitiesModule,
  SharedModule,
  ListGroupModule,
  PlaceholderModule,
  ProgressModule,
  SpinnerModule,
  TabsModule,
  NavModule,
  TooltipModule,
  CarouselModule,
  FormModule,
  PaginationModule,
  PopoverModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';

import { COBHistoryComponent } from './Dashboards/cobHistory/cobHistory.component';
import { WeeklyElpasedTimeComponent } from './Dashboards/weeklyElpasedTime/weeklyElpasedTime.component';
import { MonthlyElpasedTimeComponent } from './Dashboards/monthlyElpasedTime/monthlyElpasedTime.component';
import { StageLineGraphComponent } from './Dashboards/stageLineGraph/stageLineGraph.component';
import { UnusualChartComponents } from './Dashboards/unusualJobs/unusualJobs.component';
import { JobMonthlyElpasedTimeComponent } from './Dashboards/jobGraph/jobGraph.component';
import { MonthlyJobHistoryComponent } from './Dashboards/monthlyJobHisory/monthlyJobHisory.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoGenerateAnnualPlanComponent } from './Annual plan/auto-geneerate-annualPlan/auto-generate-annualPlan.component';

@NgModule({
  declarations: [
    AuditUniverseComponent,
    NewAuditUniverseComponent,
    AnnualPlanComponent,
    NewAnnualPlanComponent,
    RiskScoreComponent,
    WeeklyElpasedTimeComponent,
    StageLineGraphComponent,
    UnusualChartComponents,
    COBHistoryComponent,
    AuditObjectComponent,
    NewAuditObjectComponent,
    AuditableAreaComponent,
    NewAuditableAreaComponent,
    NewCheckListComponent,
    CheckListComponent,
    NewAuditScheduleComponent,
    AuditScheduleComponent,
    MonthlyElpasedTimeComponent,
    JobMonthlyElpasedTimeComponent,
    MonthlyJobHistoryComponent,
    AutoGenerateAnnualPlanComponent
  ],
  imports: [
    NgApexchartsModule,
    DynamicDialogModule,
    CommonModule,
    AmsRoutingModule,
    ButtonModule,
    TableModule,
    FormsModule,
    CommonModule,
    FormsModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    GridModule,
    UtilitiesModule,
    SharedModule,
    ListGroupModule,
    IconModule,
    ListGroupModule,
    PlaceholderModule,
    ProgressModule,
    SpinnerModule,
    TabsModule,
    NavModule,
    TooltipModule,
    CarouselModule,
    FormModule,
    ReactiveFormsModule,
    DropdownModule,
    PaginationModule,
    PopoverModule,
    TableModule,
    InputTextModule,
    MessagesModule,
    ToastModule,
    CalendarModule
  ],
  providers: [ConfirmationService, MessageService, DialogService,DatePipe],
})
export class AmsModule {}
