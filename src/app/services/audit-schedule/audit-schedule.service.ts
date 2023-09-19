import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditScheduleDTO } from '../../views/models/auditSchedule';
@Injectable({
  providedIn: 'root',
})
export class AuditScheduleService {
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

  constructor(private http: HttpClient) {}

  public getAuditSchedules(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/ams/auditSchedule/listAll`,
      this.httpOptions
    );
  }

  public getAuditScheduleInfo(
    auditSchedule: AuditScheduleDTO
  ): Observable<any> {
    this.init();
    return this.http.post<any>(
      `${this.apiServiceUrl}/ams/auditSchedule/findById`,
      auditSchedule,
      this.httpOptions
    );
  }

  public addAuditSchedule(auditSchedule: AuditScheduleDTO): Observable<any> {
    this.init();
    return this.http.post(
      `${this.apiServiceUrl}/ams/auditSchedule/register`,
      auditSchedule,
      this.httpOptions
    );
  }

  public updateAuditSchedule(auditSchedule: AuditScheduleDTO): Observable<any> {
    this.init();
    return this.http.post(
      `${this.apiServiceUrl}/ams/auditSchedule/update`,
      auditSchedule,
      this.httpOptions
    );
  }
}
