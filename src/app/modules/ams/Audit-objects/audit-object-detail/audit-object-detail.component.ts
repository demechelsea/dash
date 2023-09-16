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
import { ActivatedRoute, Router } from '@angular/router';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { TableRowSelectEvent } from 'primeng/table';

@Component({
  selector: 'audit-object-detail',
  templateUrl: './audit-object-detail.component.html',
  styleUrls: ['./audit-object-detail.component.scss'],
})
export class AuditObjectDetailComponent {
  public auditableArea: AuditableAreasDTO[] = [];
  public checklist: CkeckListItemDTO[] = [];

  public auditObject: AuditObjectDTO;

  private subscriptions: Subscription[] = [];

  constructor(
    private auditableAreaService: AuditableAreasService,
    private checkListService: CheckListService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.auditObject = navigation.extras.state['data'];
      console.log("jjjj", this.auditObject);
      
      const id = this.auditObject.id;
      this.getAuditableAreas(id);
    }
    //this.getCheckLists(1);
  }
  
  

  getAuditableAreas(id?: number): void {
    let auditObject = new AuditObjectDTO();
    auditObject.id = id as number;
    this.subscriptions.push(
      this.auditableAreaService.getAuditableAreasById(auditObject).subscribe(
        (response: any) => {
          this.auditableArea = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  onAuditableAreaSelect($event: TableRowSelectEvent) {
    if ($event.data) {
      const auditableArea: AuditableAreasDTO =
        $event.data as unknown as AuditableAreasDTO;
      this.getCheckLists(auditableArea.id);
    }
  }

  getCheckLists(id?: number): void {
    let auditableArea = new AuditableAreasDTO();
    auditableArea.id = id as number;
    this.subscriptions.push(
      this.checkListService.getChecklistsById(auditableArea).subscribe(
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
      this.getAuditableAreas(1);
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
        this.getCheckLists(1);
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
