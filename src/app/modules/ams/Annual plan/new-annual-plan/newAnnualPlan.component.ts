import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { RiskScoreComponent } from '../risk-score/risk-score.component';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'new-audit-plan',
  templateUrl: './newAnnualPlan.component.html',
  styleUrls: ['./newAnnualPlan.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class NewAnnualPlanComponent implements OnDestroy {
  public auditUniverses: AuditUniverseDTO[] = [];
  public annualPlanR: AnnualPlanDTO[] = [];
  public annualPlanInfo: AnnualPlanDTO = new AnnualPlanDTO();
  selectedAnnualPlanInfo: AnnualPlanDTO;

  private subscriptions: Subscription[] = [];

  savedRiskScores: {
    riskItem: any | null;
    frequency: number | null;
    impact: number | null;
  }[] = [];

  update: boolean = false;
  newDiv: boolean = true;

  constructor(
    private messageService: MessageService,
    private annualPlanService: AnnualPlanService,
    private auditUniverseService: AuditUniverseService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.getAuditUniverses();
    if (this.config.data?.annualPlan) {
      this.annualPlanInfo = this.config.data.annualPlan;
      this.update = true;
      this.newDiv = false;
    }
    if (this.config.data?.annualPlan) {
      this.annualPlanInfo = this.config.data.annualPlan;
    }
  }

  submitAuditableArea(auditableAreaForm: NgForm): void {
    if (this.update) {
      this.updateAnnualPlan(auditableAreaForm);
    } else {
      this.addAuditPlan(auditableAreaForm);
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

  getAuditUniverses(): void {
    this.subscriptions.push(
      this.auditUniverseService.getAuditUniverse().subscribe(
        (response: any) => {
          this.auditUniverses = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  addAuditPlan(addDivForm: NgForm): void {
    const annualPlanData: AnnualPlanDTO = {
      ...addDivForm.value,
      riskScores: this.savedRiskScores.map((riskScore) => ({
        riskItem: { id: riskScore.riskItem },
        frequency: riskScore.frequency,
        impact: riskScore.impact,
        total: null,
      })),
    };
    this.subscriptions.push(
      this.annualPlanService
        .addAnnualPlan(annualPlanData)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  updateAnnualPlan(updateDivForm: NgForm): void {
    const annualPlan: AnnualPlanDTO = updateDivForm.value;
    annualPlan.id = this.annualPlanInfo.id;
    this.subscriptions.push(
      this.annualPlanService
        .updateAnnualPlan(annualPlan)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  getAuditPlanInfo(id: number): AnnualPlanDTO[] {
    let sendAcc = new AnnualPlanDTO();
    sendAcc.id = id;
    this.subscriptions.push(
      this.annualPlanService
        .getAnnualPlanInfo(sendAcc)
        .subscribe((response: any) => {
          this.annualPlanR = [response.result];
          this.annualPlanInfo = response.result;
          this.selectedAnnualPlanInfo = this.annualPlanInfo;
        })
    );
    return this.annualPlanR;
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
