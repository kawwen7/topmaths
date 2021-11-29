import { Component, isDevMode, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/mystyles.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy {
  ongletActif: string
  event$: any

  constructor(private router: Router, public dataService: ApiService) {
    this.redirectionHTTPS()
    this.ongletActif = 'accueil'
    this.recupereOngletActif()
    this.recupereProfil()
    this.observeChangementsDeRoute()
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Observe les changements de route,
   * met ensuite à jour le lastAction
   */
  observeChangementsDeRoute() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.majPseudoClique()
        if (this.dataService.isloggedIn) {
          this.dataService.majLastAction() // le whosOnline est compris dans le majLastAction
        } else {
          this.dataService.recupWhosOnline()
        }
      }
    });
  }

  /**
   * Fait en sorte que le pseudoClique ne soit conservé qu'une seule navigation
   */
  majPseudoClique() {
    if (this.dataService.pseudoClique != '') {
      if (this.dataService.pseudoClique === this.dataService.ancienPseudoClique) {
        this.dataService.pseudoClique = ''
        this.dataService.ancienPseudoClique = ''
      } else {
        this.dataService.ancienPseudoClique = this.dataService.pseudoClique
      }
    }
  }
  /**
   * Redirige vers une version sécurisée du site si on n'est pas en mode développement
   */
  redirectionHTTPS() {
    if (!isDevMode() && window.location.protocol == 'http:') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }

  /**
   * Vérifie la présence d'un token de connexion et récupère le profil utilisateur le cas échéant
   */
  recupereProfil() {
    const identifiant = this.dataService.getToken()
    if (identifiant != null) {
      this.dataService.login(identifiant, false)
    }
  }
  /**
   * Récupère l'onglet actif à partir de l'url pour le mettre en surbrillance.
   */
  recupereOngletActif() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[1]
        if (this.ongletActif == '') {
          this.ongletActif = 'accueil'
        }
      }
    });
  }
}
