import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { CheckListService } from 'src/app/services/check-list/check-list.service';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';
import { CkeckListItemDTO } from 'src/app/views/models/checkListItem';

@Component({
  selector: 'newChecklist',
  templateUrl: './newChecklist.component.html',
  styleUrls: ['./newChecklist.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewCheckListComponent implements OnDestroy {
  public auditableAreas: AuditableAreasDTO[] = [];

  public checklistR: CkeckListItemDTO[] = [];
  public checklistInfo: CkeckListItemDTO = new CkeckListItemDTO();

  selectedAuditableArea: AuditableAreasDTO;
  selectedChecklist: CkeckListItemDTO;

  update: boolean = false;
  newDiv: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private auditableAreaService: AuditableAreasService,
    private checkListService: CheckListService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getAuditableAreas();
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

  public getAuditableAreas(): void {
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
    this.subscriptions.push(
      this.checkListService
        .addCheckList(addDivForm.value)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  public updateChecklist(updateDivForm: NgForm): void {
    const checkList: CkeckListItemDTO = updateDivForm.value;
    checkList.id = this.checklistInfo.id;
    this.subscriptions.push(
      this.checkListService
        .updateCheckList(checkList)
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

  public closeDialog(): void {
    this.ref.close();
  }
}
