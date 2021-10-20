import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

interface Exercice {
  couleur: string;
  slug: string;
  lien: string
}

@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class ObjectifComponent implements OnInit {
  reference: string
  titre: string
  rappelDuCoursHTML: string
  rappelDuCoursImage: string
  slugVideo: string
  VideoSrc: string
  auteurVideo: string
  lienAuteurVideo: string
  exercices: Exercice[]

  constructor(public http: HttpClient, private route: ActivatedRoute) {
    this.reference = ''
    this.titre = ''
    this.rappelDuCoursHTML = ''
    this.rappelDuCoursImage = ''
    this.slugVideo = ''
    this.VideoSrc = ''
    this.auteurVideo = ''
    this.lienAuteurVideo = ''
    this.exercices = []
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reference = params.ref
    })
    this.http.get('assets/data/objectifs.json').subscribe((data: any) => {
      // On cherche dans le json la bonne référence
      data.find((niveau: any) => {
        return niveau.themes.find((theme: any) => {
          return theme.sousThemes.find((sousTheme: any) => {
            return sousTheme.objectifs.find((objectif: any) => {
              // Une fois qu'on l'a trouvée, on modifie les attributs
              if (objectif.reference == this.reference) {
                this.titre = `${objectif.reference} : ${objectif.titre}`
                this.rappelDuCoursHTML = objectif.rappelDuCoursHTML
                if (objectif.rappelDuCoursImage == '') {
                  this.rappelDuCoursImage = '' // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
                } else {
                  this.rappelDuCoursImage = '../assets/img/' + objectif.rappelDuCoursImage
                }
                this.slugVideo = objectif.slugVideo
                this.VideoSrc = "https://www.youtube.com/embed/" + this.slugVideo
                this.auteurVideo = objectif.auteurVideo
                this.lienAuteurVideo = objectif.lienAuteurVideo
                this.exercices = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
                // Le nombre d'exercices varie selon la référence, on a donc quelque chose de dynamique
                for (let i = 0; i < objectif.exercices.length; i++) {
                  if (objectif.exercices[i].slug != '') {
                    this.exercices.push({
                      couleur: objectif.exercices[i].couleur,
                      slug: objectif.exercices[i].slug,
                      lien: 'https://coopmaths.fr/exercice.html?ex=' + objectif.exercices[i].slug + 'i=0&v=e'
                    })
                  }
                }
              }
              return objectif.reference == this.reference;
            })
          })
        })
      })
    })
  }
}
