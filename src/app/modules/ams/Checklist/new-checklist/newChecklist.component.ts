import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
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
  public auditableArea: AuditableAreasDTO[] = [];

  public checklistR: CkeckListItemDTO[] = [];
  public auditObjectInfo: AuditObjectDTO;
  selectedAuditObjectInfo: AuditObjectDTO;
  selectedAuditableArea: AuditableAreasDTO;

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
    private router: Router,
    private messageService: MessageService,
    private auditableAreaService: AuditableAreasService,
    private auditObjectService: AuditObjectService,
    private checkListService: CheckListService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getAuditObjects();
    this.getAuditableArea();
    var x = this.activatedRoute.snapshot.paramMap.get('id');
    if (x !== null) {
      this.idY = +x;
      if (this.idY) {
        this.getChecklistInfo(this.idY);
        this.update = true;
        this.newDiv = false;
      }
    }
  }

  public getAuditObjects(): void {
    this.auditObjectService.getAuditObjects().subscribe(
      (response: any) => {
        this.auditObjects = response.result;
      },
      (error: HttpErrorResponse) =>{
        console.log(error)
      }
      );
  }

  public getAuditableArea(): void {
    this.auditableAreaService.getAuditableAreas().subscribe(
      (response: any) => {
        this.auditableArea = response.result;
      },
      (error: HttpErrorResponse) =>{
        console.log(error)
      }
      );
  }

  public addChecklist(addDivForm: NgForm): void {
    console.log(addDivForm.value);
    
    this.checkListService.addCheckList(addDivForm.value).subscribe(
      (response: any) => {
        console.log("ooooooo", response);
        
        if (response.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Checklist created successfully',
          });
          setTimeout(() => {
            this.messageService.clear();
            this.router.navigate(['ams/checklist']);
          }, 1000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Failed to create Checklist',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 1000);
        }
      },
      (error: any) => {}
    );
  }

  public updateChecklist(updateDivForm: NgForm): void {
    this.checkListService.updateCheckList(updateDivForm.value).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Checklist updated successfully',
        });
        setTimeout(() => {
          this.router.navigate(['ams/checklist']);
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Checklist update failed',
        });
        setTimeout(() => {}, 1000);
      }
    );
  }

  public getChecklistInfo(id: number): CkeckListItemDTO[] {
    let sendAcc = new CkeckListItemDTO();
    sendAcc.id = id;
    this.checkListService.getCheckListInfo(sendAcc).subscribe(
      (response: any) => {
        this.checklistR = [response.result];
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
    return this.checklistR;
  }
}
