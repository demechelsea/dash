import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnnualPlanDTO } from '../../views/models/annualPlan';
import { AutoGenerateAnnualPlanDTO } from '../../views/models/autoGenerateAnnualPlan';
import { AuditScheduleDTO } from 'src/app/views/models/auditSchedule';

@Injectable({
  providedIn: 'root',
})
export class AnnualPlanService {
  private httpOptions: any;
  private apiServiceUrl: any;

  private init() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }),
    };
    this.apiServiceUrl = 'http://localhost:8099';
  }

  constructor(private http: HttpClient) { }

  public getAnnualPlans(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/ams/annualPlan/listAll`,
      this.httpOptions
    );
  }

  public addAnnualPlan(annualPlan: AnnualPlanDTO): Observable<any> {
    this.init();
    return this.http.post(
      `${this.apiServiceUrl}/ams/annualPlan/register`,
      annualPlan,
      this.httpOptions
    );
  }

  public updateAnnualPlan(annualPlan: AnnualPlanDTO): Observable<any> {
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/annualPlan/update`, annualPlan, this.httpOptions)
  }

  public addToSchedule(auditSchedule: AuditScheduleDTO): Observable<any> {
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/annualPlan/addToSchedule`, auditSchedule, this.httpOptions)
  }

  public plannedList(): Observable<any> {
    this.init();
    return this.http.get(`${this.apiServiceUrl}/ams/annualPlan/planedList`, this.httpOptions)
  }

  public generateAnnualPlan(autogeneratePlan: AutoGenerateAnnualPlanDTO): Observable<any> {
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/annualPlan/autoGenerate`, autogeneratePlan, this.httpOptions)
  }
}
