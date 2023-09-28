import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StampDTO } from '../../models/stamp';

@Injectable({
  providedIn: 'root',
})
export class StampService {
  private httpOptions: any;
  private apiServiceUrl: any;

  private init() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }),
    };
    this.apiServiceUrl = 'http://localhost:8087';
  }

  constructor(private http: HttpClient) {}

  public createStamp(stamp: StampDTO): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/stamp`,
      this.httpOptions
    );
  }

  public getStampList(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/stamp/all`,
      this.httpOptions
    );
  }
}


