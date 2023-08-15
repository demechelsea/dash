import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';

@Component({
  selector: 'audit-universe-table',
  templateUrl: './auditable-area.component.html',
  styleUrls: ['./auditable-area.component.scss'],
})
export class AuditableAreaComponent {
  public auditableArea: AuditableAreasDTO[] = [];

  public auditableAreaR: AuditableAreasDTO[] = [];
  public auditableAreaInfo: AuditableAreasDTO;
  selectedAuditableAreaInfo: AuditableAreasDTO;

  constructor(
    private auditableAreaService: AuditableAreasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAuditableAreas();
  }

  public getAuditableAreas(): void {
    this.auditableAreaService.getAuditableAreas().subscribe(
      (response: any) => {
        console.log("bbb", response);
        
        this.auditableArea = response.result;
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

  public getAuditableAreaInfo(id: number): AuditableAreasDTO[] {
    let auditObj = new AuditableAreasDTO();
    auditObj.id = id;
    this.auditableAreaService.getAuditableAreaInfo(auditObj).subscribe(
      (response: any) => {
        console.log("tttt", response);
        
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
