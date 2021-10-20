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
  numero?: number;
  reference?: string;
  titre?: string
}
@Component({
  selector: 'app-sequences',
  templateUrl: './sequences.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class SequencesComponent implements OnInit {
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
    })
    this.http.get('assets/data/sequences.json').subscribe(
      (data: any) => {
        this.lignes = [] // va contenir toutes les lignes à afficher.
        let numeroDeSequence : number
        for (const niveau of data) {
          this.lignes.push({ niveau: niveau.niveau })
          numeroDeSequence = 1
          for (const sequence of niveau.sequences) {
            this.lignes.push({ niveau: niveau.niveau, reference: sequence.reference, titre: sequence.titre, numero: numeroDeSequence })
            numeroDeSequence ++
          }
        }
      }
    )
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

}
