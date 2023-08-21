import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';
import { Subscription } from 'rxjs';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { AuditObjectService } from 'src/app/services/auditObject/auditObject.service';

@Component({
  selector: 'newAuditObject',
  templateUrl: './newAuditableArea.component.html',
  styleUrls: ['./newAuditableArea.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditableAreaComponent implements OnDestroy {
  public auditObjects: AuditObjectDTO[] = [];

  public auditObjectR: AuditableAreasDTO[] = [];
  public auditAreaInfo: AuditableAreasDTO = new AuditableAreasDTO();
  selectedAuditObjectInfo: AuditableAreasDTO;

  update: boolean = false;
  newDiv: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private auditableAreaService: AuditableAreasService,
    private auditObjectService: AuditObjectService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getAuditObjects();
    if (this.config.data?.auditableArea) {
      this.auditAreaInfo = this.config.data.auditableArea;
      this.update = true;
      this.newDiv = false;
    }
  }

  public submitAuditableArea(auditableAreaForm: NgForm): void {
    if (this.update) {
      this.updateAuditableArea(auditableAreaForm);
    } else {
      this.addAuditableArea(auditableAreaForm);
    }
  }

  public getAuditObjects(): void {
    this.auditObjectService.getAuditObjects().subscribe(
      (response: any) => {
        this.auditObjects = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  addAuditableArea(addDivForm: NgForm): void {
    this.subscriptions.push(
      this.auditableAreaService
        .addAuditableArea(addDivForm.value)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  updateAuditableArea(updateDivForm: NgForm): void {
    const auditableArea: AuditableAreasDTO = updateDivForm.value;
    console.log("bak", auditableArea);
    auditableArea.id = this.auditAreaInfo.id;
    this.subscriptions.push(
      this.auditableAreaService
        .updateAuditableAreas(auditableArea)
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
