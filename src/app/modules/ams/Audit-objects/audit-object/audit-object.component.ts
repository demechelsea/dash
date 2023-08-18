import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuditObjectService } from 'src/app/services/auditObject/auditObject.service';
import { AuditObjectDTO } from 'src/app/views/models/auditObject';
import { NewAuditObjectComponent } from '../new-audit-object/newAuditObject.component';
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
  templateUrl: './audit-object.component.html',
  styleUrls: ['./audit-object.component.scss'],
})
export class AuditObjectComponent {
  public auditObject: AuditObjectDTO[] = [];

  public auditObjectDisplay: any[] = [];

  public auditObjectR: AuditObjectDTO[] = [];
  public auditObjectInfo: AuditObjectDTO;
  selectedAuditObjectInfo: AuditObjectDTO;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  private subscriptions: Subscription[] = [];

  constructor(
    private auditObjectService: AuditObjectService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAuditObjects();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'auditType', header: 'Auditable Type' },
      { field: 'auditaUniverseName', header: 'Audit Universe' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  getAuditObjects(): void {
    this.subscriptions.push(
      this.auditObjectService.getAuditObjects().subscribe(
        (response: any) => {
          this.auditObject = response.result;
          this.auditObjectDisplay = this.auditObject.map((obj: any) => ({
            ...obj,
            auditaUniverseName: obj.auditUniverse
              ? obj.auditUniverse.name
              : null,
          }));
          console.log("iiiii", this.auditObjectDisplay);

        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  createAuditObject(): void {
    const ref = this.dialogService.open(NewAuditObjectComponent, {
      header: 'Create a new audit object',
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.getAuditObjects();
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

  updateAuditObject(id: number): void {
    const auditObject = this.auditObject.find((auditObj) => auditObj.id === id);
    const ref = this.dialogService.open(NewAuditObjectComponent, {
      header: 'Update audit object',
      width: '40%',
      data: { auditObject },
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });
    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.auditObject = this.auditObject.map((auditObj) =>
          auditObj.id === response.id ? response : auditObj
        );
        if (response.status) {
          this.getAuditObjects();
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

  public getAuditObjectInfo(id: number): AuditObjectDTO[] {
    let auditObj = new AuditObjectDTO();
    auditObj.id = id;
    this.subscriptions.push(
      this.auditObjectService
        .getAuditObjectInfo(auditObj)
        .subscribe((response: any) => {
          this.auditObjectR = [response.result];
          this.auditObjectInfo = response.result;
          this.selectedAuditObjectInfo = this.auditObjectInfo;
        })
    );
    return this.auditObjectR;
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
        (doc as any).autoTable(this.exportColumns, this.auditObjectDisplay);
        doc.save('audit-objects.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.auditObjectDisplay);
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
