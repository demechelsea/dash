import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';

import {
  ButtonGroupModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  SharedModule
} from '@coreui/angular';

import { DocsComponentsModule } from '@docs-components/docs-components.module';

import { DivisonRoutingModule } from './division-routing.module';
import { NewDivisonComponent } from './newDivision/newDivision.component';
import { DivisionTableComponent } from './divisionTable/divisionTable.component';
import {TableModule} from 'primeng/table';


@NgModule({
  declarations: [
    NewDivisonComponent,
    DivisionTableComponent,
  ],
  imports: [
    CommonModule,
    DivisonRoutingModule,
    DocsComponentsModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    DropdownModule,
    SharedModule,
    ListGroupModule,
    TableModule,
    InputTextModule
  ]
})
export class DivisionModule {
}
