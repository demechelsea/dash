import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { CheckListService } from 'src/app/services/check-list/check-list.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';
import { CkeckListItemDTO } from 'src/app/views/models/checkListItem';

@Component({
  selector: 'audit-universe-table',
  templateUrl: './checkList.component.html',
  styleUrls: ['./checkList.component.scss'],
})
export class CheckListComponent {
  public Checklists: CkeckListItemDTO[] = [];

  public auditableAreaR: CkeckListItemDTO[] = [];
  public auditableAreaInfo: CkeckListItemDTO;
  selectedAuditableAreaInfo: CkeckListItemDTO;

  constructor(
    private checkListService: CheckListService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCheckLists();
  }

  public getCheckLists(): void {
    this.checkListService.getChecklists().subscribe(
      (response: any) => {
        this.Checklists = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  updateAuditableObject(id: number): void {
    this.getAuditableAreaInfo(id);
    this.router.navigate(['ams/newAuditableArea', id]);
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
