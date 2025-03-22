import { Injectable } from '@angular/core';
import { TokenService } from '../token.service/token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetCurrentUserService {
  constructor(private tokenService: TokenService) {}

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return this.tokenService.sendToken(token);
  }
}
