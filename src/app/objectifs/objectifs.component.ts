import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { Niveau } from '../services/objectifs';

/**
 * Type d'objet de toutes les lignes qui seront affichées
 * Si c'est un niveau (5e, 4e...), l'attribut niveau sera complété et les autres seront null
 * Si c'est un thème (Nombres et Calculs, Géométrie...), l'attribut theme sera complété et les autres seront null etc.
 * De cette façon, les *ngIf du html sauront comment les afficher
 */
interface Ligne {
  niveau?: string;
  theme?: string;
  sousTheme?: string;
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
    this.recupereOngletActif()
  }

  ngOnInit(): void {
    this.recupereParametresUrl()
    this.recupereContenuLignesAAfficher()
  }
  
  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Récupère l'onglet actif à partir de l'url pour le mettre en surbrillance
   */
  recupereOngletActif(){
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[2]
      }
    });
  }

  /**
   * Récupère le niveau, le thème et le sous-thème à partir de l'url afin de pouvoir éventuellement les filtrer
   */
  recupereParametresUrl(){
    this.route.params.subscribe(params => {
      this.filtre.niveau = params.niveau
      this.filtre.theme = params.theme
      this.filtre.sousTheme = params.sousTheme
    })
  }

  /**
   * Récupère les niveaux, thèmes, sous-thèmes et références de objectifs.json et les ajoute à this.lignes pour pouvoir les afficher
   */
  recupereContenuLignesAAfficher(){
    this.http.get<Niveau[]>('assets/data/objectifs.json').subscribe(niveaux => {
        this.lignes = [] // va contenir toutes les lignes à afficher.
        for (const niveau of niveaux) {
          this.lignes.push({ niveau: niveau.nom })
          for (const theme of niveau.themes) {
            this.lignes.push({ niveau: niveau.nom, theme: theme.nom })
            for (const sousTheme of theme.sousThemes) {
              this.lignes.push({ niveau: niveau.nom, theme: theme.nom, sousTheme: sousTheme.nom })
              for (const objectif of sousTheme.objectifs) {
                this.lignes.push({niveau: niveau.nom, theme: theme.nom, sousTheme: sousTheme.nom, reference: objectif.reference, titre: objectif.titre})
              }
            }
          }
        }
      }
    )
  }
}
