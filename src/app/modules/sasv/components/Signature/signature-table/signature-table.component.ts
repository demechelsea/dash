import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { NewSignatureComponent } from '../new-signature/newSignature.component';
import { SignatureService } from '../../../services/signature-service/signature.service';
import { SignatureDTO } from '../../../models/signature';

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
  selector: 'signature-table',
  templateUrl: './signature-table.component.html',
  styleUrls: ['./signature-table.component.scss'],
})
export class SignatureTableComponent implements OnDestroy {
  public signatureList: SignatureDTO[] = [];

  public signatureInfo: SignatureDTO;
  selectedSignatureInfo: SignatureDTO;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  private subscriptions: Subscription[] = [];

  constructor(
    private signatureService: SignatureService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getSignatures();
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

  getSignatures(): void {
    this.subscriptions.push(
      this.signatureService.getSignatureList().subscribe(
        (response: any) => {
          this.signatureList = response.result;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  createSignature(): void {
    const ref = this.dialogService.open(NewSignatureComponent, {
      header: 'Create a new signature',
      draggable: true,
      width: '45%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((response: any) => {
      if (response.status) {
        this.getSignatures();
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

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.signatureList);
        doc.save('audit-universe.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.signatureList);
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
