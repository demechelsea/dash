import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';
import { NewAuditUniverseComponent } from '../new-audit-universe/newAuditUniverse.component';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'audit-universe-table',
  templateUrl: './audit-universe.component.html',
  styleUrls: ['./audit-universe.component.scss'],
})
export class AuditUniverseComponent implements OnDestroy {
  public auditUniverse: AuditUniverseDTO[] = [];

  public auditUniverseR: AuditUniverseDTO[] = [];
  public universeInfo: AuditUniverseDTO;
  selectedUniverseInfo: AuditUniverseDTO;

  private subscriptions: Subscription[] = [];

  constructor(
    private auditUniverseService: AuditUniverseService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAuditUniverses();
  }

  getAuditUniverses(): void {
    this.subscriptions.push(
      this.auditUniverseService.getAuditUniverse().subscribe(
        (response: any) => {
          this.auditUniverse = response.result;
        },
        (error: HttpErrorResponse) => {}
      )
    );
  }

  createNewAuditUniverse(): void {
    const ref = this.dialogService.open(NewAuditUniverseComponent, {
      header: 'Create a new audit universe',
      draggable: true,
      width: '40%',
      contentStyle: { 'min-height': 'auto', overflow: 'auto'},
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
      header: 'Update auditable area',
      width: '40%',
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

  public getAuditUniverseInfo(id: number): AuditUniverseDTO[] {
    let auditUniv = new AuditUniverseDTO();
    auditUniv.id = id;
    this.subscriptions.push(
      this.auditUniverseService
        .getAuditUniverseInfo(auditUniv)
        .subscribe((response: any) => {
          this.auditUniverseR = [response.result];
          this.universeInfo = response.result;
          this.selectedUniverseInfo = this.universeInfo;
        })
    );
    return this.auditUniverseR;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
