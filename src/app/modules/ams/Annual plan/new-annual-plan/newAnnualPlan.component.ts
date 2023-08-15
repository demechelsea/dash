import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { RiskScoreComponent } from '../risk-score/risk-score.component';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';

@Component({
  selector: 'new-audit-plan',
  templateUrl: './newAnnualPlan.component.html',
  styleUrls: ['./newAnnualPlan.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class NewAnnualPlanComponent {
  public auditUniverses: AuditUniverseDTO[] = [];
  public annualPlanR: AnnualPlanDTO[] = [];
  public annualPlanInfo: AnnualPlanDTO;
  selectedAnnualPlanInfo: AnnualPlanDTO;

  ref: DynamicDialogRef | undefined;
  savedRiskScores: {
    riskItem: any | null;
    frequency: number | null;
    impact: number | null;
  }[] = [];

  states: any[] = [
    { name: 'Active', value: 'Active' },
    { name: 'Inactive', value: 'Inactive' },
  ];
  route?: ActivatedRoute;
  update: Boolean = false;
  newDiv: Boolean = true;
  public idY: number;
  uploadedFiles: any[] = [];
  msgs: Message[] = [];

  created: boolean = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private annualPlanService: AnnualPlanService,
    private auditUniverseService: AuditUniverseService,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.getAnnualPlans();
    var x = this.activatedRoute.snapshot.paramMap.get('id');
    if (x !== null) {
      this.idY = +x;
      if (this.idY) {
        this.getAuditPlanInfo(this.idY);
        this.update = true;
        this.newDiv = false;
      }
    }
  }

  show() {
    this.ref = this.dialogService.open(RiskScoreComponent, {
      header: 'Risk score',
      width: '50%',
      data: { savedRiskScores: this.savedRiskScores },
    });
    this.ref.onClose.subscribe((savedRiskScores) => {
      if (savedRiskScores) {
        this.savedRiskScores = savedRiskScores;
      }
    });
  }

  onSave(
    savedRiskScores: {
      riskItem: any | null;
      frequency: number | null;
      impact: number | null;
    }[]
  ) {
    this.savedRiskScores = savedRiskScores;
    this.ref?.close();
  }

  public getAnnualPlans(): void {
    this.auditUniverseService.getAuditUniverse().subscribe(
      (response: any) => {
        this.auditUniverses = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  public addAuditPlan(addDivForm: NgForm): void {
    const annualPlanData: AnnualPlanDTO = {
      ...addDivForm.value,
      riskScores: this.savedRiskScores.map((riskScore) => ({
        riskItem: { id: riskScore.riskItem },
        frequency: riskScore.frequency,
        impact: riskScore.impact,
        total: null,
      })),
    };
    this.annualPlanService.addAnnualPlan(annualPlanData).subscribe(
      (response: any) => {
        this.getAnnualPlans();
        if (response.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Annual plan created successfully',
          });
          setTimeout(() => {
            this.messageService.clear();
            this.router.navigate(['ams/annual-plan']);
          }, 1000);
          this.getAnnualPlans();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Failed to create annual plan',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 1000);
        }
      },
      (error: any) => {}
    );
  }

  public updateAnnualPlan(updateDivForm: NgForm): void {
    this.annualPlanService.updateAnnualPlan(updateDivForm.value).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Annual plan updated successfully',
        });
        setTimeout(() => {
          this.router.navigate(['ams/annual-plan']);
        }, 1000);
        this.getAnnualPlans();
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Annual plan update failed',
        });
        setTimeout(() => {}, 1000);
      }
    );
  }

  public getAuditPlanInfo(id: number): AnnualPlanDTO[] {
    let sendAcc = new AnnualPlanDTO();
    sendAcc.id = id;
    this.annualPlanService.getAnnualPlanInfo(sendAcc).subscribe(
      (response: any) => {
        this.annualPlanR = [response.result];
        this.annualPlanInfo = response.result;
        this.selectedAnnualPlanInfo = this.annualPlanInfo;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Faild',
          detail: error.message,
        });
        setTimeout(() => {}, 1000);
      }
    );
    return this.annualPlanR;
  }
}
