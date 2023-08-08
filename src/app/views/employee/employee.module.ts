import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DocsComponentsModule } from '@docs-components/docs-components.module';
import { EmployeeRoutingModule } from './employee-routing.module';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';

import {
  ButtonGroupModule,
  CardModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  NavbarModule,
  NavModule,
  SharedModule,
  UtilitiesModule
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';
import { NewEmployeeComponent } from './newEmployee/newEmployee.component';
import { EmployeeTableComponent } from './employeeTable/employeeTable.component';

@NgModule({
  declarations: [
    NewEmployeeComponent,
    EmployeeTableComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ButtonModule,
    ButtonGroupModule,
    GridModule,
    IconModule,
    CardModule,
    UtilitiesModule,
    DropdownModule,
    SharedModule,
    FormModule,
    ReactiveFormsModule,
    DocsComponentsModule,
    NavbarModule,
    TableModule,
    CollapseModule,
    NavModule,
    TableModule,
    NavbarModule,
    InputTextModule
  ]
})
export class EmployeeModule {
}
