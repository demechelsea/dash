import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CheckListService } from 'src/app/services/check-list/check-list.service';
import { CkeckListItemDTO } from 'src/app/views/models/checkListItem';
import { NewCheckListComponent } from '../new-checklist/newChecklist.component';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'checkList-table',
  templateUrl: './checkList.component.html',
  styleUrls: ['./checkList.component.scss'],
})
export class CheckListComponent implements OnDestroy {
  public checklist: CkeckListItemDTO[] = [];

  public auditableAreaR: CkeckListItemDTO[] = [];
  public auditableAreaInfo: CkeckListItemDTO;
  selectedAuditableAreaInfo: CkeckListItemDTO;

  private subscriptions: Subscription[] = [];

  constructor(
    private checkListService: CheckListService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getCheckLists();
  }

  getCheckLists(): void {
    this.subscriptions.push(
      this.checkListService.getChecklists().subscribe(
        (response: any) => {
          this.checklist = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  createNewChecklist(): void {
    const ref = this.dialogService.open(NewCheckListComponent, {
      header: 'Create a new checklist',
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.getCheckLists();
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

  updateChecklist(id: number): void {
    const checklist = this.checklist.find((check) => check.id === id);
    const ref = this.dialogService.open(NewCheckListComponent, {
      header: 'Update auditable area',
      width: '40%',
      data: { checklist },
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });
    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.checklist = this.checklist.map((check) =>
          check.id === response.id ? response : check
        );
        if (response.status) {
          this.getCheckLists();
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

  public getAuditableAreaInfo(id: number): CkeckListItemDTO[] {
    let auditObj = new CkeckListItemDTO();
    auditObj.id = id;
    this.subscriptions.push(
      this.checkListService
        .getCheckListInfo(auditObj)
        .subscribe((response: any) => {
          this.auditableAreaR = [response.result];
          this.auditableAreaInfo = response.result;
          this.selectedAuditableAreaInfo = this.auditableAreaInfo;
        })
    );
    return this.auditableAreaR;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
