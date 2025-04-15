import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.backendUrl}/getuserinfo`; // Update if needed

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email });
  }
}
