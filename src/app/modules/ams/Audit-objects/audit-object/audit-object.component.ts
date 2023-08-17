import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuditObjectService } from 'src/app/services/auditObject/auditObject.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { NewAuditObjectComponent } from '../new-audit-object/newAuditObject.component';

@Component({
  selector: 'audit-universe-table',
  templateUrl: './audit-object.component.html',
  styleUrls: ['./audit-object.component.scss'],
})
export class AuditObjectComponent {
  public auditObject: AuditObjectDTO[] = [];

  public auditObjectR: AuditObjectDTO[] = [];
  public auditObjectInfo: AuditObjectDTO;
  selectedAuditObjectInfo: AuditObjectDTO;

  private subscriptions: Subscription[] = [];

  constructor(
    private auditObjectService: AuditObjectService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAuditObjects();
  }

  getAuditObjects(): void {
    this.subscriptions.push(
      this.auditObjectService.getAuditObjects().subscribe(
        (response: any) => {
          this.auditObject = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  createAuditObject(): void {
    const ref = this.dialogService.open(NewAuditObjectComponent, {
      header: 'Create a new audit object',
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.getAuditObjects();
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

  updateAuditObject(id: number): void {
    const auditObject = this.auditObject.find((auditObj) => auditObj.id === id);
    const ref = this.dialogService.open(NewAuditObjectComponent, {
      header: 'Update auditable area',
      width: '40%',
      data: { auditObject },
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });
    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.auditObject = this.auditObject.map((auditObj) =>
          auditObj.id === response.id ? response : auditObj
        );
        if (response.status) {
          this.getAuditObjects();
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

  public getAuditObjectInfo(id: number): AuditObjectDTO[] {
    let auditObj = new AuditObjectDTO();
    auditObj.id = id;
    this.subscriptions.push(
      this.auditObjectService
        .getAuditObjectInfo(auditObj)
        .subscribe((response: any) => {
          this.auditObjectR = [response.result];
          this.auditObjectInfo = response.result;
          this.selectedAuditObjectInfo = this.auditObjectInfo;
        })
    );
    return this.auditObjectR;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
