import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { AnnualPlanComponent } from '../annual-plan/annual-plan.component';
import { RiskScoreComponent } from '../risk-score/risk-score.component';

@Component({
  selector: 'new-audit-universe',
  templateUrl: './newAnnualPlan.component.html',
  styleUrls: ['./newAnnualPlan.component.scss'],
  providers: [MessageService, ConfirmationService,DialogService],
})
export class NewAnnualPlanComponent {
  public auditUniverses: AuditUniverseDTO[] = [];
  public auditUniverseR: AuditUniverseDTO[] = [];
  public universeInfo: AuditUniverseDTO;
  selectedUniverseInfo: AuditUniverseDTO;

  ref: DynamicDialogRef | undefined;
  
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
    private auditUniverseService: AuditUniverseService,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.getAuditUniverses();
    var x = this.activatedRoute.snapshot.paramMap.get('id');
    if (x !== null) {
      this.idY = +x;
      if (this.idY) {
        this.getAuditUniverseInfo(this.idY);
        this.update = true;
        this.newDiv = false;
      }
    }
  }

  show() {
    this.ref = this.dialogService.open(RiskScoreComponent, { header: 'Risk score', width: '50%',});
}

  public getAuditUniverses(): void {
    this.auditUniverseService.getAuditUniverse().subscribe(
      (response: any) => {
        this.auditUniverses = response.result;
      },
      (error: HttpErrorResponse) =>{
        console.log(error)
      }
      );
  }

  public addAuditUniverse(addDivForm: NgForm): void {
    this.auditUniverseService.addAuditUniverse(addDivForm.value).subscribe(
      (response: any) => {
        this.getAuditUniverses();
        if (response.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Audit universe created successfully',
          });
          setTimeout(() => {
            this.messageService.clear();
            this.router.navigate(['ams/audit-universe']);
          }, 1000);
          this.getAuditUniverses();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Failed to create audit universe',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 1000);
        }
      },
      (error: any) => {}
    );
  }
  
  

  public updateAuditUniverses(updateDivForm: NgForm): void {
    this.auditUniverseService
      .updateAuditUniverse(updateDivForm.value)
      .subscribe(
        (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Audit universe updated successfully',
          });
          setTimeout(() => {
            this.router.navigate(['ams/audit-universe']);
          }, 1000);
          this.getAuditUniverses();
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Audit universe update failed',
          });
          setTimeout(() => {}, 1000);
        }
      );
  }

  public getAuditUniverseInfo(id: number): AuditUniverseDTO[] {
    let sendAcc = new AuditUniverseDTO();
    sendAcc.id = id;
    this.auditUniverseService.getAuditUniverseInfo(sendAcc).subscribe(
      (response: any) => {
        this.auditUniverseR = [response.result];
        this.universeInfo = response.result;
        this.selectedUniverseInfo = this.universeInfo;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Faild',
          detail: error.message,
        });
        setTimeout(() => {}, 1000);
      }
    );
    return this.auditUniverseR;
  }
}
