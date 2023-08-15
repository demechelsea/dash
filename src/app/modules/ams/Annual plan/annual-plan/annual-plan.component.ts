import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';

@Component({
  selector: 'annual-plan-table',
  templateUrl: './annual-plan.component.html',
  styleUrls: ['./annual-plan.component.scss'],
})
export class AnnualPlanComponent {
  public annualPlan: AnnualPlanDTO[] = [];
  public risk: AnnualPlanDTO[] = [];

  public accounts: AuditUniverseDTO[] = [];
  public auditAnnualR: AnnualPlanDTO[] = [];
  public annualInfo: AnnualPlanDTO;
  selectedAnnualInfo: AnnualPlanDTO;

  constructor(
    private annualPlanService: AnnualPlanService,
    private auditUniverseService: AuditUniverseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAuditUniverses();
  }

  public getAuditUniverses(): void {
    this.annualPlanService.getAnnualPlans().subscribe(
      (response: any) => {
        this.annualPlan = response.result;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  updateAuditPlan(id: number): void {
    this.getAuditAnnualInfo(id);
    this.router.navigate(['ams/newAnnualPlan', id]);
  }

  public getAuditAnnualInfo(id: number): AnnualPlanDTO[] {
    let auditUniv = new AnnualPlanDTO();
    auditUniv.id = id;
    this.annualPlanService.getAnnualPlanInfo(auditUniv).subscribe(
      (response: any) => {    
        console.log("res", response);
            
        this.auditAnnualR = [response.result];
        this.annualInfo = response.result;
        this.selectedAnnualInfo = this.annualInfo;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        setTimeout(() => {}, 1000);
      }
    );
    return this.auditAnnualR;
  }
}
