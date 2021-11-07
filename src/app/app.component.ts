import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { ApiService } from './services/api.service';
import { User } from './services/user';

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
    this.ongletActif = 'accueil'
    this.recupereOngletActif()
    this.surveilleChangementProfil()
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
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

  /**
   * Écoute l'événement qui prévient d'une mise à jour du profil.
   * Lance this.majProfil(user) en réponse à chaque événement.
   */
  private surveilleChangementProfil() {
    this.dataService.majProfil.subscribe(user =>
      this.dataService.user.lienAvatar = user.lienAvatar
    );
  }

  /**
   * Supprime le token de clé 'identifiant' utilisé pour vérifier si l'utilisateur est connecté.
   * Supprime aussi le token de clé 'lienAvatar'
   * Toggle les profilbtn et loginbtn.
   * Renvoie vers l'accueil.
   */
  logout() {
    this.dataService.deleteToken('identifiant');
    this.dataService.deleteToken('lienAvatar');
    this.dataService.user.identifiant = ''
    this.dataService.user.lienAvatar = ''
    this.router.navigate(['accueil'])
  }
}
