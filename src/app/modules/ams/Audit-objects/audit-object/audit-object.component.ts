import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuditObjectService } from 'src/app/services/auditObject/auditObject.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';

@Component({
  selector: 'audit-universe-table',
  templateUrl: './audit-object.component.html',
  styleUrls: ['./audit-object.component.scss'],
})
export class AuditObjectComponent {
  public auditObject: AuditObjectDTO[] = [];

  public accounts: AuditUniverseDTO[] = [];
  public auditObjectR: AuditObjectDTO[] = [];
  public auditObjectInfo: AuditObjectDTO;
  selectedAuditObjectInfo: AuditObjectDTO;

  constructor(
    private auditObjectService: AuditObjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAuditObjects();
  }

  public getAuditObjects(): void {
    this.auditObjectService.getAuditObjects().subscribe(
      (response: any) => {
        this.auditObject = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  updateAuditObject(id: number): void {
    this.getAuditObjectInfo(id);
    this.router.navigate(['ams/newAuditObject', id]);
  }

  public getAuditObjectInfo(id: number): AuditObjectDTO[] {
    let auditObj = new AuditObjectDTO();
    auditObj.id = id;
    this.auditObjectService.getAuditObjectInfo(auditObj).subscribe(
      (response: any) => {
        console.log("rrr" , response);
        
        this.auditObjectR = [response.result];
        this.auditObjectInfo = response.result;
        this.selectedAuditObjectInfo = this.auditObjectInfo;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        setTimeout(() => {}, 1000);
      }
    );    
    return this.auditObjectR;
  }
}
