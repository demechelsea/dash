import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnnualPlanDTO } from '../../views/models/annualPlan';
import { AutoGenerateAnnualPlanDTO } from '../../views/models/autoGenerateAnnualPlan';

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
    this.apiServiceUrl = 'http://10.1.11.143:8091';
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

  public addToSchedule(annualPlan: AnnualPlanDTO): Observable<any> {
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/annualPlan/addToSchedule`, annualPlan, this.httpOptions)
  }

  public plannedList(annualPlan: AnnualPlanDTO): Observable<any> {
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/annualPlan/planedList`, annualPlan, this.httpOptions)
  }

  public generateAnnualPlan(autogeneratePlan: AutoGenerateAnnualPlanDTO): Observable<any> {
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/annualPlan/autoGenerate`, autogeneratePlan, this.httpOptions)
  }
}
