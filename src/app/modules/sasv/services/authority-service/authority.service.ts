import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthorityService {
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

  public createAuthority(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/register`,
      this.httpOptions
    );
  }

  public updateAuthority(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/update`,
      this.httpOptions
    );
  }

  public getActiveAuthority(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/listActive`,
      this.httpOptions
    );
  }

  public deleteAuthority(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/delete`,
      this.httpOptions
    );
  }

  public getAuthorityImage(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/images/{id}`,
      this.httpOptions
    );
  }

  public getAuthoritybyId(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/byId`,
      this.httpOptions
    );
  }

  public getAuthorityList(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/listAll`,
      this.httpOptions
    );
  }
}

