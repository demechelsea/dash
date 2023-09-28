import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { SignatureDTO } from '../../../models/signature';
import { OrganizationalUnitService } from '../../../services/organizationalUnit-service/organizationalunit.service';
import { OrganizationalUnit } from '../../../models/organizationalunit';
import { SubProcessService } from '../../../services/subprocess-service/subprocess.service';
import { ProcessService } from '../../../services/process-service/process.service';
import { SubProcess } from '../../../models/subProcess';
import { Process } from '../../../models/process';
import { StampService } from '../../../services/stamp-service/stamp.service';

@Component({
  selector: 'newStamp',
  templateUrl: './newStamp.component.html',
  styleUrls: ['./newStamp.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewStampComponent implements OnDestroy {
  public organizationUnitList: OrganizationalUnit[] = [];
  public subProcessList: SubProcess[] = [];
  public processList: Process[] = [];

  public signatureInfo: SignatureDTO = new SignatureDTO();
  selectedUniverseInfo: SignatureDTO;

  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private organizationalUnitService: OrganizationalUnitService,
    private subProcessService: SubProcessService,
    private processService: ProcessService,
    private stampService: StampService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getOrganizationalUnitList();
    this.getProcessList();
    this.getSubProcessList();
    if (this.config.data?.auditUniverse) {
      this.signatureInfo = this.config.data.auditUniverse;
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
      this.stampService
        .createStamp(addDivForm.value)
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
