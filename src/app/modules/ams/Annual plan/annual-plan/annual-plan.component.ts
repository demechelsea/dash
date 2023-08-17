import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { NewAnnualPlanComponent } from '../new-annual-plan/newAnnualPlan.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'annual-plan-table',
  templateUrl: './annual-plan.component.html',
  styleUrls: ['./annual-plan.component.scss'],
})
export class AnnualPlanComponent {
  public annualPlan: AnnualPlanDTO[] = [];
  public risk: AnnualPlanDTO[] = [];

  public auditAnnualR: AnnualPlanDTO[] = [];
  public annualInfo: AnnualPlanDTO;
  selectedAnnualInfo: AnnualPlanDTO;

  private subscriptions: Subscription[] = [];
  
  constructor(
    private annualPlanService: AnnualPlanService,
    private dialogService: DialogService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.getAnnualPlans();
  }

  getAnnualPlans(): void {
    this.annualPlanService.getAnnualPlans().subscribe(
      (response: any) => {
        this.annualPlan = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  createNewAnnualPlan(): void {
    const ref = this.dialogService.open(NewAnnualPlanComponent, {
      header: 'Create a new audit plan',
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.getAnnualPlans();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: response.message,
        });
      }
    });
  }

  updateAnnualPlan(id: number): void {
    const annualPlan = this.annualPlan.find(
      (plan) => plan.id === id
    );
    const ref = this.dialogService.open(NewAnnualPlanComponent, {
      header: 'Update annual plan',
      width: '40%',
      data: { annualPlan },
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.annualPlan = this.annualPlan.map((plan) =>
          plan.id === response.id ? response : plan
        );
        if (response.status) {
          this.getAnnualPlans();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: response.message,
          });
        }
      }
    });
  }

  getAuditAnnualInfo(id: number): AnnualPlanDTO[] {
    let auditUniv = new AnnualPlanDTO();
    auditUniv.id = id;
    this.annualPlanService.getAnnualPlanInfo(auditUniv).subscribe(
      (response: any) => {
        console.log('res', response);

        this.auditAnnualR = [response.result];
        this.annualInfo = response.result;
        this.selectedAnnualInfo = this.annualInfo;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        setTimeout(() => {}, 1000);
      }
    );
    return this.auditAnnualR;
  }
}
