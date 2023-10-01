import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { OrganizationalUnitService } from '../../../services/organizationalUnit-service/organizationalunit.service';
import { OrganizationalUnit } from '../../../models/organizationalunit';
import { SubProcessService } from '../../../services/subprocess-service/subprocess.service';
import { ProcessService } from '../../../services/process-service/process.service';
import { BranchService } from '../../../services/branch-service/branch.service';
import { DistrictService } from '../../../services/district-service/district.service';
import { SubProcess } from '../../../models/subProcess';
import { Process } from '../../../models/process';
import { StampService } from '../../../services/stamp-service/stamp.service';
import { StampDTO } from '../../../models/stamp';
import { Branch } from '../../../models/branch';
import { District } from '../../../models/district';

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
  public branchList: Branch[] = [];
  public districtList: District[] = [];

  public stampInfo: StampDTO = new StampDTO();
  selectedStampInfo: StampDTO;

  selectedFile: any;
  imageURL: string;

  public dropdownOptions = ['Organization unit', 'Sub Process', 'Process', 'Branch', 'District'];
  public selectedDropdown: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private messageService: MessageService,
    private organizationalUnitService: OrganizationalUnitService,
    private subProcessService: SubProcessService,
    private processService: ProcessService,
    private branchService: BranchService,
    private districtService: DistrictService,
    private stampService: StampService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.getOrganizationalUnitList();
    this.getProcessList();
    this.getSubProcessList();
    this.getDistrictList();
    this.getBranchList();
    if (this.config.data?.auditUniverse) {
      this.stampInfo = this.config.data.auditUniverse;
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

  getDistrictList(): void {
    this.districtService.getDistrictList().subscribe(
      (response: any) => {
        this.districtList = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  getBranchList(): void {
    this.branchService.getBranchList().subscribe(
      (response: any) => {
        this.branchList = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  addStamp(addDivForm: NgForm): void {
    const formData: any = new FormData();
    if (this.selectedDropdown === 'Organization unit') {
      formData.append('organizationUnitId', addDivForm?.value.organizationUnitId.id);
    } else if (this.selectedDropdown === 'Sub Process') {
      formData.append('subProcessId', addDivForm?.value.subProcessId.id);
    } else if (this.selectedDropdown === 'Process') {
      formData.append('processId', addDivForm?.value.processId.id);
    }
    else if (this.selectedDropdown === 'Branch') {
      formData.append('branchId', addDivForm?.value.branchId.id);
    }
    else if (this.selectedDropdown === 'District') {
      formData.append('districtId', addDivForm?.value.districtId.id);
    }
    
    if (this.selectedFile) {
      formData.append('stamp', this.selectedFile);
    }
  
    this.subscriptions.push(
      this.stampService.createStamp(formData).subscribe((response: any) => {
        this.messageService.clear();
        this.ref.close(response);
      })
    );
  }
  

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.imageURL = reader.result as string);

      reader.readAsDataURL(file);
    }
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
