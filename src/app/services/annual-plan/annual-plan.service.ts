import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnnualPlanDTO } from '../../views/models/annualPlan';
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
    this.apiServiceUrl = 'http://10.1.11.143:8095';
  }

  constructor(private http: HttpClient) {}

  public getAnnualPlans(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/ams/annualPlan/listAll`,
      this.httpOptions
    );
  }

  public getAnnualPlanInfo(annualPlan: AnnualPlanDTO): Observable<any>{
    this.init();
    return this.http.post<any>(`${this.apiServiceUrl}/ams/annualPlan/findById`,annualPlan, this.httpOptions)
  }

  public addAnnualPlan(annualPlan: AnnualPlanDTO): Observable<any> {
    this.init();
    return this.http.post(
      `${this.apiServiceUrl}/ams/annualPlan/register`,
      annualPlan,
      this.httpOptions
    );
  }

  public updateAnnualPlan(annualPlan: AnnualPlanDTO): Observable<any>{
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/annualPlan/update`, annualPlan, this.httpOptions)
  }
}


