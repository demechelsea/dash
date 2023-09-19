import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CkeckListItemDTO } from '../../views/models/checkListItem';
import { AuditableAreasDTO } from 'src/app/views/models/auditableAreas';

@Injectable({
  providedIn: 'root',
})
export class CheckListService {
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

  public getChecklists(): Observable<any> {
    this.init();
    return this.http.get<any>(
      `${this.apiServiceUrl}/ams/checkListItem/listAll`,
      this.httpOptions
    );
  }

  public getChecklistsById(auditableArea: AuditableAreasDTO): Observable<any> {
    this.init();
    return this.http.post<any>(
      `${this.apiServiceUrl}/ams/checkListItem/listAll`,auditableArea,
      this.httpOptions
    );
  }

  public getCheckListInfo(checkList: CkeckListItemDTO): Observable<any>{
    this.init();
    return this.http.post<any>(`${this.apiServiceUrl}/ams/checkListItem/findById`,checkList, this.httpOptions)
  }

  public addCheckList(checkList: CkeckListItemDTO): Observable<any> {
    this.init();
    return this.http.post(
      `${this.apiServiceUrl}/ams/checkListItem/register`,
      checkList,
      this.httpOptions
    );
  }

  public updateCheckList(checkList: CkeckListItemDTO): Observable<any>{
    this.init();
    return this.http.post(`${this.apiServiceUrl}/ams/checkListItem/update`, checkList, this.httpOptions)
  }
}



