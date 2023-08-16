import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CheckListService } from 'src/app/services/check-list/check-list.service';
import { CkeckListItemDTO } from 'src/app/views/models/checkListItem';
import { NewCheckListComponent } from '../new-checklist/newChecklist.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'audit-universe-table',
  templateUrl: './checkList.component.html',
  styleUrls: ['./checkList.component.scss'],
  providers: [MessageService],
})
export class CheckListComponent {
  public checklist: CkeckListItemDTO[] = [];

  public auditableAreaR: CkeckListItemDTO[] = [];
  public auditableAreaInfo: CkeckListItemDTO;
  selectedAuditableAreaInfo: CkeckListItemDTO;

  constructor(
    private checkListService: CheckListService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getCheckLists();
  }

  createNewChecklist(): void {
    const ref = this.dialogService.open(NewCheckListComponent, {
      header: 'Create a new checklist',
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((checklist: CkeckListItemDTO) => {
      if (checklist) {
        this.checklist = [...this.checklist, checklist];
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Checklist created successfully',
        });
      }
    });
  }

  public getCheckLists(): void {
    this.checkListService.getChecklists().subscribe(
      (response: any) => {
        this.checklist = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  updateChecklist(id: number): void {
    const checklist = this.checklist.find((check) => check.id === id);
    const ref = this.dialogService.open(NewCheckListComponent, {
      header: 'Update auditable area',
      width: '40%',
      data: { checklist },
      contentStyle: {'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });
    ref.onClose.subscribe((updatedChecklist: CkeckListItemDTO) => {
      if (updatedChecklist) {
        this.checklist = this.checklist.map((area) =>
          area.id === updatedChecklist.id ? updatedChecklist : area
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Checklist updated successfully',
        });
      }
    });
  }

  public getAuditableAreaInfo(id: number): CkeckListItemDTO[] {
    let auditObj = new CkeckListItemDTO();
    auditObj.id = id;
    this.checkListService.getCheckListInfo(auditObj).subscribe(
      (response: any) => {
        this.auditableAreaR = [response.result];
        this.auditableAreaInfo = response.result;
        this.selectedAuditableAreaInfo = this.auditableAreaInfo;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        setTimeout(() => {}, 1000);
      }
    );
    return this.auditableAreaR;
  }
}
