import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditUniverseDTO } from '../../views/models/auditUniverse';
@Injectable({
  providedIn: 'root',
})
export class AuditUniverseService {
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
      `${this.apiServiceUrl}/employee/all`,
      this.httpOptions
    );
  }

  public getAuditUniverse(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/ams/auditUniverse/listAll`,
      this.httpOptions
    );
  }

  public getAuditUniverseInfo(auditUniverse: AuditUniverseDTO): Observable<any>{
    this.init();
    return this.http.post<any>(`${this.apiServiceUrl}/ams/auditUniverse/findById`,auditUniverse, this.httpOptions)
  }



  public addAuditUniverse(auditUniverse: AuditUniverseDTO): Observable<any> {
    this.init();
    return this.http.post(
      `${this.apiServiceUrl}/ams/auditUniverse/register`,
      auditUniverse,
      this.httpOptions
    );
  }

  public updateAuditUniverse(auditUniverse: AuditUniverseDTO): Observable<any>{
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/auditUniverse/update`, auditUniverse, this.httpOptions)
  }

  // public deleteAccount(accountId: number): Observable<any>{
  //   this.init();
  //   return this.http.delete<void>(`${this.apiServiceUrl}/ams/auditUniverse/dele`, this.httpOptions)
  // }
}

// private static final String APPLICATION_CONTEXT = "ams";
// private static final String REGISTER = "register";
// private static final String LIST_ALL = "listAll";
// private static final String FIND_BY_ID = "findById/{id}";
// private static final String UPDATE = "update";
