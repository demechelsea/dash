import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../services/employee-service/employee.service';
import { SignatureService } from '../../../services/signature-service/signature.service';
import { SignatureDTO } from '../../../models/signature';
import { Employee } from '../../../models/employee';
import { OrganizationalUnitService } from '../../../services/organizationalUnit-service/organizationalunit.service';
import { SubProcessService } from '../../../services/subprocess-service/subprocess.service';
import { ProcessService } from '../../../services/process-service/process.service';
import { OrganizationalUnit } from '../../../models/organizationalunit';
import { SubProcess } from '../../../models/subProcess';
import { Process } from '../../../models/process';

@Component({
  selector: 'newAuthority',
  templateUrl: './newAuthority.component.html',
  styleUrls: ['./newAuthority.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuthorityComponent implements OnDestroy {
  public organizationUnitList: OrganizationalUnit[] = [];
  public subProcessList: SubProcess[] = [];
  public processList: Process[] = [];
  
  public authorityInfo: SignatureDTO = new SignatureDTO();
  selectedAuthorityInfo: SignatureDTO;

  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private signatureService: SignatureService,
    private organizationalUnitService: OrganizationalUnitService,
    private subProcessService: SubProcessService,
    private processService: ProcessService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getOrganizationalUnitList();
    this.getProcessList();
    this.getSubProcessList();
    if (this.config.data?.auditUniverse) {
      this.authorityInfo = this.config.data.auditUniverse;
    }
  }

  getOrganizationalUnitList(): void {
    this.organizationalUnitService.getOrganizationalUnitList().subscribe(
      (response: any) => {
        this.organizationUnitList = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  getProcessList(): void {
    this.processService.getProcessList().subscribe(
      (response: any) => {
        this.processList = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  getSubProcessList(): void {
    this.subProcessService.getSubProcessList().subscribe(
      (response: any) => {
        this.subProcessList = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  addSignature(addDivForm: NgForm): void {
    this.subscriptions.push(
      this.signatureService
        .createSignature(addDivForm.value)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  closeDialog(): void {
    this.ref.close();
  }
}
