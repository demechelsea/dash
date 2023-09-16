import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuditPlanService } from 'src/app/services/audit-type/audit-type.service';
import { AuditObjectService } from 'src/app/services/auditObject/auditObject.service';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { AuditType } from 'src/app/views/models/auditType';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { NewAuditObjectComponent } from '../../Audit-objects/new-audit-object/newAuditObject.component';

@Component({
  selector: 'newAuditUniverse',
  templateUrl: './newAuditUniverse.component.html',
  styleUrls: ['./newAuditUniverse.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditUniverseComponent implements OnDestroy {
  public auditTypes: AuditType[] = [];
  public auditObjects: AuditObjectDTO[] = [];
  statusOptions: any;

  public auditUniverseR: AuditUniverseDTO[] = [];
  public universeInfo: AuditUniverseDTO = new AuditUniverseDTO();
  selectedUniverseInfo: AuditUniverseDTO;
  public selectedAuditType: any;

  private subscriptions: Subscription[] = [];

  update: boolean = false;
  newDiv: boolean = true;

  constructor(
    private messageService: MessageService,
    private auditUniverseService: AuditUniverseService,
    private auditTypeService: AuditPlanService,
    private auditObjectService: AuditObjectService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.getAuditTypes();
    this.getAuditObjects();
    if (this.config.data?.auditUniverse) {
      this.universeInfo = this.config.data.auditUniverse;   
      this.update = true;
      this.newDiv = false;
    }
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

  getAuditObjects(): void {
    this.auditObjectService.getAuditObjects().subscribe(
      (response: any) => {
        this.auditObjects = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

 
  

  createAuditObject(): void {
    const ref = this.dialogService.open(NewAuditObjectComponent, {
      header: 'Create a new audit object',
      draggable: true,
      width: '35%',
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

  submitAuditableArea(auditUniverseForm: NgForm): void {
    if (this.update) {
      this.updateAuditUniverses(auditUniverseForm);
    } else {
      this.addAuditUniverse(auditUniverseForm);
    }
  }

  addAuditUniverse(addDivForm: NgForm): void {
    this.subscriptions.push(
      this.auditUniverseService
        .addAuditUniverse(addDivForm.value)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  updateAuditUniverses(addDivForm: NgForm): void {
    const auditUniverse: AuditUniverseDTO = addDivForm.value;
    auditUniverse.id = this.universeInfo.id;
    auditUniverse.auditObject = this.universeInfo.auditObject;
    this.subscriptions.push(
      this.auditUniverseService
        .updateAuditUniverse(auditUniverse)
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
