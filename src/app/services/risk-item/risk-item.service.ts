import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnnualPlanDTO } from '../../views/models/annualPlan';
@Injectable({
  providedIn: 'root',
})
export class RiskItemService {
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

  constructor(private http: HttpClient) {}

  public getRiskItems(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/ams/risk/listRiskItem`,
      this.httpOptions
    );
  }


  // public static final String AUDIT_RISK= APPLICATION_CONTEXT + "/risk/";
  // public static final String RISK_ITEM_LIST_ALL = AUDIT_RISK + "listRiskItem";
  // public static final String RISK_SCORE_BY_ANNUAL_ID = AUDIT_RISK + "riskScoreByAnn";
  // public static final String GET_RISK_LEVEL = AUDIT_RISK + "riskLevel";
}


