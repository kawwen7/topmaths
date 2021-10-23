import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/mystyles.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy {
  ongletActif: string
  event$: any
  constructor(private router: Router) {
    this.ongletActif = 'accueil'
    this.recupereOngletActif()
  }
  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Récupère l'onglet actif à partir de l'url pour le mettre en surbrillance
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
