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

@Component({
  selector: 'new-audit-universe',
  templateUrl: './newAnnualPlan.component.html',
  styleUrls: ['./newAnnualPlan.component.scss'],
  providers: [MessageService, ConfirmationService,DialogService],
})
export class NewAnnualPlanComponent {
  public auditUniverses: AuditUniverseDTO[] = [];
  public auditUniverseR: AuditUniverseDTO[] = [];
  public universeInfo: AuditUniverseDTO;
  selectedUniverseInfo: AuditUniverseDTO;

  ref: DynamicDialogRef | undefined;
  savedRiskScores: { riskItem: any | null; frequency: number | null; impact: number | null }[] = [];
  
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
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.getAnnualPlans();
    var x = this.activatedRoute.snapshot.paramMap.get('id');
    if (x !== null) {
      this.idY = +x;
      if (this.idY) {
        this.getAuditUniverseInfo(this.idY);
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
  
  onSave(savedRiskScores: { riskItem: any | null; frequency: number | null; impact: number | null }[]) {
    this.savedRiskScores = savedRiskScores;
    console.log("Saved risk scores:", this.savedRiskScores);
    this.ref?.close();
  }

  public getAnnualPlans(): void {
    this.annualPlanService.getAnnualPlans().subscribe(
      (response: any) => {
        this.auditUniverses = response.result;
      },
      (error: HttpErrorResponse) =>{
        console.log(error)
      }
      );
  }

  public addAuditUniverse(addDivForm: NgForm): void {
    const annualPlanData: AnnualPlanDTO = {
      ...addDivForm.value,
      riskScores: this.savedRiskScores.map(riskScore => ({
        riskItem: { id: riskScore.riskItem },
        frequency: riskScore.frequency,
        impact: riskScore.impact,
        total: null,
      }))
    };
    console.log("Annual plan data:", annualPlanData);
    
    this.annualPlanService.addAnnualPlan(annualPlanData).subscribe(
      (response: any) => {
        console.log("Response:", response);
        
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
    this.annualPlanService
      .updateAnnualPlan(updateDivForm.value)
      .subscribe(
        (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Audit universe updated successfully',
          });
          setTimeout(() => {
            this.router.navigate(['ams/audit-universe']);
          }, 1000);
          this.getAnnualPlans();
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Audit universe update failed',
          });
          setTimeout(() => {}, 1000);
        }
      );
  }

  public getAuditUniverseInfo(id: number): AuditUniverseDTO[] {
    let sendAcc = new AnnualPlanDTO();
    sendAcc.id = id;
    this.annualPlanService.getAnnualPlanInfo(sendAcc).subscribe(
      (response: any) => {
        this.auditUniverseR = [response];
        this.universeInfo = response;
        this.selectedUniverseInfo = this.universeInfo;
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
    return this.auditUniverseR;
  }
}
