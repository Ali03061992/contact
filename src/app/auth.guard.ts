import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Vérifie si le chemin demandé est '/login'
    if (route.routeConfig?.path === 'login') {
      return true;
    }
    
    // Vérifie si l'access_token est présent dans le localStorage
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      // Si le token n'est pas présent, redirige vers la page de login
      this.router.navigate(['/login']);
      return false;
    }

    // Si le token est présent, autorise l'accès à la route
    return true;
  }
}
