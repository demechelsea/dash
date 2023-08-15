import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditableAreasDTO } from '../../views/models/auditableAreas';
@Injectable({
  providedIn: 'root',
})
export class AuditableAreasService {
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

  public getAuditableAreas(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/ams/auditableArea/listAll`,
      this.httpOptions
    );
  }

  public getAuditableAreaInfo(auditableAreas: AuditableAreasDTO): Observable<any>{
    this.init();
    return this.http.post<any>(`${this.apiServiceUrl}/ams/auditableArea/findById`,auditableAreas, this.httpOptions)
  }

  public addAuditableArea(auditableAreas: AuditableAreasDTO): Observable<any> {
    this.init();
    return this.http.post(
      `${this.apiServiceUrl}/ams/auditableArea/register`,
      auditableAreas,
      this.httpOptions
    );
  }

  public updateAuditableAreas(auditableAreas: AuditableAreasDTO): Observable<any>{
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/auditableArea/update`, auditableAreas, this.httpOptions)
  }
}
