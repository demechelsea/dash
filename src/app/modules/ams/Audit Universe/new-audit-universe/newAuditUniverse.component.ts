import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuditPlanService } from 'src/app/services/audit-type/audit-type.service';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AuditType } from 'src/app/views/models/auditType';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';

@Component({
  selector: 'newAuditUniverse',
  templateUrl: './newAuditUniverse.component.html',
  styleUrls: ['./newAuditUniverse.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditUniverseComponent implements OnDestroy {
  public auditTypes: AuditType[] = [];

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
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getAuditTypes();
    if (this.config.data?.auditUniverse) {
      this.universeInfo = this.config.data.auditUniverse;
      this.update = true;
      this.newDiv = false;
    }
    if (this.config.data?.auditUniverse) {
      this.universeInfo = this.config.data.auditUniverse;
    }
  }

  getAuditTypes(): void {
    this.auditTypeService.getAuditTypes().subscribe(
      (response: any) => {
        this.auditTypes = response.result.map((auditType: AuditType) => auditType.name);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }


  submitAuditableArea(auditableAreaForm: NgForm): void {
    if (this.update) {
      this.updateAuditUniverses(auditableAreaForm);
    } else {
      this.addAuditUniverse(auditableAreaForm);
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

  updateAuditUniverses(updateDivForm: NgForm): void {
    const auditUniverse: AuditUniverseDTO = updateDivForm.value;
    auditUniverse.id = this.universeInfo.id;
    this.subscriptions.push(
      this.auditUniverseService
        .updateAuditUniverse(auditUniverse)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  getAuditUniverseInfo(id: number): AuditUniverseDTO[] {
    let sendAcc = new AuditUniverseDTO();
    sendAcc.id = id;
    this.subscriptions.push(
      this.auditUniverseService
        .getAuditUniverseInfo(sendAcc)
        .subscribe((response: any) => {
          this.auditUniverseR = [response.result];
          this.universeInfo = response.result;
          this.selectedUniverseInfo = this.universeInfo;
        })
    );
    return this.auditUniverseR;
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
