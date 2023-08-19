import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { NewAuditScheduleComponent } from '../new-audit-schedule/newAuditSchedule.component';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { AuditScheduleService } from 'src/app/services/audit-schedule/audit-schedule.service';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { AuditScheduleDTO } from 'src/app/views/models/auditSchedule';

interface ExportColumn {
  title: string;
  dataKey: string;
}

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'audit-universe-table',
  templateUrl: './audit-schedule.component.html',
  styleUrls: ['./audit-schedule.component.scss'],
})
export class AuditScheduleComponent implements OnDestroy {
  public annualPlans: AnnualPlanDTO[] = [];
  public auditSchedules: AuditScheduleDTO[] = [];

  public auditUniverseDisplay: any[] = [];

  exportColumns!: ExportColumn[];
  cols!: Column[];

  private subscriptions: Subscription[] = [];

  constructor(
    private auditPlanService: AnnualPlanService,
    private auditScheduleService: AuditScheduleService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAuditSchedules();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'startOn', header: 'Start on' },
      { field: 'endOn', header: 'End on' },
      { field: 'status', header: 'Status' },
      { field: 'auditEngagementName', header: 'Auditable engagement' },
      { field: 'teamMembersName', header: 'Team members' },
      { field: 'annualPlanName', header: 'Annual plan' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  getAuditSchedules(): void {
    this.subscriptions.push(
      this.auditScheduleService.getAuditSchedules().subscribe(
        (response: any) => {
          this.auditSchedules = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  getAnnualPlans(): void {
    this.subscriptions.push(
      this.auditPlanService.getAnnualPlans().subscribe(
        (response: any) => {
          this.annualPlans = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  createNewAuditSchedule(): void {
    const ref = this.dialogService.open(NewAuditScheduleComponent, {
      header: 'Create a new audit schedule',
      draggable: true,
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.getAuditSchedules();
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

  updateAuditSchedule(id: number): void {
    const auditSchedule = this.auditSchedules.find(
      (schedule) => schedule.id === id
    );
    const ref = this.dialogService.open(NewAuditScheduleComponent, {
      header: 'Update audit schedule',
      width: '40%',
      data: { auditSchedule },
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.auditSchedules = this.auditSchedules.map((schedule) =>
          schedule.id === response.id ? response : schedule
        );
        if (response.status) {
          this.getAuditSchedules();
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

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.auditSchedules);
        doc.save('audit-universe.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.auditSchedules);
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
