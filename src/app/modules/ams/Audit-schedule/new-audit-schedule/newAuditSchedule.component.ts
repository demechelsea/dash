import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AuditScheduleService } from 'src/app/services/audit-schedule/audit-schedule.service';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { AuditScheduleDTO } from 'src/app/views/models/auditSchedule';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';

@Component({
  selector: 'newAuditUniverse',
  templateUrl: './newAuditSchedule.component.html',
  styleUrls: ['./newAuditSchedule.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditScheduleComponent implements OnDestroy {
  public annualPlans: AnnualPlanDTO[] = [];

  public auditUniverseR: AuditUniverseDTO[] = [];
  public scheduleInfo: AuditScheduleDTO = new AuditScheduleDTO();

  private subscriptions: Subscription[] = [];
  public dropdownOptions = ['1', '2', '3', '4'];
  public selectedDropdown: string;

  update: boolean = false;
  newDiv: boolean = true;

  annualPlan: AnnualPlanDTO;

  constructor(
    private messageService: MessageService,
    private auditScheduleService: AuditScheduleService,
    private auditPlanService: AnnualPlanService,
    private annualPlanService: AnnualPlanService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    if (this.config.data?.annualPlan) {
      this.annualPlan = this.config.data.annualPlan;      
      //this.update = true;
      this.newDiv = false;
    }
  }

  submitAuditSchedule(auditableAreaForm: NgForm): void {
    if (this.update) {
      this.updateAuditSchedule(auditableAreaForm);
    } else {
      this.addAuditSchedule(auditableAreaForm);
    }
  }

  addAuditSchedule(addDivForm: NgForm): void {
    const auditSchedule: AuditScheduleDTO = addDivForm.value;
    auditSchedule.annualPlan = this.annualPlan;
    this.subscriptions.push(
      this.annualPlanService.addToSchedule(auditSchedule).subscribe(
        (response: any) => {
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
    this.ref.close();
  }

  updateAuditSchedule(updateDivForm: NgForm): void {
    const auditSchedule: AuditScheduleDTO = updateDivForm.value;
    auditSchedule.id = this.scheduleInfo.id;
    this.subscriptions.push(
      this.auditScheduleService
        .updateAuditSchedule(auditSchedule)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  closeDialog(): void {
    this.ref.close();
  }
}
