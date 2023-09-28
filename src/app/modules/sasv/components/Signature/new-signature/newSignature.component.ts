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

@Component({
  selector: 'newSignature',
  templateUrl: './newSignature.component.html',
  styleUrls: ['./newSignature.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewSignatureComponent implements OnDestroy {
  public employeeslist: Employee[] = [];

  public signatureInfo: SignatureDTO = new SignatureDTO();
  selectedUniverseInfo: SignatureDTO;

  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private signatureService: SignatureService,
    private emploteeService: EmployeeService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getEmployeeslist();
    if (this.config.data?.auditUniverse) {
      this.signatureInfo = this.config.data.auditUniverse;
    }
  }

  getEmployeeslist(): void {
    this.emploteeService.getEmployeesList().subscribe(
      (response: any) => {
        this.employeeslist = response.result;
        console.log(response);
        
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
