import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuditObjectService } from 'src/app/services/auditObject/auditObject.service';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AuditPlanService } from 'src/app/services/audit-type/audit-type.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { AuditType } from 'src/app/views/models/auditType';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'newAuditObject',
  templateUrl: './newAuditObject.component.html',
  styleUrls: ['./newAuditObject.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditObjectComponent {
  public auditUniverses: AuditUniverseDTO[] = [];
  public auditTypes: AuditType[] = [];
  public auditType: AuditType;

  public auditObjectR: AuditObjectDTO[] = [];
  public auditObjectInfo: AuditObjectDTO = new AuditObjectDTO();
  selectedAuditObjectInfo: AuditObjectDTO;

  update: boolean = false;
  newDiv: boolean = true;

  constructor(
    private messageService: MessageService,
    private auditObjectService: AuditObjectService,
    private auditUniverseService: AuditUniverseService,
    private auditTypeService: AuditPlanService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getAuditUniverses();
    this.getAuditTypes();
    if (this.config.data?.auditObject) {
      this.auditObjectInfo = this.config.data.auditObject;
      this.update = true;
      this.newDiv = false;
    }
    if (this.config.data?.auditObject) {
      this.auditObjectInfo = this.config.data.auditObject;
    }
  }

  getAuditUniverses(): void {
    this.auditUniverseService.getAuditUniverse().subscribe(
      (response: any) => {
        this.auditUniverses = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  getAuditTypes(): void {
    this.auditTypeService.getAuditTypes().subscribe(
      (response: any) => {
        this.auditTypes = response.result.map(
          (auditType: AuditType) => auditType.name
        );
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  submitAuditObject(checklistForm: NgForm): void {
    if (this.update) {
      this.updateAuditObjects(checklistForm);
    } else {
      this.addAuditObject(checklistForm);
    }
  }

  addAuditObject(addDivForm: NgForm): void {
    this.auditObjectService
      .addAuditObject(addDivForm.value)
      .subscribe((response: any) => {
        this.messageService.clear();
        this.ref.close(response);
      });
  }

  updateAuditObjects(updateDivForm: NgForm): void {
    const auditObject: AuditObjectDTO = updateDivForm.value;
    auditObject.id = this.auditObjectInfo.id;
    this.auditObjectService
      .updateAuditObject(auditObject)
      .subscribe((response: any) => {
        this.messageService.clear();
        this.ref.close(response);
      });
  }

  getAuditObjectInfo(id: number): AuditObjectDTO[] {
    let sendAcc = new AuditObjectDTO();
    sendAcc.id = id;
    this.auditObjectService.getAuditObjectInfo(sendAcc).subscribe(
      (response: any) => {
        this.auditObjectR = [response.result];
        this.auditObjectInfo = response.result;
        this.selectedAuditObjectInfo = this.auditObjectInfo;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.message,
        });
        setTimeout(() => {}, 1000);
      }
    );
    return this.auditObjectR;
  }

  closeDialog(): void {
    this.ref.close();
  }
}
