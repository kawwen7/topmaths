import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  lienFiche: string
  lienAnki: string

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
    this.lienFiche = ''
    this.lienAnki = ''
  }

  ngOnInit(): void {
    this.recupereReference()
    this.modificationDesAttributs()
  }

  /**
   * Récupère la référence de l'objectif à partir de l'url
   */
  recupereReference() {
    this.route.params.subscribe(params => {
      this.reference = params.ref
    })
  }

  /**
   * Ouvre objectifs.json,
   * cherche l'objectif qui a pour référence this.reference,
   * une fois trouvé, lance this.recupereAttributsObjectif(objectif)
   */
  modificationDesAttributs() {
    // On cherche dans le json la bonne référence
    this.http.get('assets/data/objectifs.json').subscribe((data: any) => {
      data.find((niveau: any) => {
        return niveau.themes.find((theme: any) => {
          return theme.sousThemes.find((sousTheme: any) => {
            return sousTheme.objectifs.find((objectif: any) => {
              // Une fois qu'on l'a trouvée, on modifie les attributs
              if (objectif.reference == this.reference) {
                this.recupereAttributsObjectif(objectif)
              }
              return objectif.reference == this.reference;
            })
          })
        })
      })
    })
    // On termine par créer les liens de téléchargement si les fichiers existent
    this.lienFiche = this.creerLienTelechargement('fiche')
    this.lienAnki = this.creerLienTelechargement('anki')
  }

  /**
   * Copie tous les objectif.attribut dans les this.attribut en les travaillant un peu éventuellement
   * @param objectif 
   */
  recupereAttributsObjectif(objectif: any) {
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
    for (const exercice of objectif.exercices) {
      if (exercice.slug != '') {
        this.exercices.push({
          couleur: exercice.couleur,
          slug: exercice.slug,
          lien: 'https://coopmaths.fr/exercice.html?ex=' + exercice.slug + 'i=0&v=e'
        })
      }
    }
  }

  /**
   * Vérifie si le fichier assets/type/niveau/Type_reference.extension existe et renvoie le lien si c'est le cas
   * @param type peut être fiche ou anki
   * le niveau peut être 6e, 5e, 4e ou 3e
   * la référence correspond à this.reference
   * l'extension est apkg si le type est anki, pdf sinon
   * @returns lien de téléchargement du fichier s'il existe, une chaîne vide sinon
   */
  creerLienTelechargement(type: string) {
    let extension: string
    if (type == 'anki') {
      extension = 'apkg'
    } else {
      extension = 'pdf'
    }
    let lien = `assets/${type}/${this.reference.slice(0, 1)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${this.reference}.${extension}`
    if (!this.doesFileExist(lien)) {
      lien = ''
    }
    return lien
  }

  /**
   * Vérifie si un fichier existe ou pas
   * @param urlToFile url du fichier
   * @returns true s'il existe, false sinon
   */
  doesFileExist(urlToFile: string) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == 404) {
      return false;
    } else {
      return true;
    }
  }
}
