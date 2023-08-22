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

  update: boolean = false;
  newDiv: boolean = true;

  constructor(
    private messageService: MessageService,
    private auditScheduleService: AuditScheduleService,
    private auditPlanService: AnnualPlanService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getAnnualPlans();
    if (this.config.data?.auditSchedule) {
      this.scheduleInfo = this.config.data.auditSchedule;
      this.update = true;
      this.newDiv = false;
    }
    if (this.config.data?.auditSchedule) {
      this.scheduleInfo = this.config.data.auditSchedule;
    }
  }

  getAnnualPlans(): void {
    this.subscriptions.push(
      this.auditPlanService.getAnnualPlans().subscribe(
        (response: any) => {
          this.annualPlans = response.result;
          console.log(this.annualPlans);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  submitAuditSchedule(auditableAreaForm: NgForm): void {
    if (this.update) {
      this.updateAuditSchedule(auditableAreaForm);
    } else {
      this.addAuditSchedule(auditableAreaForm);
    }
  }

  addAuditSchedule(addDivForm: NgForm): void {
    this.subscriptions.push(
      this.auditScheduleService
        .addAuditSchedule(addDivForm.value)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
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
