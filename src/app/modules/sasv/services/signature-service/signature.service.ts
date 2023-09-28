import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignatureDTO } from '../../models/signature';
@Injectable({
  providedIn: 'root',
})
export class SignatureService {
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

  public createSignature(signatureDTO: SignatureDTO): Observable<any> {
    this.init();
    return this.http.post<any>(
      `${this.apiServiceUrl}/sasv/authority/signature`,signatureDTO,
      this.httpOptions
    );
  }

  public getSignatureList(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/sasv/authority/signature/all`,
      this.httpOptions
    );
  }
}


