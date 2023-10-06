import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { NewAuditUniverseComponent } from '../new-audit-universe/newAuditUniverse.component';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';

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
  templateUrl: './audit-universe.component.html',
  styleUrls: ['./audit-universe.component.scss'],
})
export class AuditUniverseComponent implements OnDestroy {
  public auditUniverse: AuditUniverseDTO[] = [];
  public auditUniverseDisplay: any[] = [];

  public universeInfo: AuditUniverseDTO;
  selectedUniverseInfo: AuditUniverseDTO;

  approved: false;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  private subscriptions: Subscription[] = [];

  constructor(
    private auditUniverseService: AuditUniverseService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getAuditUniverses();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'auditType', header: 'Auditable Type' },
      { field: 'status', header: 'Status' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  getAuditUniverses(): void {
    this.subscriptions.push(
      this.auditUniverseService.getAuditUniverse().subscribe(
        (response: any) => {
          this.auditUniverse = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  approveAuditUniverse(id: number): void {
    const auditUniverse = new AuditUniverseDTO;
    auditUniverse.id = id;
    this.subscriptions.push(
      this.auditUniverseService.approveAuditUniverse(auditUniverse).subscribe(
        (response: any) => {
          this.getAuditUniverses();
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  createNewAuditUniverse(): void {
    const ref = this.dialogService.open(NewAuditUniverseComponent, {
      header: 'Create a new audit universe',
      draggable: true,
      width: '50%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.getAuditUniverses();
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

  updateAuditUniverse(id: number): void {
    const auditUniverse = this.auditUniverse.find(
      (universe) => universe.id === id
    );
    const ref = this.dialogService.open(NewAuditUniverseComponent, {
      header: 'Update audit universe',
      draggable: true,
      width: '50%',
      data: { auditUniverse },
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.auditUniverse = this.auditUniverse.map((universe) =>
          universe.id === response.id ? response : universe
        );
        if (response.status) {
          this.getAuditUniverses();
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
        (doc as any).autoTable(this.exportColumns, this.auditUniverse);
        doc.save('Audit universe.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const data = this.auditUniverse.map(universe => ({
        id: universe.id,
        name: universe.name,
        description: universe.description,
        auditType: universe.auditType,
        status: universe.status
      }));
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const dataBlob = new Blob([excelBuffer], { type: EXCEL_TYPE });
      this.saveAsExcelFile(dataBlob, 'Audit universe');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_EXTENSION = '.xlsx';
    FileSaver.saveAs(
      buffer,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
