import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuditObjectService } from 'src/app/services/auditObject/auditObject.service';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { CheckListService } from 'src/app/services/check-list/check-list.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';
import { CkeckListItemDTO } from 'src/app/views/models/checkListItem';

@Component({
  selector: 'newAuditObject',
  templateUrl: './newChecklist.component.html',
  styleUrls: ['./newChecklist.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewCheckListComponent {
  public auditObjects: AuditObjectDTO[] = [];
  public auditableAreas: AuditableAreasDTO[] = [];

  public checklist: AuditObjectDTO[] = [];
  public checklistR: CkeckListItemDTO[] = [];
  public checklistInfo: CkeckListItemDTO = new CkeckListItemDTO();

  selectedAuditObjectInfo: AuditObjectDTO;
  selectedAuditableArea: AuditableAreasDTO;
  selectedChecklist: CkeckListItemDTO;

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

  constructor(
    private messageService: MessageService,
    private auditableAreaService: AuditableAreasService,
    private auditObjectService: AuditObjectService,
    private checkListService: CheckListService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getAuditObjects();
    this.getAuditableArea();
    if (this.config.data?.checklist) {
      this.checklistInfo = this.config.data.checklist;
      this.update = true;
      this.newDiv = false;
    }
    if (this.config.data?.checklist) {
      this.checklistInfo = this.config.data.checklist;
    }
  }

  public submitChecklist(checklistForm: NgForm): void {
    if (this.update) {
      this.updateChecklist(checklistForm);
    } else {
      this.addChecklist(checklistForm);
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

  public getAuditableArea(): void {
    this.auditableAreaService.getAuditableAreas().subscribe(
      (response: any) => {
        this.auditableAreas = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  public addChecklist(addDivForm: NgForm): void {
    this.checkListService
      .addCheckList(addDivForm.value)
      .subscribe((response: any) => {
        console.log(response);
        
        this.messageService.clear();
        this.ref.close(response.result);
      });
  }

  public updateChecklist(updateDivForm: NgForm): void {
    const checkList: CkeckListItemDTO = updateDivForm.value;
    checkList.id = this.checklistInfo.id;
    this.checkListService
      .updateCheckList(updateDivForm.value)
      .subscribe((response: any) => {
        this.messageService.clear();
        this.ref.close(response.result);
      });
  }

  public getChecklistInfo(id: number): CkeckListItemDTO[] {
    let sendAcc = new CkeckListItemDTO();
    sendAcc.id = id;
    this.checkListService.getCheckListInfo(sendAcc).subscribe(
      (response: any) => {
        this.checklistR = [response.result];
        this.checklistInfo = response.result;
        this.selectedChecklist = this.checklistInfo;
      },
    );
    return this.checklistR;
  }
}
