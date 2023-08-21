import { Component, EventEmitter, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { RiskItemService } from 'src/app/services/risk-item/risk-item.service';
import { RiskItemDTO } from 'src/app/views/models/riskItemDTO';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'new-audit-universe',
  templateUrl: './risk-score.component.html',
  styleUrls: ['./risk-score.component.scss'],
})
export class RiskScoreComponent {
  riskScores: (RiskItemDTO & { selectedLikelihood: number | null; selectedImpact: number | null })[];
  savedRiskScores: { riskItem: any | null; frequency: number | null; impact: number | null }[] = [];

  newDiv: boolean = true;

  @Output() onSave = new EventEmitter<{ riskItem: any | null; frequency: number | null; impact: number | null }[]>();

  constructor(
    public ref: DynamicDialogRef,
    private riskItemService: RiskItemService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
     this.getRiskItems();
    if (this.savedRiskScores && this.riskScores) {
      this.riskScores.forEach((riskScore) => {
        const savedRiskScore = this.savedRiskScores.find(
          (item) => item.riskItem === riskScore.id
        );
        if (savedRiskScore) {
          riskScore.selectedLikelihood = savedRiskScore.frequency;
          riskScore.selectedImpact = savedRiskScore.impact;
        }
      });
    }
  }
  
  options: SelectItem[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
  ];

  getRiskItems() {
    this.riskItemService.getRiskItems().subscribe(
      (response: any) => {
        this.riskScores = response.result.map((riskScore: RiskItemDTO) => ({
          ...riskScore,
          selectedLikelihood: null,
          selectedImpact: null,
        }));
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
  

  saveRiskScores() {
    this.savedRiskScores = this.riskScores.map((riskScore) => ({
      riskItem: riskScore.id,
      frequency: riskScore.selectedLikelihood || 1,
      impact: riskScore.selectedImpact || 1,
    }));
    this.ref.close(this.savedRiskScores);
  }
  
}
