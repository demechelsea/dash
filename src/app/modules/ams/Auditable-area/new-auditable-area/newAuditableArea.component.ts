import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { AuditableAreasService } from 'src/app/services/auditableArea/auditableArea.service';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';

@Component({
  selector: 'newAuditObject',
  templateUrl: './newAuditableArea.component.html',
  styleUrls: ['./newAuditableArea.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditableAreaComponent {
  public auditableArea: AuditableAreasDTO[] = [];
  public auditObjectR: AuditableAreasDTO[] = [];
  public auditObjectInfo: AuditableAreasDTO;
  selectedAuditObjectInfo: AuditableAreasDTO;

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
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    var x = this.activatedRoute.snapshot.paramMap.get('id');
    if (x !== null) {
      this.idY = +x;
      if (this.idY) {
        this.getAuditObjectInfo(this.idY);
        this.update = true;
        this.newDiv = false;
      }
    }
  }

  public addAuditableArea(addDivForm: NgForm): void {
    this.auditableAreaService.addAuditableArea(addDivForm.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Auditable area created successfully',
          });
          setTimeout(() => {
            this.messageService.clear();
            this.router.navigate(['ams/auditable-area']);
          }, 1000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Failed to create auditable area',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 1000);
        }
      },
      (error: any) => {}
    );
  }

  public updateAuditableArea(updateDivForm: NgForm): void {
    this.auditableAreaService.updateAuditableAreas(updateDivForm.value).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Auditable area updated successfully',
        });
        setTimeout(() => {
          this.router.navigate(['ams/auditable-area']);
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Auditable area update failed',
        });
        setTimeout(() => {}, 1000);
      }
    );
  }

  public getAuditObjectInfo(id: number): AuditableAreasDTO[] {
    let sendAcc = new AuditableAreasDTO();
    sendAcc.id = id;
    this.auditableAreaService.getAuditableAreaInfo(sendAcc).subscribe(
      (response: any) => {
        this.auditObjectR = [response.result];
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
    return this.auditObjectR;
  }
}
