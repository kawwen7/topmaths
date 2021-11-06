import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Video {
  titre: string,
  slug: string,
  auteur: string,
  lienAuteur: string,
  lienVideo: string
}

interface Exercice {
  couleur: string,
  slug: string,
  graine: string,
  lien: string,
  lienACopier?: string
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
  videos: Video[]
  exercices: Exercice[]
  lienFiche: string
  lienAnki: string

  constructor(public http: HttpClient, private route: ActivatedRoute) {
    this.reference = ''
    this.titre = ''
    this.rappelDuCoursHTML = ''
    this.rappelDuCoursImage = ''
    this.videos = []
    this.exercices = []
    this.lienFiche = ''
    this.lienAnki = ''
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
    this.ecouteMessagesPost()
  }

  /**
   * Ecoute les messages Post pour récupérer l'url et modifier le lien à copier des exercices
   */
  ecouteMessagesPost(){
    window.addEventListener('message', (event) => {
      const url: string = event.data.url;
      if (typeof (url) != 'undefined') {
        for (const exercice of this.exercices) {
          if (typeof (exercice.lienACopier) != 'undefined') {
            if (url.split('&serie=')[0].split(',i=')[0] == exercice.lienACopier.split('&serie=')[0].split(',i=')[0]) { // Lorsqu'un exercice n'est pas interactifReady, le ,i=0 est retiré de l'url
              exercice.lienACopier = url
            }
          }
        }
      }
    });}
  /**
   * Observe les changements de route,
   * modifie ensuite les paramètres selon la référence
   */
  observeChangementsDeRoute() {
    this.route.params.subscribe(params => {
      this.reference = params.ref
      this.modificationDesAttributs()
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
    this.videos = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
    // Le nombre de vidéos varie selon la référence, on a donc quelque chose de dynamique
    for (const video of objectif.videos) {
      if (video.slug != '') {
        this.videos.push({
          titre: video.titre,
          slug: video.slug,
          auteur: video.auteur,
          lienAuteur: video.lienAuteur,
          lienVideo: "https://www.youtube.com/embed/" + video.slug
        })
      }
    }
    this.exercices = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
    // Le nombre d'exercices varie selon la référence, on a donc quelque chose de dynamique
    for (const exercice of objectif.exercices) {
      if (exercice.slug != '') {
        exercice.graine = Math.random().toString(16).substr(2, 4)
        this.exercices.push({
          couleur: '',
          slug: exercice.slug,
          graine: exercice.graine,
          lien: `https://coopmaths.fr/mathalea.html?ex=${exercice.slug},i=0&serie=${exercice.graine}&v=embed&p=1.5`
        })
        this.exercices[this.exercices.length - 1].lienACopier = this.exercices[this.exercices.length - 1].lien
        if (exercice.slug.slice(0, 4) == 'http') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug
        }
      }
      // On ajoute la couleur selon le nombre d'exercices
      this.exercices[this.exercices.length - 1].couleur = "Vert Foncé"
      switch (this.exercices.length) {
        case 1:
          this.exercices[0].couleur = 'Vert Foncé'
          break;
        case 2:
          this.exercices[0].couleur = 'Vert Clair'
          this.exercices[1].couleur = 'Vert Foncé'
          break;
        case 3:
          this.exercices[0].couleur = 'Jaune'
          this.exercices[1].couleur = 'Vert Clair'
          this.exercices[2].couleur = 'Vert Foncé'
          break;

        default:
          break;
      }
    }
  }

  /**
   * Copie dans le presse papier le lien vers un exercice
   * @param exercice 
   */
  copierLien(exercice: Exercice) {
    if (typeof (exercice.lienACopier) != 'undefined') {
      navigator.clipboard.writeText(exercice.lienACopier);
      alert('Le lien vers l\'exercice a été copié')
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
