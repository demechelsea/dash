import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyHistoryDTO } from 'src/app/views/models/dailyHistory';
import { WeeklyDTO } from 'src/app/views/models/weekly report';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private httpOptions: any;
  private apiServiceUrl: any;

  private init() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }),
    };
    this.apiServiceUrl = 'http://10.1.11.44:8088';
  }

  constructor(private http: HttpClient) {}

  public getAllStageNames(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/CMS/JT/getAllStages`,
      this.httpOptions
    );
  }

  public getDailyHistory(weeklyReport: WeeklyDTO): Observable<any> {
    this.init();
    return this.http.post<any>(
      `${this.apiServiceUrl}/CMS/JT/getDailyJTSummaryForSpecificWeek`, weeklyReport,
      this.httpOptions
    );
  }
}
