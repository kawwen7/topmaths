import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthguardGuard implements CanActivate {
  constructor(private dataService: ApiService, private router: Router) { }

  /**
   * Fonction qui sert à déterminer si l'utilisateur a le droit d'emprunter une route
   * @param route 
   * @param state 
   * @returns 
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const routeurl: string = state.url;
    return this.isLogin(routeurl);
  }

  /**
   * Vérifie si l'utilisateur est connecté avant de le laisser emprunter une route
   * S'il ne l'est pas, enregistre le redirectUrl et l'envoie vers la page de connexion
   * @param routeurl Destination que l'utilisateur veut emprunter
   * @returns vrai s'il a le droit de l'emprunter, faux sinon
   */
  isLogin(routeurl: string) {
    if (this.dataService.isloggedIn) {
      return true;
    }
    this.dataService.redirectUrl = routeurl;
    this.router.navigate(['/login'], { queryParams: { returnUrl: routeurl } });
    return false;
  }
}