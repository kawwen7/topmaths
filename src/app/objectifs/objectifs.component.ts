import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationStart, Event as NavigationEvent } from '@angular/router';

/**
 * Type d'objet de toutes les lignes qui seront affichées
 * Si c'est un niveau (5e, 4e...), l'attribut niveau sera complété et les autres seront null
 * Si c'est un thème (Nombres et Calculs, Géométrie...), l'attribut theme sera complété et les autres seront null etc.
 * De cette façon, les *ngIf du html sauront comment les afficher
 */
interface Ligne {
  niveau?: string;
  theme?: string;
  sous_theme?: string;
  reference?: string;
  titre?: string
}
@Component({
  selector: 'app-objectifs',
  templateUrl: './objectifs.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class ObjectifsComponent implements OnInit {
  lignes: Ligne[]
  filtre: Ligne
  event$: any
  ongletActif: string

  constructor(public http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.lignes = []
    this.filtre = {}
    this.ongletActif = 'tout'
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[2]
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.filtre.niveau = params.niveau
      this.filtre.theme = params.theme
      this.filtre.sous_theme = params.sous_theme
    })
    this.http.get('assets/data/objectifs.json').subscribe(
      (data: any) => {
        this.lignes = [] // va contenir toutes les lignes à afficher.
        for (const niveau of data) {
          this.lignes.push({ niveau: niveau.niveau })
          for (const theme of niveau.themes) {
            this.lignes.push({ niveau: niveau.niveau, theme: theme.nom })
            for (const sous_theme of theme.sous_themes) {
              this.lignes.push({ niveau: niveau.niveau, theme: theme.nom, sous_theme: sous_theme.nom })
              for (const objectif of sous_theme.objectifs) {
                this.lignes.push({niveau: niveau.niveau, theme: theme.nom, sous_theme: sous_theme.nom, reference: objectif.reference, titre: objectif.titre})
              }
            }
          }
        }
      }
    )
  }
  
  ngOnDestroy() {
    this.event$.unsubscribe();
  }

}
