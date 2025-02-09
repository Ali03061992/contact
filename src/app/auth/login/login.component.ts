import { Component, importProvidersFrom } from '@angular/core';
import { AuthService, AuthResponse } from '../auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response: AuthResponse) => {
        console.log('Connexion réussie !', response);
        // Stockez les tokens dans le localStorage ou un service de gestion d'état
        localStorage.setItem('access_token', response.tokens.access_token);
        localStorage.setItem('refresh_token', response.tokens.refresh_token);
        this.router.navigate(['/contact']);
      },
      error: (error) => {
        console.error('Erreur de connexion', error);
      },
    });
  }
}