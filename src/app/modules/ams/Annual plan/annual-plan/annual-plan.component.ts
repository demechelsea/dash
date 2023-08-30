import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { NewAnnualPlanComponent } from '../new-annual-plan/newAnnualPlan.component';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { AutoGenerateAnnualPlanComponent } from 'src/app/modules/ams/Annual plan/auto-geneerate-annualPlan/auto-generate-annualPlan.component';

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
  public annualPlans: AnnualPlanDTO[] = [];
  public risk: AnnualPlanDTO[] = [];

  public annualPlanDisplay: any[] = [];

  public annualPlanR: AnnualPlanDTO[] = [];
  public annualInfo: AnnualPlanDTO;
  selectedAnnualInfo: AnnualPlanDTO;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  private subscriptions: Subscription[] = [];

  constructor(
    private annualPlanService: AnnualPlanService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
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

  generateAnnualPlan(): void {
    const ref = this.dialogService.open(AutoGenerateAnnualPlanComponent, {
      header: 'Generate Annual Plan',
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });
  
    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.annualPlans = response.result;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: response.message,
        });
      }
    });
  }
  
  getAnnualPlans(): void {
    this.subscriptions.push(
      this.annualPlanService.getAnnualPlans().subscribe(
        (response: any) => {
          this.annualPlans = response.result;
          console.log(response);
          console.log(this.annualPlans);
          this.annualPlanDisplay = this.annualPlans.map((obj: any) => ({
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
    const annualPlan = this.annualPlans.find((plan) => plan.id === id);
    console.log('annual', annualPlan);
    const ref = this.dialogService.open(NewAnnualPlanComponent, {
      header: 'Update annual plan',
      width: '40%',
      data: { annualPlan },
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.annualPlans = this.annualPlans.map((plan) =>
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
        this.cd.detectChanges();
      }
    });
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
