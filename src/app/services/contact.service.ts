import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

   private apiUrl = 'api/sms/send'; 
  
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<any> {
        const body = { email, password }; 
        return this.http.post<any>(this.apiUrl, body);
        const headers = {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        };
    }
}
