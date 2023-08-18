import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { NewAnnualPlanComponent } from '../new-annual-plan/newAnnualPlan.component';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'annual-plan-table',
  templateUrl: './annual-plan.component.html',
  styleUrls: ['./annual-plan.component.scss'],
})
export class AnnualPlanComponent {
  public annualPlan: AnnualPlanDTO[] = [];
  public risk: AnnualPlanDTO[] = [];

  public annualPlanDisplay: any[] = [];

  public auditAnnualR: AnnualPlanDTO[] = [];
  public annualInfo: AnnualPlanDTO;
  selectedAnnualInfo: AnnualPlanDTO;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  private subscriptions: Subscription[] = [];

  constructor(
    private annualPlanService: AnnualPlanService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAnnualPlans();

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'year', header: 'Year' },
      { field: 'auditaUniverseName', header: 'Audit Universe' },
      { field: 'riskScore', header: 'Risk score' },
      { field: 'riskLevel', header: 'Risk Level' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  getAnnualPlans(): void {
    this.subscriptions.push(
      this.annualPlanService.getAnnualPlans().subscribe(
        (response: any) => {
          this.annualPlan = response.result;
          this.annualPlanDisplay = this.annualPlan.map((obj: any) => ({
            ...obj,
            auditaUniverseName: obj.auditUniverse
              ? obj.auditUniverse.name
              : null,
          }));
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  createNewAnnualPlan(): void {
    const ref = this.dialogService.open(NewAnnualPlanComponent, {
      header: 'Create a new audit plan',
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.getAnnualPlans();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: response.message,
        });
      }
    });
  }

  updateAnnualPlan(id: number): void {
    const annualPlan = this.annualPlan.find((plan) => plan.id === id);
    const ref = this.dialogService.open(NewAnnualPlanComponent, {
      header: 'Update annual plan',
      width: '40%',
      data: { annualPlan },
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.annualPlan = this.annualPlan.map((plan) =>
          plan.id === response.id ? response : plan
        );
        if (response.status) {
          this.getAnnualPlans();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: response.message,
          });
        }
      }
    });
  }

  getAuditAnnualInfo(id: number): AnnualPlanDTO[] {
    let auditUniv = new AnnualPlanDTO();
    auditUniv.id = id;
    this.subscriptions.push(
      this.annualPlanService.getAnnualPlanInfo(auditUniv).subscribe(
        (response: any) => {
          this.auditAnnualR = [response.result];
          this.annualInfo = response.result;
          this.selectedAnnualInfo = this.annualInfo;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          setTimeout(() => {}, 1000);
        }
      )
    );
    return this.auditAnnualR;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.annualPlanDisplay);
        doc.save('annual-plan.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.annualPlanDisplay);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
