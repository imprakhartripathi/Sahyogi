import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private apiUrl = 'http://localhost:4200/getcurusr'; // Adjust as needed

  constructor(private http: HttpClient) {}

  sendToken(token: string): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
