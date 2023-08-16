import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';
import { NewAuditableAreaComponent } from '../new-auditable-area/newAuditableArea.component';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'audit-universe-table',
  templateUrl: './auditable-area.component.html',
  styleUrls: ['./auditable-area.component.scss'],
  providers: [MessageService],
})
export class AuditableAreaComponent implements OnDestroy {
  public auditableArea: AuditableAreasDTO[] = [];

  public auditableAreaR: AuditableAreasDTO[] = [];
  public auditableAreaInfo: AuditableAreasDTO;
  selectedAuditableAreaInfo: AuditableAreasDTO;

  private subscriptions: Subscription[] = [];

  constructor(
    private auditableAreaService: AuditableAreasService,
    private router: Router,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAuditableAreas();
  }

  createNewAuditableArea(): void {
    const ref = this.dialogService.open(NewAuditableAreaComponent, {
      header: 'Create a new auditable area',
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((auditableArea: AuditableAreasDTO) => {
      if (auditableArea) {
        this.auditableArea = [...this.auditableArea, auditableArea];
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Auditable area created successfully',
        });
      }
    });
  }

  updateAuditableObject(id: number): void {
    const auditableArea = this.auditableArea.find((area) => area.id === id);
    const ref = this.dialogService.open(NewAuditableAreaComponent, {
      header: 'Update auditable area',
      width: '50%',
      data: { auditableArea },
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
    });
  
    ref.onClose.subscribe((updatedAuditableArea: AuditableAreasDTO) => {
      if (updatedAuditableArea) {
        this.auditableArea = this.auditableArea.map((area) =>
          area.id === updatedAuditableArea.id ? updatedAuditableArea : area
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Auditable area updated successfully',
        });
      }
    });
  }
  
  getAuditableAreas(): void {
    this.subscriptions.push(
      this.auditableAreaService.getAuditableAreas().subscribe(
        (response: any) => {
          this.auditableArea = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  public getAuditableAreaInfo(id: number): AuditableAreasDTO[] {
    let auditObj = new AuditableAreasDTO();
    auditObj.id = id;
    this.subscriptions.push(
      this.auditableAreaService.getAuditableAreaInfo(auditObj).subscribe(
        (response: any) => {
          this.auditableAreaR = [response.result];
          this.auditableAreaInfo = response.result;
          this.selectedAuditableAreaInfo = this.auditableAreaInfo;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          setTimeout(() => {}, 1000);
        }
      )
    );
    return this.auditableAreaR;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
