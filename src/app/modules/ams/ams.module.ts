import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditUniverseComponent } from './Audit Universe/audit-universe/audit-universe.component';
import { AnnualPlanComponent } from './Annual plan/annual-plan/annual-plan.component';
import { NewAnnualPlanComponent } from './Annual plan/new-annual-plan/newAnnualPlan.component';
import { RiskScoreComponent } from './Annual plan/risk-score/risk-score.component';
import { NewAuditUniverseComponent } from './Audit Universe/new-audit-universe/newAccount.component';
import { AmsRoutingModule } from './ams-routing.module';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule, BadgeModule, BreadcrumbModule, CardModule, CollapseModule, GridModule, UtilitiesModule, SharedModule, ListGroupModule, PlaceholderModule, ProgressModule, SpinnerModule, TabsModule, NavModule, TooltipModule, CarouselModule, FormModule, PaginationModule, PopoverModule, ToastModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DashComponent } from './/Audit Universe/dash/dash.component';
import { ChartComponents } from './/Audit Universe/chart/chart.component';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  declarations: [
    AuditUniverseComponent,
    AuditUniverseComponent,
    NewAuditUniverseComponent,
    AnnualPlanComponent,
    NewAnnualPlanComponent,
    RiskScoreComponent,
    DashComponent,
    ChartComponents
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
    ToastModule,
    MessagesModule

  ],
  //providers: [ConfirmationService, MessageService]
})
export class AmsModule { }
