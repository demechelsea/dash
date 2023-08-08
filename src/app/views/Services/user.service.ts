import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserP } from '../models/userP';

const httpOptions = {
  
  headers: new HttpHeaders({'content-type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`})
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiServiceUrl = 'http://localhost:8080';

  constructor(private http: HttpClient){}

  public getUsers(): Observable<User[]>{
    return this.http.get<any>(`${this.apiServiceUrl}/user/all`,httpOptions)
  }
  public getUser(id: number): Observable<User>{
    return this.http.get<any>(`${this.apiServiceUrl}/user/find/${id}`,httpOptions)
  
  }
  public addUser(user: UserP): Observable<any>{

    return this.http.post<UserP>(`${this.apiServiceUrl}/user/add/${user.role}`, {
      password: user.password,
      isActive: true,
      username : user.username,
      employee: {
          id: user.employee,
      },
      roles: [],
      role: user.role
      
    }, httpOptions)
  }
  public updateUser(user: User): Observable<User>{

    return this.http.put<User>(`${this.apiServiceUrl}/user/update/${user.active}`,{
      id: user.id,
      password: user.password,
      isActive: user.active,
      username : user.username,
      employee: {
          id: user.employee,
      }
      //roles: [user.roles]
    }, httpOptions)
  }
  public deleteUser(userId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServiceUrl}/user/delete/${userId}`,httpOptions)
  }

}
