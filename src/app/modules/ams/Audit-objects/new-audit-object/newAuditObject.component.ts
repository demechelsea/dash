import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { AuditObjectService } from 'src/app/services/auditObject/auditObject.service';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';

@Component({
  selector: 'newAuditObject',
  templateUrl: './newAuditObject.component.html',
  styleUrls: ['./newAuditObject.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditObjectComponent {
  public auditUniverses: AuditUniverseDTO[] = [];
  public auditObjectR: AuditObjectDTO[] = [];
  public auditObjectInfo: AuditObjectDTO;
  selectedAuditObjectInfo: AuditObjectDTO;

  states: any[] = [
    { name: 'Active', value: 'Active' },
    { name: 'Inactive', value: 'Inactive' },
  ];
  route?: ActivatedRoute;
  update: Boolean = false;
  newDiv: Boolean = true;
  public idY: number;
  uploadedFiles: any[] = [];
  msgs: Message[] = [];

  created: boolean = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private auditObjectService: AuditObjectService,
    private auditUniverseService: AuditUniverseService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getAuditUniverses();
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

  onSubmit(auditObjectForm: NgForm) {
    if (this.update) {
      this.updateAuditObjects(auditObjectForm);
    } else {
      this.addAuditObject(auditObjectForm);
    }
  }

  addAuditObject(addDivForm: NgForm): void {
    this.auditObjectService.addAuditObject(addDivForm.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Audit object created successfully',
          });
          setTimeout(() => {
            this.messageService.clear();
            this.router.navigate(['ams/audit-object']);
          }, 1000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Failed to create audit object',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 1000);
        }
      },
      (error: any) => {}
    );
  }

  public updateAuditObjects(updateDivForm: NgForm): void {
    alert('pppp');
    this.auditObjectService.updateAuditObject(updateDivForm.value).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Audit object updated successfully',
        });
        setTimeout(() => {
          this.router.navigate(['ams/audit-object']);
        }, 1000);
        this.getAuditUniverses();
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Audit object update failed',
        });
        setTimeout(() => {}, 1000);
      }
    );
  }

  public getAuditObjectInfo(id: number): AuditObjectDTO[] {
    let sendAcc = new AuditObjectDTO();
    sendAcc.id = id;
    this.auditObjectService.getAuditObjectInfo(sendAcc).subscribe(
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

  public getAuditUniverses(): void {
    this.auditUniverseService.getAuditUniverse().subscribe(
      (response: any) => {
        this.auditUniverses = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
}
