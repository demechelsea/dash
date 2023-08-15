import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AuditUniverseService } from 'src/app/services/auidit-universe/audit-universe.service';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { AuditUniverseDTO } from 'src/app/views/models/auditUniverse';


@Component({
  selector: 'audit-universe-table',
  templateUrl: './annual-plan.component.html',
  styleUrls: ['./annual-plan.component.scss']
})
export class AnnualPlanComponent {

  public annualPlan: AnnualPlanDTO[] = [];
  public risk: AnnualPlanDTO[] = [];

  public accounts: AuditUniverseDTO[] = [];
  public auditUniverseR: AuditUniverseDTO[] = [];
  public universeInfo: AuditUniverseDTO;
  selectedUniverseInfo: AuditUniverseDTO;

  constructor( private annualPlanService: AnnualPlanService,private auditUniverseService: AuditUniverseService,private router:Router) { }


  ngOnInit(){
    this.getAuditUniverses();
  }

  public getAuditUniverses(): void {
    this.annualPlanService.getAnnualPlans().subscribe(
      (response: any) => {
        this.annualPlan = response.result;
        console.log(response)
      },
      (error: HttpErrorResponse) =>{
        console.log(error)
      }
      );
  }

  updateAuditUniverse(id: number): void{
    this.getAuditUniverseInfo(id);
    this.router.navigate(['ams/newAuditUniverse',id]);
  }

  public getAuditUniverseInfo(id: number): AuditUniverseDTO[] {
    let auditUniv = new AuditUniverseDTO();
    auditUniv.id = id
    this.auditUniverseService.getAuditUniverseInfo(auditUniv).subscribe(
      (response: any) => {
        this.auditUniverseR = [response.result];
        this.universeInfo = response.result;
        this.selectedUniverseInfo = this.universeInfo;
      },
      (error: HttpErrorResponse) =>{
        console.log(error);
        setTimeout(() => {
        }, 1000);
        
      }
      );
      return this.auditUniverseR;
  }

}
