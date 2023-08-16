import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';
import { Subscription } from 'rxjs';

@Component({
  selector: 'newAuditObject',
  templateUrl: './newAuditableArea.component.html',
  styleUrls: ['./newAuditableArea.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditableAreaComponent implements OnDestroy {
  public auditableArea: AuditableAreasDTO[] = [];
  public auditObjectR: AuditableAreasDTO[] = [];
  public auditObjectInfo: AuditableAreasDTO = new AuditableAreasDTO();
  selectedAuditObjectInfo: AuditableAreasDTO;

  states: any[] = [
    { name: 'Active', value: 'Active' },
    { name: 'Inactive', value: 'Inactive' },
  ];
  route?: ActivatedRoute;
  update: Boolean = false;
  newDiv: Boolean = true;
  public idY: number;
  msgs: Message[] = [];

  created: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private auditableAreaService: AuditableAreasService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    if (this.config.data?.auditableArea) {
      this.auditObjectInfo = this.config.data.auditableArea;
      this.update = true;
      this.newDiv = false;
    }
    if (this.config.data?.auditableArea) {
      this.auditObjectInfo = this.config.data.auditableArea;
    }
  }

  public submitAuditableArea(auditableAreaForm: NgForm): void {
    if (this.update) {
      this.updateAuditableArea(auditableAreaForm);
    } else {
      this.addAuditableArea(auditableAreaForm);
    }
  }

  public addAuditableArea(addDivForm: NgForm): void {
    this.subscriptions.push(
      this.auditableAreaService
        .addAuditableArea(addDivForm.value)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response.result);
        })
    );
  }

  public updateAuditableArea(updateDivForm: NgForm): void {
    const auditableArea: AuditableAreasDTO = updateDivForm.value;
    auditableArea.id = this.auditObjectInfo.id;
    this.subscriptions.push(
      this.auditableAreaService
        .updateAuditableAreas(auditableArea)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response.result);
        })
    );
  }

  public getAuditObjectInfo(id: number): AuditableAreasDTO[] {
    let sendAcc = new AuditableAreasDTO();
    sendAcc.id = id;
    this.subscriptions.push(
      this.auditableAreaService.getAuditableAreaInfo(sendAcc).subscribe(
        (response: any) => {
          this.auditObjectR = [response.result];
          this.auditObjectInfo = response.result;
          this.selectedAuditObjectInfo = this.auditObjectInfo;
        },
      )
    );
    return this.auditObjectR;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
