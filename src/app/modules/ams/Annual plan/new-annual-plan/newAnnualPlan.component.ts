import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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
export class NewAnnualPlanComponent implements OnDestroy, AfterContentChecked {
  public annualPlanR: AnnualPlanDTO[] = [];
  public annualPlanInfo: AnnualPlanDTO = new AnnualPlanDTO();
  selectedAnnualPlanInfo: AnnualPlanDTO;

  riskScoreDialogRef: DynamicDialogRef;

  private subscriptions: Subscription[] = [];
  years: string[] = [];

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
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    public dialogService: DialogService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.generateYears();
    if (this.config.data?.annualPlan) {
      this.annualPlanInfo = this.config.data.annualPlan;
      this.update = true;
      this.newDiv = false;
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  generateYears() {
    for (let i = 2024; i <= 2050; i++) {
      this.years.push(`${i}/${i + 1}`);
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
    this.riskScoreDialogRef = this.dialogService.open(RiskScoreComponent, {
      header: 'Risk score',
      width: '60%',
      data: { savedRiskScores: this.savedRiskScores },
    });
    this.riskScoreDialogRef.onClose.subscribe((savedRiskScores) => {
      if (savedRiskScores) {
        this.savedRiskScores = savedRiskScores;
        this.cdref.detectChanges();
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

  addAuditPlan(addDivForm: NgForm): void {    
    this.annualPlanInfo = {
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
        .addAnnualPlan(this.annualPlanInfo)
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

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  closeDialog(): void {
    this.ref.close();
  }
}
