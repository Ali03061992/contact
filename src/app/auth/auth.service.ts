import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'api/auth/login'; // URL de l'API

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password }; 
    return this.http.post<any>(this.apiUrl, body);
  }
}