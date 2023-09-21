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
  riskScores: (RiskItemDTO & { name: string |null; selectedLikelihood: number | null; selectedImpact: number | null })[];
  savedRiskScores: { riskItem: any | null; frequency: number | null; impact: number | null }[] = [];

  newDiv: boolean = true;

  @Output() onSave = new EventEmitter<{ riskItem: any | null; frequency: number | null; impact: number | null }[]>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.riskScores = [];
  }
  
  options: SelectItem[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
  ];
  addRiskScore() {
    this.riskScores.push({
      id: 0, // replace with appropriate value
      encryptedId: '', // replace with appropriate value
      encryptedAssociationId: '', // replace with appropriate value
      createdUser: '', // replace with appropriate value
      modifiedUser: '', // replace with appropriate value
      createdTimestamp: '', // replace with appropriate value
      modifiedTimestamp: '', // replace with appropriate value
      name: '',
      strategicObjectiveLink: 0, // replace with appropriate value
      riskType: '', // replace with appropriate value
      selectedLikelihood: null,
      selectedImpact: null,
    });
  }

  deleteRiskScore(index: number) {
    this.riskScores.splice(index, 1);
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
