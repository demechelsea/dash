import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { CkeckListItemDTO } from 'src/app/views/models/checkListItem';
import { CheckListService } from 'src/app/services/check-list/check-list.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { NewAuditableAreaComponent } from '../../Auditable-area/new-auditable-area/newAuditableArea.component';
import { NewCheckListComponent } from '../../Checklist/new-checklist/newChecklist.component';


@Component({
  selector: 'audit-object-detail',
  templateUrl: './audit-object-detail.component.html',
  styleUrls: ['./audit-object-detail.component.scss'],
})
export class AuditObjectDetailComponent {
  public auditableArea: AuditableAreasDTO[] = [];
  public checklist: CkeckListItemDTO[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private auditableAreaService: AuditableAreasService,
    private checkListService: CheckListService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAuditableAreas();
    this.getCheckLists();
  }


  getAuditableAreas(): void {
    this.subscriptions.push(
      this.auditableAreaService.getAuditableAreas().subscribe(
        (response: any) => {
          this.auditableArea = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
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

  createNewAuditableArea(): void {
    const ref = this.dialogService.open(NewAuditableAreaComponent, {
      header: 'Create a new auditable area',
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      this.getAuditableAreas();
      if (response.status) {
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


  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
