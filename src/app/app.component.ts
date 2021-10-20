import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/mystyles.css']
})
export class AppComponent implements OnDestroy {
  ongletActif: string
  event$: any
  constructor(private router: Router) {
    this.ongletActif = 'accueil'
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[1]
      }
    });
  }
  ngOnDestroy() {
    this.event$.unsubscribe();
  }
}
