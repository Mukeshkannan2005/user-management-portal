import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getUsers(
    userId: string,
    role: string,
    delay: number = 2000
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/users?userId=${userId}&role=${role}&delay=${delay}`
    );
  }

  addUser(user: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/users`,
      user
    );
  }

  deleteUser(userId: string): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/users/${userId}`
    );
  }

}