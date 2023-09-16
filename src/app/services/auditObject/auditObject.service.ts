import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditObjectDTO } from '../../views/models/auditObject';
@Injectable({
  providedIn: 'root',
})
export class AuditObjectService {
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

  public getAuditObjects(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/ams/auditObject/listAll`,
      this.httpOptions
    );
  }


  public getAuditObjectInfo(auditObject: AuditObjectDTO): Observable<any>{
    this.init();
    return this.http.post<any>(`${this.apiServiceUrl}/ams/auditObject/findById`,auditObject, this.httpOptions)
  }

  public addAuditObject(auditObject: AuditObjectDTO): Observable<any> {
    this.init();
    return this.http.post(
      `${this.apiServiceUrl}/ams/auditObject/register`,
      auditObject,
      this.httpOptions
    );
  }

  public updateAuditObject(auditObject: AuditObjectDTO): Observable<any>{
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/auditObject/update`, auditObject, this.httpOptions)
  }
}
