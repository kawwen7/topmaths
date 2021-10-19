import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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

  constructor(public http: HttpClient) {
    this.lignes = []
  }

  ngOnInit(): void {
    this.http.get('assets/data/objectifs.json').subscribe(
      (data: any) => {
        this.lignes = [] // va contenir toutes les lignes à afficher.
        for (const niveau of data) {
          this.lignes.push({ niveau: niveau.niveau })
          for (const theme of niveau.themes) {
            this.lignes.push({ theme: theme.nom })
            for (const sous_theme of theme.sous_themes) {
              this.lignes.push({ sous_theme: sous_theme.nom })
              for (const reference of sous_theme.objectifs) {
                this.lignes.push(reference)
              }
            }
          }
        }
      }
    )
  }

}
